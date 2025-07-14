import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as fs from 'fs-extra';
import { spawn, ChildProcess } from 'child_process';
import axios from 'axios';

interface OllamaModel {
  name: string;
  size: number;
  digest: string;
  details: {
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
  };
}

class OllamaManager {
  private ollamaProcess: ChildProcess | null = null;
  private isRunning = false;
  private readonly OLLAMA_PORT = 11434;
  private readonly OLLAMA_HOST = `http://localhost:${this.OLLAMA_PORT}`;
  private readonly MODEL_PATH = '/Users/guychenya/.ollama/models';

  async checkModelPath(): Promise<boolean> {
    try {
      await fs.access(this.MODEL_PATH);
      return true;
    } catch (error) {
      console.error('Model path not accessible:', error);
      return false;
    }
  }

  async getAvailableModels(): Promise<string[]> {
    try {
      const modelsDir = path.join(this.MODEL_PATH, 'manifests', 'registry.ollama.ai');
      
      if (!await fs.pathExists(modelsDir)) {
        throw new Error('Models directory not found');
      }

      const libraries = await fs.readdir(modelsDir);
      const models: string[] = [];

      for (const library of libraries) {
        const libraryPath = path.join(modelsDir, library);
        if ((await fs.stat(libraryPath)).isDirectory()) {
          const modelNames = await fs.readdir(libraryPath);
          for (const modelName of modelNames) {
            models.push(`${library}/${modelName}`);
          }
        }
      }

      return models;
    } catch (error) {
      console.error('Error reading models:', error);
      return [];
    }
  }

  async startOllama(): Promise<boolean> {
    if (this.isRunning) {
      return true;
    }

    try {
      // Check if Ollama is already running
      await axios.get(`${this.OLLAMA_HOST}/api/version`);
      this.isRunning = true;
      return true;
    } catch (error) {
      // Ollama not running, start it
      console.log('Starting Ollama...');
    }

    return new Promise((resolve, reject) => {
      // Set environment variable to use custom model path
      const env = { 
        ...process.env, 
        OLLAMA_MODELS: this.MODEL_PATH,
        OLLAMA_HOST: `0.0.0.0:${this.OLLAMA_PORT}`
      };

      this.ollamaProcess = spawn('ollama', ['serve'], { 
        env,
        stdio: ['ignore', 'pipe', 'pipe']
      });

      this.ollamaProcess.stdout?.on('data', (data) => {
        console.log('Ollama stdout:', data.toString());
      });

      this.ollamaProcess.stderr?.on('data', (data) => {
        console.log('Ollama stderr:', data.toString());
      });

      this.ollamaProcess.on('error', (error) => {
        console.error('Failed to start Ollama:', error);
        reject(error);
      });

      // Wait for Ollama to start
      const checkHealth = async () => {
        try {
          await axios.get(`${this.OLLAMA_HOST}/api/version`);
          this.isRunning = true;
          resolve(true);
        } catch (error) {
          setTimeout(checkHealth, 1000);
        }
      };

      setTimeout(checkHealth, 2000);
    });
  }

  async stopOllama(): Promise<void> {
    if (this.ollamaProcess) {
      this.ollamaProcess.kill();
      this.ollamaProcess = null;
    }
    this.isRunning = false;
  }

  async sendMessage(model: string, message: string, conversationHistory: any[] = []): Promise<string> {
    if (!this.isRunning) {
      throw new Error('Ollama is not running');
    }

    try {
      const response = await axios.post(`${this.OLLAMA_HOST}/api/chat`, {
        model: model,
        messages: [
          ...conversationHistory,
          { role: 'user', content: message }
        ],
        stream: false
      });

      return response.data.message.content;
    } catch (error: any) {
      console.error('Error sending message to Ollama:', error);
      throw new Error(`Failed to get response: ${error.message}`);
    }
  }

  async listRunningModels(): Promise<OllamaModel[]> {
    try {
      const response = await axios.get(`${this.OLLAMA_HOST}/api/tags`);
      return response.data.models || [];
    } catch (error) {
      console.error('Error listing models:', error);
      return [];
    }
  }

  async loadModel(modelName: string): Promise<boolean> {
    try {
      // Send a simple message to load the model
      await axios.post(`${this.OLLAMA_HOST}/api/generate`, {
        model: modelName,
        prompt: "Hello",
        stream: false
      });
      return true;
    } catch (error) {
      console.error('Error loading model:', error);
      return false;
    }
  }
}

class AppManager {
  private mainWindow: BrowserWindow | null = null;
  private ollamaManager: OllamaManager;

  constructor() {
    this.ollamaManager = new OllamaManager();
    this.setupApp();
    this.setupIPC();
  }

  private setupApp(): void {
    app.whenReady().then(() => {
      this.createWindow();
      this.initializeOllama();
    });

    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        this.cleanup();
      }
    });

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createWindow();
      }
    });

    app.on('before-quit', () => {
      this.cleanup();
    });
  }

  private createWindow(): void {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js')
      },
      titleBarStyle: 'hiddenInset',
      show: false
    });

    this.mainWindow.loadFile(path.join(__dirname, 'index.html'));

    this.mainWindow.once('ready-to-show', () => {
      this.mainWindow?.show();
    });

    // Open DevTools in development
    if (process.env.NODE_ENV === 'development') {
      this.mainWindow.webContents.openDevTools();
    }
  }

  private async initializeOllama(): Promise<void> {
    try {
      // Check if model path exists
      const pathExists = await this.ollamaManager.checkModelPath();
      if (!pathExists) {
        this.showErrorDialog('Model Path Error', 
          `Models directory not found at: /Users/guychenya/.ollama/models\n\nPlease ensure Ollama is installed and models are downloaded.`);
        return;
      }

      // Start Ollama
      const started = await this.ollamaManager.startOllama();
      if (started) {
        this.sendToRenderer('ollama-status', { status: 'ready' });
        
        // Get available models
        const models = await this.ollamaManager.getAvailableModels();
        this.sendToRenderer('models-available', models);
      } else {
        this.sendToRenderer('ollama-status', { status: 'error', message: 'Failed to start Ollama' });
      }
    } catch (error: any) {
      console.error('Failed to initialize Ollama:', error);
      this.sendToRenderer('ollama-status', { status: 'error', message: error.message });
    }
  }

  private setupIPC(): void {
    ipcMain.handle('send-message', async (_, model: string, message: string, history: any[]) => {
      try {
        const response = await this.ollamaManager.sendMessage(model, message, history);
        return { success: true, response };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    });

    ipcMain.handle('get-models', async () => {
      try {
        const localModels = await this.ollamaManager.getAvailableModels();
        const runningModels = await this.ollamaManager.listRunningModels();
        return { localModels, runningModels };
      } catch (error: any) {
        return { error: error.message };
      }
    });

    ipcMain.handle('load-model', async (_, modelName: string) => {
      try {
        const loaded = await this.ollamaManager.loadModel(modelName);
        return { success: loaded };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    });

    ipcMain.handle('check-ollama-status', async () => {
      try {
        const models = await this.ollamaManager.listRunningModels();
        return { running: true, models };
      } catch (error) {
        return { running: false };
      }
    });
  }

  private sendToRenderer(channel: string, data: any): void {
    if (this.mainWindow) {
      this.mainWindow.webContents.send(channel, data);
    }
  }

  private showErrorDialog(title: string, content: string): void {
    if (this.mainWindow) {
      dialog.showErrorBox(title, content);
    }
  }

  private async cleanup(): Promise<void> {
    await this.ollamaManager.stopOllama();
    app.quit();
  }
}

// Initialize the application
new AppManager();