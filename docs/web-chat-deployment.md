# Web LLM Chat Deployment Guide

## Overview

The Web LLM Chat application is a Next.js-based web interface that connects to a local or remote Ollama server to provide AI chat capabilities through a web browser.

## 🏗️ Architecture

```
Web Browser → Next.js Web App → Ollama Server → Local LLM Models
```

## 🚀 Deployment Options

### Option 1: Local Development

1. **Start Ollama locally:**
   ```bash
   ollama serve
   ```

2. **Pull models:**
   ```bash
   ollama pull llama3.2:3b
   ollama pull llama3.2:1b
   ```

3. **Start the web application:**
   ```bash
   npm run dev
   ```

4. **Access the web chat:**
   - Open `http://localhost:3000/web-chat`

### Option 2: Production Deployment with Remote Ollama

For production deployment, you'll need to set up Ollama on a server and configure the web application to connect to it.

#### Step 1: Deploy Ollama Server

**Option A: VPS/Server Deployment**

1. Install Ollama on your server:
   ```bash
   curl -fsSL https://ollama.ai/install.sh | sh
   ```

2. Configure Ollama to accept external connections:
   ```bash
   export OLLAMA_HOST=0.0.0.0:11434
   ollama serve
   ```

3. Install models:
   ```bash
   ollama pull llama3.2:3b
   ollama pull llama3.2:1b
   ollama pull codellama:7b
   ```

**Option B: Docker Deployment**

1. Create a `docker-compose.yml` for Ollama:
   ```yaml
   version: '3.8'
   services:
     ollama:
       image: ollama/ollama:latest
       ports:
         - "11434:11434"
       volumes:
         - ollama_data:/root/.ollama
       environment:
         - OLLAMA_HOST=0.0.0.0:11434
       restart: unless-stopped
   
   volumes:
     ollama_data:
   ```

2. Start the service:
   ```bash
   docker-compose up -d
   ```

3. Pull models:
   ```bash
   docker exec -it ollama_container ollama pull llama3.2:3b
   ```

#### Step 2: Deploy Web Application

**Netlify Deployment:**

1. **Configure environment variables in Netlify:**
   ```
   OLLAMA_HOST=https://your-ollama-server.com:11434
   ```

2. **Deploy using Netlify CLI:**
   ```bash
   npm run build
   netlify deploy --prod
   ```

**Vercel Deployment:**

1. **Configure environment variables in Vercel:**
   ```
   OLLAMA_HOST=https://your-ollama-server.com:11434
   ```

2. **Deploy using Vercel CLI:**
   ```bash
   vercel --prod
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `OLLAMA_HOST` | Ollama server URL | `http://localhost:11434` | Yes |

### Security Considerations

1. **HTTPS/SSL:** Always use HTTPS in production
2. **CORS:** Configure proper CORS settings for your Ollama server
3. **Authentication:** Add authentication if needed for production use
4. **Rate Limiting:** Implement rate limiting to prevent abuse

## 📋 Requirements

### For Local Development:
- Node.js 18+
- Ollama installed locally
- At least 8GB RAM for small models

### For Production:
- Ollama server (VPS, Docker, or cloud instance)
- Web hosting platform (Netlify, Vercel, etc.)
- Domain name (optional)

## 🎯 Features

- **Real-time chat** with local LLM models
- **Model switching** between different AI models
- **Responsive design** for mobile and desktop
- **Error handling** with user-friendly messages
- **Loading states** and typing indicators
- **Message history** with timestamps

## 🔍 Testing

### Local Testing

1. Start Ollama:
   ```bash
   ollama serve
   ```

2. Test API endpoints:
   ```bash
   # Check status
   curl http://localhost:3000/api/llm/status
   
   # List models
   curl http://localhost:3000/api/llm/models
   
   # Send chat message
   curl -X POST http://localhost:3000/api/llm \
     -H "Content-Type: application/json" \
     -d '{"model": "llama3.2:3b", "message": "Hello", "history": []}'
   ```

### Production Testing

1. **Health check:** `GET /api/llm/status`
2. **Model availability:** `GET /api/llm/models`
3. **Chat functionality:** `POST /api/llm`

## 🚨 Troubleshooting

### Common Issues

1. **"Ollama service is not available"**
   - Check if Ollama is running
   - Verify OLLAMA_HOST environment variable
   - Check network connectivity

2. **"No models available"**
   - Pull models using `ollama pull model-name`
   - Check model storage location
   - Verify model names in Ollama

3. **CORS errors**
   - Configure Ollama to accept requests from your domain
   - Check server firewall settings

4. **Performance issues**
   - Monitor server resources
   - Consider using smaller models
   - Implement response caching

## 📊 Performance Optimization

1. **Model Selection:**
   - Use smaller models for faster responses
   - Cache frequently used models
   - Load balance between multiple Ollama instances

2. **Server Resources:**
   - Monitor CPU and memory usage
   - Scale server resources based on demand
   - Consider GPU acceleration for larger models

3. **Network:**
   - Use CDN for static assets
   - Implement response compression
   - Minimize API payload sizes

## 🔄 Monitoring

### Health Checks

Set up monitoring for:
- Ollama server availability
- Model loading times
- Response times
- Error rates

### Metrics to Track

- Average response time
- Token generation rate
- Memory usage
- CPU utilization
- Model switching frequency

## 📞 Support

If you encounter issues:

1. Check the browser console for errors
2. Verify Ollama server logs
3. Test API endpoints directly
4. Check environment variable configuration

---

**Happy chatting with your web-based AI assistant! 🌐🤖**