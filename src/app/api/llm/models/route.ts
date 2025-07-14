import { NextRequest, NextResponse } from 'next/server';

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

interface OllamaModelsResponse {
  models: OllamaModel[];
}

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

    // Get available models
    const modelsResponse = await fetch(`${ollamaHost}/api/tags`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!modelsResponse.ok) {
      const errorText = await modelsResponse.text();
      console.error('Ollama models API error:', errorText);
      return NextResponse.json(
        { error: `Failed to fetch models: ${modelsResponse.status} ${modelsResponse.statusText}` },
        { status: modelsResponse.status }
      );
    }

    const modelsData: OllamaModelsResponse = await modelsResponse.json();
    
    // Extract model names and format for frontend
    const models = modelsData.models.map(model => ({
      name: model.name,
      size: model.size,
      family: model.details.family,
      parameter_size: model.details.parameter_size,
      quantization: model.details.quantization_level
    }));

    return NextResponse.json({
      success: true,
      models: models,
      count: models.length
    });

  } catch (error) {
    console.error('Models API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}