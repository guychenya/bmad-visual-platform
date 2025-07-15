import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const providers = {
      openai: {
        available: !!(process.env.OPENAI_API_KEY?.trim() && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here'),
        models: ['gpt-4', 'gpt-3.5-turbo', 'gpt-4-turbo'],
        name: 'OpenAI'
      },
      claude: {
        available: !!(process.env.CLAUDE_API_KEY?.trim() && process.env.CLAUDE_API_KEY !== 'your_claude_api_key_here'),
        models: ['claude-3-sonnet-20240229', 'claude-3-haiku-20240307', 'claude-3-opus-20240229'],
        name: 'Claude (Anthropic)'
      },
      groq: {
        available: !!(process.env.GROQ_API_KEY?.trim() && process.env.GROQ_API_KEY !== 'your_groq_api_key_here'),
        models: ['llama3-8b-8192', 'llama3-70b-8192', 'mixtral-8x7b-32768'],
        name: 'Groq'
      },
      gemini: {
        available: !!(process.env.GEMINI_API_KEY?.trim() && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here'),
        models: ['gemini-pro', 'gemini-pro-vision'],
        name: 'Google Gemini'
      }
    };

    const availableProviders = Object.entries(providers)
      .filter(([_, config]) => config.available)
      .map(([key, config]) => ({
        id: key,
        name: config.name,
        models: config.models
      }));

    const recommendedProvider = availableProviders.find(p => p.id === 'claude') ||
                               availableProviders.find(p => p.id === 'groq') ||
                               availableProviders.find(p => p.id === 'openai') ||
                               availableProviders.find(p => p.id === 'gemini');

    return NextResponse.json({
      success: true,
      providers: availableProviders,
      recommended: recommendedProvider,
      hasApiKeys: availableProviders.length > 0,
      totalProviders: availableProviders.length,
      demoMode: availableProviders.length === 0
    });

  } catch (error) {
    console.error('Status API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { apiKeys } = await request.json();
    
    const providers = {
      openai: {
        available: !!(apiKeys?.openai?.trim()),
        models: ['gpt-4', 'gpt-3.5-turbo', 'gpt-4-turbo'],
        name: 'OpenAI'
      },
      claude: {
        available: !!(apiKeys?.claude?.trim()),
        models: ['claude-3-sonnet-20240229', 'claude-3-haiku-20240307', 'claude-3-opus-20240229'],
        name: 'Claude (Anthropic)'
      },
      groq: {
        available: !!(apiKeys?.groq?.trim()),
        models: ['llama3-8b-8192', 'llama3-70b-8192', 'mixtral-8x7b-32768'],
        name: 'Groq'
      },
      gemini: {
        available: !!(apiKeys?.gemini?.trim()),
        models: ['gemini-pro', 'gemini-pro-vision'],
        name: 'Google Gemini'
      }
    };

    const availableProviders = Object.entries(providers)
      .filter(([_, config]) => config.available)
      .map(([key, config]) => ({
        id: key,
        name: config.name,
        models: config.models
      }));

    const recommendedProvider = availableProviders.find(p => p.id === 'claude') ||
                               availableProviders.find(p => p.id === 'groq') ||
                               availableProviders.find(p => p.id === 'openai') ||
                               availableProviders.find(p => p.id === 'gemini');

    return NextResponse.json({
      success: true,
      providers: availableProviders,
      recommended: recommendedProvider,
      hasApiKeys: availableProviders.length > 0,
      totalProviders: availableProviders.length,
      demoMode: availableProviders.length === 0
    });

  } catch (error) {
    console.error('Status API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}