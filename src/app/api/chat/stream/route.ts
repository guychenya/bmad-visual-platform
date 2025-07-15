import { NextRequest } from 'next/server';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface StreamRequest {
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

// OpenAI Streaming
async function streamOpenAI(model: string, messages: ChatMessage[], apiKey?: string): Promise<Response> {
  const key = apiKey?.trim() || process.env.OPENAI_API_KEY?.trim();
  if (!key || key === 'your_openai_api_key_here') {
    throw new Error('OpenAI API key not configured');
  }

  return fetch('https://api.openai.com/v1/chat/completions', {
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
      stream: true,
    }),
  });
}

// Groq Streaming (Super Fast!)
async function streamGroq(model: string, messages: ChatMessage[], apiKey?: string): Promise<Response> {
  const key = apiKey?.trim() || process.env.GROQ_API_KEY?.trim();
  if (!key || key === 'your_groq_api_key_here') {
    throw new Error('Groq API key not configured');
  }

  return fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: model || 'llama3-70b-8192', // Fast 70B model
      messages: messages,
      max_tokens: 2000,
      temperature: 0.7,
      stream: true,
    }),
  });
}

// Process streaming response
function processStreamingResponse(response: Response): ReadableStream {
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No response body');
  }

  return new ReadableStream({
    start(controller) {
      const pump = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              controller.close();
              break;
            }

            const chunk = new TextDecoder().decode(value);
            const lines = chunk.split('\n').filter(line => line.trim());

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[DONE]') {
                  controller.close();
                  return;
                }

                try {
                  const parsed = JSON.parse(data);
                  const content = parsed.choices[0]?.delta?.content;
                  if (content) {
                    // Send each token immediately
                    controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({content})}\n\n`));
                  }
                } catch (e) {
                  // Skip invalid JSON
                }
              }
            }
          }
        } catch (error) {
          controller.error(error);
        }
      };

      pump();
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const { provider, model, message, history, apiKeys }: StreamRequest = await request.json();

    if (!provider || !message) {
      return new Response('Provider and message are required', { status: 400 });
    }

    // Prepare messages for API
    const messages = [
      ...history,
      { role: 'user' as const, content: message }
    ];

    let streamResponse: Response;

    try {
      switch (provider) {
        case 'openai':
          streamResponse = await streamOpenAI(model || 'gpt-4', messages, apiKeys?.openai);
          break;
        case 'groq':
          streamResponse = await streamGroq(model || 'llama3-70b-8192', messages, apiKeys?.groq);
          break;
        default:
          return new Response(`Streaming not yet implemented for ${provider}`, { status: 501 });
      }

      if (!streamResponse.ok) {
        throw new Error(`API error: ${streamResponse.statusText}`);
      }

      // Return streaming response
      return new Response(processStreamingResponse(streamResponse), {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });

    } catch (error) {
      console.error(`Streaming API Error with ${provider}:`, error);
      
      // Fallback to demo response
      const demoStream = new ReadableStream({
        start(controller) {
          const demoText = "⚡ Super fast demo response! Add your API keys to enable real streaming AI responses.";
          let i = 0;
          
          const interval = setInterval(() => {
            if (i < demoText.length) {
              const char = demoText[i];
              controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({content: char})}\n\n`));
              i++;
            } else {
              clearInterval(interval);
              controller.close();
            }
          }, 20); // Very fast demo
        },
      });

      return new Response(demoStream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

  } catch (error) {
    console.error('Stream API error:', error);
    return new Response('Internal server error', { status: 500 });
  }
}