import { contextBridge, ipcRenderer } from 'electron';

interface ElectronAPI {
  sendMessage: (model: string, message: string, history: any[]) => Promise<any>;
  getModels: () => Promise<any>;
  loadModel: (modelName: string) => Promise<any>;
  checkOllamaStatus: () => Promise<any>;
  onOllamaStatus: (callback: (data: any) => void) => void;
  onModelsAvailable: (callback: (models: string[]) => void) => void;
}

const electronAPI: ElectronAPI = {
  sendMessage: (model: string, message: string, history: any[]) => 
    ipcRenderer.invoke('send-message', model, message, history),
  
  getModels: () => 
    ipcRenderer.invoke('get-models'),
  
  loadModel: (modelName: string) => 
    ipcRenderer.invoke('load-model', modelName),
  
  checkOllamaStatus: () => 
    ipcRenderer.invoke('check-ollama-status'),
  
  onOllamaStatus: (callback: (data: any) => void) => {
    ipcRenderer.on('ollama-status', (_, data) => callback(data));
  },
  
  onModelsAvailable: (callback: (models: string[]) => void) => {
    ipcRenderer.on('models-available', (_, models) => callback(models));
  }
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}