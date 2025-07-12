const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const { Octokit } = require('@octokit/rest');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Together AI API endpoint
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, context } = req.body;
    
    // Construct the system prompt for code generation
    const systemPrompt = `You are an expert full-stack developer. Generate complete, production-ready code based on the user's request. 

IMPORTANT: Respond with a JSON object in this exact format:
{
  "files": {
    "filename.ext": "file content here",
    "another-file.ext": "content here"
  },
  "message": "Brief description of what was created"
}

Rules:
1. Create complete, working applications
2. Include package.json with all necessary dependencies
3. Use modern best practices
4. Include proper error handling
5. Make the code production-ready
6. For React apps, use functional components and hooks
7. Include proper TypeScript types when applicable
8. Add comments for complex logic

Current project context: ${context ? JSON.stringify(context) : 'No existing files'}

User request: ${prompt}`;

    const response = await axios.post(
      'https://api.together.xyz/v1/chat/completions',
      {
        model: 'codellama/CodeLlama-34b-Instruct-hf',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 4000,
        temperature: 0.1
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiResponse = response.data.choices[0].message.content;
    
    try {
      // Try to parse the JSON response
      const parsedResponse = JSON.parse(aiResponse);
      res.json(parsedResponse);
    } catch (parseError) {
      // If parsing fails, create a simple response
      console.error('Failed to parse AI response:', parseError);
      res.json({
        files: {
          'README.md': aiResponse
        },
        message: 'Generated response (parsing failed, saved as README)'
      });
    }
  } catch (error) {
    console.error('Error generating code:', error);
    res.status(500).json({ 
      error: 'Failed to generate code',
      details: error.message 
    });
  }
});

// GitHub OAuth callback
app.post('/api/github/oauth', async (req, res) => {
  try {
    const { code } = req.body;
    
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code
      },
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    res.status(500).json({ error: 'OAuth failed' });
  }
});

// Create GitHub repository
app.post('/api/github/create-repo', async (req, res) => {
  try {
    const { name, description, private: isPrivate } = req.body;
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No GitHub token provided' });
    }

    const octokit = new Octokit({ auth: token });
    
    const response = await octokit.rest.repos.createForAuthenticatedUser({
      name,
      description,
      private: isPrivate || false,
      auto_init: true
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error creating GitHub repo:', error);
    res.status(500).json({ 
      error: 'Failed to create repository',
      details: error.message 
    });
  }
});

// Push files to GitHub repository
app.post('/api/github/push-files', async (req, res) => {
  try {
    const { repoName, files, commitMessage } = req.body;
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No GitHub token provided' });
    }

    const octokit = new Octokit({ auth: token });
    
    // Get the authenticated user
    const { data: user } = await octokit.rest.users.getAuthenticated();
    const owner = user.login;

    // Get the repository
    const { data: repo } = await octokit.rest.repos.get({
      owner,
      repo: repoName
    });

    // Get the default branch
    const { data: branch } = await octokit.rest.repos.getBranch({
      owner,
      repo: repoName,
      branch: repo.default_branch
    });

    // Create blobs for each file
    const blobs = {};
    for (const [filePath, content] of Object.entries(files)) {
      const { data: blob } = await octokit.rest.git.createBlob({
        owner,
        repo: repoName,
        content: Buffer.from(content).toString('base64'),
        encoding: 'base64'
      });
      blobs[filePath] = blob.sha;
    }

    // Create tree
    const tree = Object.entries(blobs).map(([path, sha]) => ({
      path,
      mode: '100644',
      type: 'blob',
      sha
    }));

    const { data: newTree } = await octokit.rest.git.createTree({
      owner,
      repo: repoName,
      tree,
      base_tree: branch.commit.sha
    });

    // Create commit
    const { data: commit } = await octokit.rest.git.createCommit({
      owner,
      repo: repoName,
      message: commitMessage,
      tree: newTree.sha,
      parents: [branch.commit.sha]
    });

    // Update reference
    await octokit.rest.git.updateRef({
      owner,
      repo: repoName,
      ref: `heads/${repo.default_branch}`,
      sha: commit.sha
    });

    res.json({ 
      success: true, 
      commitSha: commit.sha,
      repoUrl: repo.html_url
    });
  } catch (error) {
    console.error('Error pushing files to GitHub:', error);
    res.status(500).json({ 
      error: 'Failed to push files',
      details: error.message 
    });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`HatchMate-Code server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});