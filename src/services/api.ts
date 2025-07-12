import axios from 'axios';
import { GenerateCodeRequest, GenerateCodeResponse, GitHubRepo } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const generateCode = async (request: GenerateCodeRequest): Promise<GenerateCodeResponse> => {
  const response = await api.post('/api/generate', request);
  return response.data;
};

export const createGitHubRepo = async (repo: GitHubRepo, token: string) => {
  const response = await api.post('/api/github/create-repo', repo, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const pushFilesToGitHub = async (
  repoName: string, 
  files: Record<string, string>, 
  token: string,
  commitMessage = 'Initial commit from HatchMate-Code'
) => {
  const response = await api.post('/api/github/push-files', {
    repoName,
    files,
    commitMessage
  }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const authenticateGitHub = (clientId: string) => {
  const redirectUri = `${window.location.origin}/auth/github/callback`;
  const scope = 'repo,user';
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  
  window.location.href = authUrl;
};