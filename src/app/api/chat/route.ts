import { NextRequest, NextResponse } from 'next/server';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  provider: 'openai' | 'claude' | 'groq' | 'gemini';
  model?: string;
  message: string;
  history: ChatMessage[];
  agentId?: string;
  apiKeys?: {
    openai?: string;
    claude?: string;
    groq?: string;
    gemini?: string;
  };
}

// OpenAI API Integration
async function chatWithOpenAI(model: string, messages: ChatMessage[], apiKey?: string): Promise<string> {
  const key = apiKey?.trim() || process.env.OPENAI_API_KEY?.trim();
  if (!key || key === 'your_openai_api_key_here') {
    throw new Error('OpenAI API key not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model || 'gpt-4',
      messages: messages,
      max_tokens: 2000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API Error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || 'No response generated';
}

// Claude API Integration
async function chatWithClaude(model: string, messages: ChatMessage[], apiKey?: string): Promise<string> {
  const key = apiKey?.trim() || process.env.CLAUDE_API_KEY?.trim();
  if (!key || key === 'your_claude_api_key_here') {
    throw new Error('Claude API key not configured');
  }

  // Convert messages to Claude format
  const systemMessage = messages.find(m => m.role === 'system')?.content || '';
  const conversationMessages = messages.filter(m => m.role !== 'system');

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': key,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: model || 'claude-3-sonnet-20240229',
      max_tokens: 2000,
      system: systemMessage,
      messages: conversationMessages,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Claude API Error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.content[0]?.text || 'No response generated';
}

// Groq API Integration
async function chatWithGroq(model: string, messages: ChatMessage[], apiKey?: string): Promise<string> {
  const key = apiKey?.trim() || process.env.GROQ_API_KEY?.trim();
  if (!key || key === 'your_groq_api_key_here') {
    throw new Error('Groq API key not configured');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model || 'llama3-8b-8192',
      messages: messages,
      max_tokens: 2000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Groq API Error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || 'No response generated';
}

// Gemini API Integration
async function chatWithGemini(model: string, messages: ChatMessage[], apiKey?: string): Promise<string> {
  const key = apiKey?.trim() || process.env.GEMINI_API_KEY?.trim();
  if (!key || key === 'your_gemini_api_key_here') {
    throw new Error('Gemini API key not configured');
  }

  // Convert messages to Gemini format
  const contents = messages.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model || 'gemini-pro'}:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: contents,
        generationConfig: {
          maxOutputTokens: 2000,
          temperature: 0.7,
        },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Gemini API Error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.candidates[0]?.content?.parts[0]?.text || 'No response generated';
}

// Fallback simulation response
function getSimulationResponse(message: string, agentId?: string): string {
  const responses = [
    "I'm running in demo mode. To get AI responses, please configure your API keys in the settings.",
    "This is a simulated response. Add your API keys to enable real AI chat.",
    "Demo mode: Your message was received but I can't provide real AI responses without API keys.",
    "I'm in simulation mode. Please add OpenAI, Claude, or Groq API keys to chat with real AI.",
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}

export async function POST(request: NextRequest) {
  try {
    const { provider, model, message, history, agentId, apiKeys }: ChatRequest = await request.json();

    if (!provider || !message) {
      return NextResponse.json(
        { error: 'Provider and message are required' },
        { status: 400 }
      );
    }

    // Prepare messages for API
    const messages = [
      ...history,
      { role: 'user' as const, content: message }
    ];

    let response: string;

    try {
      switch (provider) {
        case 'openai':
          response = await chatWithOpenAI(model || 'gpt-4', messages, apiKeys?.openai);
          break;
        case 'claude':
          response = await chatWithClaude(model || 'claude-3-sonnet-20240229', messages, apiKeys?.claude);
          break;
        case 'groq':
          response = await chatWithGroq(model || 'llama3-8b-8192', messages, apiKeys?.groq);
          break;
        case 'gemini':
          response = await chatWithGemini(model || 'gemini-pro', messages, apiKeys?.gemini);
          break;
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }
    } catch (error) {
      console.error(`API Error with ${provider}:`, error);
      
      // If API fails, return simulation response
      response = getSimulationResponse(message, agentId);
    }

    // Check if we have any valid API keys
    const hasValidOpenAI = !!(process.env.OPENAI_API_KEY?.trim() && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here');
    const hasValidClaude = !!(process.env.CLAUDE_API_KEY?.trim() && process.env.CLAUDE_API_KEY !== 'your_claude_api_key_here');
    const hasValidGroq = !!(process.env.GROQ_API_KEY?.trim() && process.env.GROQ_API_KEY !== 'your_groq_api_key_here');
    const hasValidGemini = !!(process.env.GEMINI_API_KEY?.trim() && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here');
    
    const isSimulation = !hasValidOpenAI && !hasValidClaude && !hasValidGroq && !hasValidGemini;

    return NextResponse.json({
      success: true,
      response,
      provider,
      model: model || 'default',
      isSimulation
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}