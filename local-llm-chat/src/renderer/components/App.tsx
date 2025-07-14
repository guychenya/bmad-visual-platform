import React, { useState, useEffect, useRef } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface OllamaStatus {
  status: 'loading' | 'ready' | 'error';
  message?: string;
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState<OllamaStatus>({ status: 'loading' });
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [isLoadingModel, setIsLoadingModel] = useState(false);
  const [error, setError] = useState<string>('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Listen for Ollama status updates
    window.electronAPI.onOllamaStatus((data: any) => {
      setOllamaStatus(data);
      if (data.status === 'ready') {
        addSystemMessage('🚀 Ollama is ready! Local LLM chat initialized.');
        loadAvailableModels();
      } else if (data.status === 'error') {
        setError(data.message || 'Failed to initialize Ollama');
        addSystemMessage('❌ Failed to initialize Ollama. Please check your setup.');
      }
    });

    // Listen for available models
    window.electronAPI.onModelsAvailable((models: string[]) => {
      setAvailableModels(models);
      if (models.length > 0 && !selectedModel) {
        // Auto-select first available model
        const defaultModel = models.find(m => m.includes('llama3.2:3b')) || models[0];
        setSelectedModel(defaultModel);
      }
    });

    // Initial setup
    checkOllamaStatus();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const checkOllamaStatus = async () => {
    try {
      const result = await window.electronAPI.checkOllamaStatus();
      if (result.running) {
        setOllamaStatus({ status: 'ready' });
        addSystemMessage('🚀 Connected to local Ollama instance.');
        loadAvailableModels();
      }
    } catch (error) {
      console.error('Error checking Ollama status:', error);
    }
  };

  const loadAvailableModels = async () => {
    try {
      const result = await window.electronAPI.getModels();
      if (result.error) {
        setError(result.error);
        return;
      }

      const models = [...new Set([...result.localModels, ...result.runningModels.map((m: any) => m.name)])];
      setAvailableModels(models);
      
      if (models.length > 0 && !selectedModel) {
        const defaultModel = models.find(m => m.includes('llama3.2:3b')) || models[0];
        setSelectedModel(defaultModel);
      }
    } catch (error) {
      console.error('Error loading models:', error);
      setError('Failed to load available models');
    }
  };

  const addSystemMessage = (content: string) => {
    const systemMessage: Message = {
      id: Date.now().toString(),
      role: 'system',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLoadModel = async () => {
    if (!selectedModel) return;
    
    setIsLoadingModel(true);
    addSystemMessage(`🔄 Loading model: ${selectedModel}...`);
    
    try {
      const result = await window.electronAPI.loadModel(selectedModel);
      if (result.success) {
        addSystemMessage(`✅ Model ${selectedModel} loaded successfully!`);
      } else {
        addSystemMessage(`❌ Failed to load model: ${result.error}`);
        setError(result.error);
      }
    } catch (error) {
      console.error('Error loading model:', error);
      addSystemMessage('❌ Error loading model. Please try again.');
    } finally {
      setIsLoadingModel(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading || !selectedModel) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError('');

    try {
      // Prepare conversation history
      const history = messages
        .filter(m => m.role !== 'system')
        .map(m => ({ role: m.role, content: m.content }));

      const result = await window.electronAPI.sendMessage(selectedModel, userMessage.content, history);
      
      if (result.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: result.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        setError(result.error);
        addSystemMessage(`❌ Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
      addSystemMessage('❌ Failed to send message. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as any);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="app">
      {/* Header */}
      <div className="header">
        <h1>🤖 Local LLM Chat</h1>
        
        <div className="model-selector">
          <div className="status-indicator">
            <div className={`status-dot status-${ollamaStatus.status}`}></div>
            <span>
              {ollamaStatus.status === 'loading' && 'Initializing...'}
              {ollamaStatus.status === 'ready' && 'Ready'}
              {ollamaStatus.status === 'error' && 'Error'}
            </span>
          </div>
          
          <select 
            className="model-select" 
            value={selectedModel} 
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={ollamaStatus.status !== 'ready'}
          >
            <option value="">Select a model...</option>
            {availableModels.map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
          
          <button 
            className="load-model-btn" 
            onClick={handleLoadModel}
            disabled={!selectedModel || isLoadingModel || ollamaStatus.status !== 'ready'}
          >
            {isLoadingModel ? 'Loading...' : 'Load Model'}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {/* Chat Container */}
      <div className="chat-container">
        <div className="messages-container">
          {messages.length === 0 && ollamaStatus.status === 'ready' && (
            <div className="message system">
              Welcome to Local LLM Chat! 🎉<br/>
              Select a model above and start chatting with your local AI assistant.
            </div>
          )}
          
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.role}`}>
              <div>{message.content}</div>
              <div className="message-time">{formatTime(message.timestamp)}</div>
            </div>
          ))}
          
          {isLoading && (
            <div className="loading-indicator">
              <div className="loading-dots">
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
                <div className="loading-dot"></div>
              </div>
              <span>AI is thinking...</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="input-container">
          <form className="input-form" onSubmit={handleSendMessage}>
            <div className="input-wrapper">
              <textarea
                ref={inputRef}
                className="message-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  ollamaStatus.status === 'ready' 
                    ? selectedModel 
                      ? `Message ${selectedModel}... (Press Enter to send, Shift+Enter for new line)`
                      : "Please select a model first..."
                    : "Initializing Ollama..."
                }
                disabled={isLoading || ollamaStatus.status !== 'ready' || !selectedModel}
                rows={1}
              />
            </div>
            <button
              type="submit"
              className="send-button"
              disabled={isLoading || !inputValue.trim() || ollamaStatus.status !== 'ready' || !selectedModel}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;