import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const ollamaHost = process.env.OLLAMA_HOST || 'http://localhost:11434';
    
    // Check if Ollama is available
    try {
      const healthResponse = await fetch(`${ollamaHost}/api/version`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Set a reasonable timeout
        signal: AbortSignal.timeout(5000)
      });

      if (!healthResponse.ok) {
        return NextResponse.json({
          status: 'error',
          message: 'Ollama service returned an error',
          running: false
        });
      }

      const versionData = await healthResponse.json();
      
      return NextResponse.json({
        status: 'ready',
        message: 'Ollama is running and ready',
        running: true,
        version: versionData.version || 'unknown',
        host: ollamaHost
      });

    } catch (error) {
      if (error instanceof Error && error.name === 'TimeoutError') {
        return NextResponse.json({
          status: 'error',
          message: 'Ollama service is not responding (timeout)',
          running: false
        });
      }

      return NextResponse.json({
        status: 'error',
        message: 'Cannot connect to Ollama service',
        running: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }

  } catch (error) {
    console.error('Status API error:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Internal server error',
      running: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}