# Local LLM Chat Application

A desktop chat application that integrates with local Ollama models, designed specifically for macOS and configured to use models from `/Users/guychenya/.ollama/models`.

## 🚀 Quick Start

### Prerequisites

1. **macOS** (tested on macOS 10.15+)
2. **Node.js** (v16 or higher)
3. **Ollama** installed and configured

### Step 1: Install Ollama

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Verify installation
ollama --version

# Pull recommended models
ollama pull llama3.2:3b      # Good balance of speed and quality
ollama pull llama3.2:1b      # Faster, smaller model
ollama pull codellama:7b     # For coding assistance

# Verify models are in the correct location
ls -la /Users/guychenya/.ollama/models
```

### Step 2: Clone and Setup the Application

```bash
# Clone the project
git clone <repository-url>
cd local-llm-chat

# Install dependencies
npm install

# Build the application
npm run build

# Start the application
npm start
```

### Step 3: Development Mode

For development with hot reload:

```bash
# Start in development mode
npm run dev
```

## 🏗️ Building for Distribution

### Create Distributable Package

```bash
# Build application bundle
npm run dist
```

This will create a `.dmg` file in the `release/` directory that can be distributed to other macOS users.

### Package Structure

The built application will include:
- Electron app with the chat interface
- Bundled Ollama models from your local path
- All necessary dependencies

## 🔧 Configuration

### Model Path Configuration

The application is pre-configured to use models from:
```
/Users/guychenya/.ollama/models
```

To use a different path, modify the `MODEL_PATH` constant in `src/main/main.ts`:

```typescript
private readonly MODEL_PATH = '/your/custom/path/.ollama/models';
```

### Adding New Models

1. **Using Ollama CLI:**
   ```bash
   ollama pull model-name
   ```

2. **Verify model availability:**
   ```bash
   ollama list
   ```

3. **Restart the application** to see new models in the dropdown.

### Recommended Models

| Model | Size | Use Case | Command |
|-------|------|----------|---------|
| llama3.2:1b | ~1.3GB | Fast responses, basic chat | `ollama pull llama3.2:1b` |
| llama3.2:3b | ~2.0GB | Balanced performance | `ollama pull llama3.2:3b` |
| llama3.1:8b | ~4.7GB | High quality responses | `ollama pull llama3.1:8b` |
| codellama:7b | ~3.8GB | Code generation | `ollama pull codellama:7b` |
| mistral:7b | ~4.1GB | Good general purpose | `ollama pull mistral:7b` |

## 🛠️ Development

### Project Structure

```
local-llm-chat/
├── src/
│   ├── main/              # Electron main process
│   │   ├── main.ts        # Main application logic
│   │   └── preload.ts     # IPC bridge
│   └── renderer/          # React frontend
│       ├── components/    # React components
│       ├── styles/        # CSS styles
│       └── index.tsx      # Entry point
├── webpack.*.config.js    # Webpack configurations
├── package.json          # Dependencies and scripts
└── README.md             # This file
```

### Key Features

1. **Local Model Integration**: Direct integration with Ollama API
2. **Custom Model Path**: Configured for your specific model storage location
3. **Model Management**: Load and switch between different models
4. **Real-time Chat**: Responsive chat interface with message history
5. **Error Handling**: Comprehensive error handling and user feedback
6. **Offline Operation**: Works completely offline once models are downloaded

### API Integration

The application communicates with Ollama through its REST API:

- **Health Check**: `GET http://localhost:11434/api/version`
- **Model List**: `GET http://localhost:11434/api/tags`
- **Chat**: `POST http://localhost:11434/api/chat`
- **Generate**: `POST http://localhost:11434/api/generate`

## 🔍 Troubleshooting

### Common Issues

1. **Models not found**:
   ```bash
   # Check if models exist
   ls -la /Users/guychenya/.ollama/models
   
   # Re-download models if needed
   ollama pull llama3.2:3b
   ```

2. **Ollama not starting**:
   ```bash
   # Check if Ollama is running
   ps aux | grep ollama
   
   # Start Ollama manually
   ollama serve
   ```

3. **Permission issues**:
   ```bash
   # Check permissions
   ls -la /Users/guychenya/.ollama/
   
   # Fix permissions if needed
   sudo chown -R $(whoami) /Users/guychenya/.ollama/
   ```

4. **Port conflicts**:
   - Default Ollama port is 11434
   - Check if another service is using this port
   - Modify port in `src/main/main.ts` if needed

### Error Messages

| Error | Solution |
|-------|----------|
| "Model path not accessible" | Check if `/Users/guychenya/.ollama/models` exists |
| "Failed to start Ollama" | Install Ollama or check if it's already running |
| "No models available" | Download models using `ollama pull` |
| "Model loading failed" | Ensure model is fully downloaded and not corrupted |

## 🎯 Usage Tips

### Performance Optimization

1. **Choose appropriate model size** based on your hardware:
   - **8GB RAM**: Use 1B-3B parameter models
   - **16GB RAM**: Use 3B-7B parameter models
   - **32GB+ RAM**: Use 8B+ parameter models

2. **Model switching**: Smaller models load faster but may have lower quality responses

3. **Memory management**: Close other applications when using larger models

### Best Practices

1. **Model Selection**:
   - Start with `llama3.2:3b` for general chat
   - Use `codellama:7b` for programming questions
   - Try `mistral:7b` for creative writing

2. **Chat Optimization**:
   - Keep conversations focused for better context
   - Clear chat history for new topics
   - Use specific prompts for better results

## 📦 Distribution

### Creating a Distributable App

The application can be packaged for distribution to other macOS users:

```bash
# Build distribution package
npm run dist
```

This creates a `.dmg` file that includes:
- The Electron application
- Bundled models (if configured)
- All dependencies

### Installation for End Users

1. Download the `.dmg` file
2. Mount and drag to Applications folder
3. Launch the application
4. Models will be available immediately (if bundled)

## 🔒 Security Considerations

- The application runs entirely locally
- No data is sent to external servers
- Model conversations are private
- Network access only used for Ollama API (localhost)

## 🚀 Advanced Configuration

### Custom Model Integration

To add custom or fine-tuned models:

1. Place model files in the Ollama models directory
2. Register the model with Ollama
3. Restart the application to see the new model

### Environment Variables

Set these environment variables for custom configuration:

```bash
export OLLAMA_MODELS="/Users/guychenya/.ollama/models"
export OLLAMA_HOST="0.0.0.0:11434"
```

### Building for Different Architectures

```bash
# Build for Intel Macs
npm run dist -- --x64

# Build for Apple Silicon
npm run dist -- --arm64

# Build universal binary
npm run dist -- --universal
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with different models
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

---

**Happy chatting with your local AI! 🤖**