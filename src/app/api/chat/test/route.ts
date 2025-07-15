import { NextRequest, NextResponse } from 'next/server';

interface TestRequest {
  provider: 'openai' | 'claude' | 'groq' | 'gemini';
  apiKey: string;
}

interface TestResult {
  success: boolean;
  provider: string;
  message: string;
  model?: string;
  responseTime?: number;
}

// Test OpenAI connection
async function testOpenAI(apiKey: string): Promise<TestResult> {
  const startTime = Date.now();
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'Test connection' }],
        max_tokens: 5,
        temperature: 0,
      }),
    });

    const responseTime = Date.now() - startTime;

    if (response.ok) {
      return {
        success: true,
        provider: 'OpenAI',
        message: 'Connection successful',
        model: 'gpt-3.5-turbo',
        responseTime
      };
    } else {
      const error = await response.json();
      return {
        success: false,
        provider: 'OpenAI',
        message: error.error?.message || `HTTP ${response.status}`,
        responseTime
      };
    }
  } catch (error) {
    return {
      success: false,
      provider: 'OpenAI',
      message: 'Network error or invalid key',
      responseTime: Date.now() - startTime
    };
  }
}

// Test Claude connection
async function testClaude(apiKey: string): Promise<TestResult> {
  const startTime = Date.now();
  
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 5,
        messages: [{ role: 'user', content: 'Test' }],
      }),
    });

    const responseTime = Date.now() - startTime;

    if (response.ok) {
      return {
        success: true,
        provider: 'Claude',
        message: 'Connection successful',
        model: 'claude-3-haiku',
        responseTime
      };
    } else {
      const error = await response.json();
      return {
        success: false,
        provider: 'Claude',
        message: error.error?.message || `HTTP ${response.status}`,
        responseTime
      };
    }
  } catch (error) {
    return {
      success: false,
      provider: 'Claude',
      message: 'Network error or invalid key',
      responseTime: Date.now() - startTime
    };
  }
}

// Test Groq connection
async function testGroq(apiKey: string): Promise<TestResult> {
  const startTime = Date.now();
  
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [{ role: 'user', content: 'Test' }],
        max_tokens: 5,
        temperature: 0,
      }),
    });

    const responseTime = Date.now() - startTime;

    if (response.ok) {
      return {
        success: true,
        provider: 'Groq',
        message: 'Connection successful ⚡',
        model: 'llama3-8b-8192',
        responseTime
      };
    } else {
      const error = await response.json();
      return {
        success: false,
        provider: 'Groq',
        message: error.error?.message || `HTTP ${response.status}`,
        responseTime
      };
    }
  } catch (error) {
    return {
      success: false,
      provider: 'Groq',
      message: 'Network error or invalid key',
      responseTime: Date.now() - startTime
    };
  }
}

// Test Gemini connection
async function testGemini(apiKey: string): Promise<TestResult> {
  const startTime = Date.now();
  
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'Test' }] }],
          generationConfig: {
            maxOutputTokens: 5,
            temperature: 0,
          },
        }),
      }
    );

    const responseTime = Date.now() - startTime;

    if (response.ok) {
      return {
        success: true,
        provider: 'Gemini',
        message: 'Connection successful',
        model: 'gemini-pro',
        responseTime
      };
    } else {
      const error = await response.json();
      return {
        success: false,
        provider: 'Gemini',
        message: error.error?.message || `HTTP ${response.status}`,
        responseTime
      };
    }
  } catch (error) {
    return {
      success: false,
      provider: 'Gemini',
      message: 'Network error or invalid key',
      responseTime: Date.now() - startTime
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { provider, apiKey }: TestRequest = await request.json();

    if (!provider || !apiKey?.trim()) {
      return NextResponse.json({
        success: false,
        message: 'Provider and API key are required'
      }, { status: 400 });
    }

    let result: TestResult;

    switch (provider) {
      case 'openai':
        result = await testOpenAI(apiKey.trim());
        break;
      case 'claude':
        result = await testClaude(apiKey.trim());
        break;
      case 'groq':
        result = await testGroq(apiKey.trim());
        break;
      case 'gemini':
        result = await testGemini(apiKey.trim());
        break;
      default:
        return NextResponse.json({
          success: false,
          message: `Unsupported provider: ${provider}`
        }, { status: 400 });
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error'
    }, { status: 500 });
  }
}