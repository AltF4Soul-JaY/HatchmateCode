import { WebContainer } from '@webcontainer/api';

class WebContainerService {
  private container: WebContainer | null = null;
  private isBooting = false;

  async getContainer(): Promise<WebContainer> {
    if (this.container) {
      return this.container;
    }

    if (this.isBooting) {
      // Wait for the container to boot
      while (this.isBooting) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return this.container!;
    }

    this.isBooting = true;
    try {
      this.container = await WebContainer.boot();
      this.isBooting = false;
      return this.container;
    } catch (error) {
      this.isBooting = false;
      throw error;
    }
  }

  async writeFiles(files: Record<string, string>) {
    const container = await this.getContainer();
    
    // Convert flat file structure to nested structure
    const fileTree: any = {};
    
    for (const [path, content] of Object.entries(files)) {
      const parts = path.split('/');
      let current = fileTree;
      
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!current[part]) {
          current[part] = { directory: {} };
        }
        current = current[part].directory;
      }
      
      const fileName = parts[parts.length - 1];
      current[fileName] = {
        file: {
          contents: content
        }
      };
    }

    await container.mount(fileTree);
  }

  async runCommand(command: string, args: string[] = []): Promise<{ output: string; exitCode: number }> {
    const container = await this.getContainer();
    
    const process = await container.spawn(command, args);
    
    let output = '';
    
    process.output.pipeTo(new WritableStream({
      write(data) {
        output += data;
      }
    }));

    const exitCode = await process.exit;
    
    return { output, exitCode };
  }

  async startDevServer(): Promise<string> {
    const container = await this.getContainer();
    
    // Install dependencies first
    await this.runCommand('npm', ['install']);
    
    // Start dev server
    const serverProcess = await container.spawn('npm', ['run', 'dev']);
    
    // Wait for server to be ready and return URL
    container.on('server-ready', (port, url) => {
      return url;
    });

    // For now, return a placeholder URL
    return 'http://localhost:5173';
  }
}

export const webContainerService = new WebContainerService();