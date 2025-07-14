import { NextRequest, NextResponse } from 'next/server';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatRequest {
  model: string;
  message: string;
  history: ChatMessage[];
}

interface OllamaResponse {
  message: {
    role: string;
    content: string;
  };
  done: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const { model, message, history }: ChatRequest = await request.json();

    if (!model || !message) {
      return NextResponse.json(
        { error: 'Model and message are required' },
        { status: 400 }
      );
    }

    // Check if Ollama is available
    const ollamaHost = process.env.OLLAMA_HOST || 'http://localhost:11434';
    
    try {
      const healthResponse = await fetch(`${ollamaHost}/api/version`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!healthResponse.ok) {
        return NextResponse.json(
          { error: 'Ollama service is not available' },
          { status: 503 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Cannot connect to Ollama service' },
        { status: 503 }
      );
    }

    // Prepare the conversation for Ollama
    const messages = [
      ...history,
      { role: 'user', content: message }
    ];

    const ollamaRequest = {
      model,
      messages,
      stream: false,
      options: {
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 2000,
      }
    };

    const response = await fetch(`${ollamaHost}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ollamaRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ollama API error:', errorText);
      return NextResponse.json(
        { error: `Ollama API error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const ollamaResponse: OllamaResponse = await response.json();

    return NextResponse.json({
      success: true,
      response: ollamaResponse.message.content,
      model,
    });

  } catch (error) {
    console.error('LLM API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}