# HatchMate-Code

*Code. Collaborate. Commit.*

HatchMate-Code is a web-based developer environment that allows users to generate, view, edit, run, and deploy full-stack applications with AI assistance. Built with React, TypeScript, and powered by Together AI.

## Features

### 🤖 Chat-Driven AI Coding
- Generate complete full-stack applications using natural language prompts
- Powered by Together AI's CodeLlama model
- Context-aware code generation that understands your existing project

### 📁 File Explorer + Monaco Editor
- Interactive file tree with folder navigation
- Professional code editor with syntax highlighting
- Support for multiple programming languages
- Real-time file editing and management

### 🖥️ WebContainer Runtime
- Browser-based Node.js environment simulation
- Real-time `npm install` and `npm run dev` execution
- Integrated terminal with command output

### 👁️ Live Preview
- Sandboxed iframe preview of your applications
- Auto-reload on file changes
- External preview window support

### 🐙 GitHub Integration
- OAuth authentication with GitHub
- Create repositories directly from the IDE
- Push generated code with one click
- Secure token management

### 🚀 Deployment Ready
- One-click deployment capabilities
- Integration with popular hosting platforms
- Environment configuration management

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Together AI API key
- GitHub OAuth app credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hatchmate-code
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   npm run server:install
   ```

4. **Configure environment variables**
   
   Frontend (`.env`):
   ```env
   VITE_TOGETHER_API_KEY=your-together-api-key
   VITE_GITHUB_CLIENT_ID=your-github-client-id
   ```
   
   Backend (`server/.env`):
   ```env
   TOGETHER_API_KEY=your-together-api-key
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-secret
   PORT=3001
   ```

5. **Start the development servers**
   
   Terminal 1 (Frontend):
   ```bash
   npm run dev
   ```
   
   Terminal 2 (Backend):
   ```bash
   npm run server
   ```

### Setting Up API Keys

#### Together AI
1. Visit [Together AI](https://api.together.xyz/)
2. Create an account and get your API key
3. Add it to your environment variables

#### GitHub OAuth
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth app with:
   - Homepage URL: `http://localhost:5173`
   - Authorization callback URL: `http://localhost:5173/auth/github/callback`
3. Copy the Client ID and Client Secret to your environment variables

## Usage

### Generating Code
1. Open the chat panel on the right
2. Describe what you want to build (e.g., "Create a React todo app with TypeScript")
3. The AI will generate complete project files
4. Files appear in the explorer and can be edited in Monaco Editor

### Running Projects
1. Click the "Run" button in the header
2. The WebContainer will install dependencies and start the dev server
3. View the live preview in the preview panel

### GitHub Integration
1. Click "Connect GitHub" in the header
2. Authorize the application
3. Use "Push to GitHub" to create a repository with your generated code

## Architecture

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Zustand** for state management
- **Monaco Editor** for code editing
- **WebContainer API** for browser-based runtime

### Backend
- **Express.js** server
- **Together AI API** integration
- **GitHub REST API** integration
- **CORS** enabled for cross-origin requests

### Key Components
- `ChatPanel`: AI interaction interface
- `FileExplorer`: File tree navigation
- `CodeEditor`: Monaco-based code editor
- `Preview`: Live application preview
- `Terminal`: Command output display
- `Header`: Main navigation and controls

## API Endpoints

### POST `/api/generate`
Generate code from natural language prompts
```json
{
  "prompt": "Create a React todo app",
  "context": { "existing": "files" }
}
```

### POST `/api/github/create-repo`
Create a new GitHub repository
```json
{
  "name": "my-project",
  "description": "Generated with HatchMate-Code",
  "private": false
}
```

### POST `/api/github/push-files`
Push files to GitHub repository
```json
{
  "repoName": "my-project",
  "files": { "index.js": "console.log('hello')" },
  "commitMessage": "Initial commit"
}
```

## Security

- API keys are never exposed to the frontend
- All external API calls are proxied through the backend
- GitHub tokens are handled securely
- CORS policies restrict unauthorized access

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue on GitHub
- Check the documentation
- Review the example configurations

---

Built with ❤️ by the HatchMate team