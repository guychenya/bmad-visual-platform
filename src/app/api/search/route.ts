import { NextRequest, NextResponse } from 'next/server';

interface SearchRequest {
  query: string;
  maxResults?: number;
}

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
}

// Using DuckDuckGo Instant Answer API (free, no API key required)
async function searchWeb(query: string, maxResults: number = 5): Promise<SearchResult[]> {
  try {
    // DuckDuckGo Instant Answer API
    const response = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`,
      {
        headers: {
          'User-Agent': 'BMad-AI-Chat/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Search API error: ${response.statusText}`);
    }

    const data = await response.json();
    const results: SearchResult[] = [];

    // Process instant answer
    if (data.AbstractText) {
      results.push({
        title: data.Heading || 'Quick Answer',
        url: data.AbstractURL || '#',
        snippet: data.AbstractText,
        source: data.AbstractSource || 'DuckDuckGo'
      });
    }

    // Process related topics
    if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
      data.RelatedTopics.slice(0, maxResults - results.length).forEach((topic: any) => {
        if (topic.Text && topic.FirstURL) {
          results.push({
            title: topic.Text.split(' - ')[0] || 'Related Topic',
            url: topic.FirstURL,
            snippet: topic.Text,
            source: 'DuckDuckGo'
          });
        }
      });
    }

    // If no results from DuckDuckGo, return a fallback
    if (results.length === 0) {
      results.push({
        title: 'Search Results',
        url: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
        snippet: `No instant results found. Click to search "${query}" on DuckDuckGo.`,
        source: 'DuckDuckGo'
      });
    }

    return results.slice(0, maxResults);

  } catch (error) {
    console.error('Web search error:', error);
    
    // Fallback search result
    return [{
      title: 'Search Unavailable',
      url: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
      snippet: `Web search is temporarily unavailable. Click to search "${query}" manually.`,
      source: 'Fallback'
    }];
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query, maxResults = 5 }: SearchRequest = await request.json();

    if (!query?.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Search query is required'
      }, { status: 400 });
    }

    const results = await searchWeb(query.trim(), maxResults);

    return NextResponse.json({
      success: true,
      query: query.trim(),
      results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}