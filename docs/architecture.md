# BMad Visual Platform - Technical Architecture

## System Overview

The BMad Visual Platform is a full-stack web application that transforms the BMad Method into a beautiful, intuitive visual experience. Built on modern web technologies with Supabase as the backend, it provides real-time collaboration and AI-powered development workflows.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend Layer                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   Next.js App   │  │  Tailwind CSS   │  │  shadcn/ui      │  │
│  │  (React 18)     │  │  (Styling)      │  │  (Components)   │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │  Framer Motion  │  │    Zustand      │  │  React Query    │  │
│  │  (Animations)   │  │ (State Mgmt)    │  │ (Data Fetching) │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway Layer                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   Supabase      │  │  Edge Functions │  │   Webhooks      │  │
│  │   Auto API      │  │  (AI Integration)│  │  (Integrations) │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Database Layer                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   PostgreSQL    │  │   Realtime      │  │    Storage      │  │
│  │   (Supabase)    │  │  Subscriptions  │  │   (Files/Assets)│  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                     External Services                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   OpenAI/Claude │  │   GitHub API    │  │   Vercel        │  │
│  │   (AI Agents)   │  │  (Repositories) │  │  (Deployment)   │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Technology Stack

**Core Framework**: Next.js 14 with App Router
- **Server Components**: For performance and SEO
- **Client Components**: For interactive features
- **API Routes**: For backend integration
- **Middleware**: For authentication and routing

**UI Framework**: React 18 with Concurrent Features
- **Suspense**: For loading states
- **Transitions**: For smooth state updates
- **Error Boundaries**: For graceful error handling

**Styling**: Tailwind CSS + shadcn/ui
- **Utility-First**: Rapid development
- **Component Library**: Consistent, accessible components
- **Dark Mode**: Built-in theme switching
- **Responsive**: Mobile-first design

**State Management**: Zustand
- **Lightweight**: Minimal boilerplate
- **TypeScript**: Full type safety
- **Devtools**: Excellent debugging
- **Persistence**: Local storage integration

**Animations**: Framer Motion
- **Smooth Transitions**: Between agent interactions
- **Gesture Support**: Drag and drop functionality
- **Layout Animations**: Automatic layout transitions
- **Performance**: Hardware accelerated

### Component Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Main application
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── agents/           # Agent-specific components
│   ├── forms/            # Form components
│   └── layouts/          # Layout components
├── lib/                  # Utility functions
│   ├── supabase.ts       # Supabase client
│   ├── ai-client.ts      # AI service client
│   └── utils.ts          # Helper functions
├── hooks/                # Custom React hooks
├── stores/               # Zustand stores
├── types/                # TypeScript types
└── constants/            # App constants
```

## Backend Architecture (Supabase)

### Database Schema

```sql
-- Core Tables
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  config JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'analyst', 'architect', 'dev', etc.
  name TEXT NOT NULL,
  config JSONB DEFAULT '{}',
  state JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  messages JSONB[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'prd', 'architecture', 'story', etc.
  title TEXT NOT NULL,
  content TEXT,
  metadata JSONB DEFAULT '{}',
  version INTEGER DEFAULT 1,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'greenfield', 'brownfield'
  name TEXT NOT NULL,
  steps JSONB[] DEFAULT '{}',
  current_step INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  epic_id UUID REFERENCES stories(id),
  title TEXT NOT NULL,
  description TEXT,
  acceptance_criteria TEXT[],
  status TEXT DEFAULT 'draft',
  priority INTEGER DEFAULT 3,
  assigned_to UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'github', 'gitlab', 'vscode', etc.
  config JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team Collaboration
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);
```

### Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only see and edit their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Projects: Users can only access projects they own or are members of
CREATE POLICY "Users can access own projects" ON projects
  FOR ALL USING (
    auth.uid() = owner_id OR
    auth.uid() IN (
      SELECT user_id FROM team_members 
      WHERE project_id = projects.id
    )
  );

-- Apply similar policies to all related tables
-- (Full RLS policies would be defined for each table)
```

### Real-time Subscriptions

```typescript
// Real-time conversation updates
const conversationSubscription = supabase
  .channel('conversations')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'conversations',
      filter: `project_id=eq.${projectId}`,
    },
    (payload) => {
      // Update UI with new messages
      updateConversation(payload.new)
    }
  )
  .subscribe()

// Real-time document collaboration
const documentSubscription = supabase
  .channel('documents')
  .on(
    'postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'documents',
      filter: `project_id=eq.${projectId}`,
    },
    (payload) => {
      // Update document in real-time
      updateDocument(payload.new)
    }
  )
  .subscribe()
```

## AI Integration Architecture

### Edge Functions (Supabase)

```typescript
// AI Agent Orchestration
export const aiAgentHandler = async (req: Request) => {
  const { agentType, message, projectId, context } = await req.json()
  
  // Load agent configuration
  const agentConfig = await loadAgentConfig(agentType)
  
  // Prepare context from project data
  const projectContext = await buildProjectContext(projectId)
  
  // Call AI service
  const response = await callAIService({
    agent: agentConfig,
    message,
    context: { ...context, ...projectContext }
  })
  
  // Save conversation
  await saveConversation(projectId, agentType, message, response)
  
  return new Response(JSON.stringify(response), {
    headers: { 'Content-Type': 'application/json' }
  })
}

// Streaming AI Responses
export const streamingAgentHandler = async (req: Request) => {
  const stream = new ReadableStream({
    async start(controller) {
      const aiStream = await getAIStream(req)
      
      for await (const chunk of aiStream) {
        controller.enqueue(chunk)
      }
      
      controller.close()
    }
  })
  
  return new Response(stream, {
    headers: { 'Content-Type': 'text/stream' }
  })
}
```

### AI Service Integration

```typescript
// AI Client Configuration
export class AIClient {
  private openai: OpenAI
  private claude: Anthropic
  
  constructor() {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    this.claude = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY })
  }
  
  async generateResponse(agent: Agent, message: string, context: Context) {
    const prompt = this.buildPrompt(agent, message, context)
    
    switch (agent.provider) {
      case 'openai':
        return await this.openai.chat.completions.create({
          model: 'gpt-4-turbo',
          messages: prompt,
          stream: true
        })
      
      case 'claude':
        return await this.claude.messages.create({
          model: 'claude-3-opus',
          messages: prompt,
          stream: true
        })
    }
  }
  
  private buildPrompt(agent: Agent, message: string, context: Context) {
    // Load BMad agent configuration
    const bmadConfig = loadBMadConfig(agent.type)
    
    // Build context-aware prompt
    return [
      { role: 'system', content: bmadConfig.persona },
      { role: 'system', content: `Project Context: ${JSON.stringify(context)}` },
      { role: 'user', content: message }
    ]
  }
}
```

## Security Architecture

### Authentication & Authorization

```typescript
// Supabase Auth Configuration
export const supabaseAuth = {
  // Social providers
  providers: ['google', 'github', 'discord'],
  
  // JWT configuration
  jwt: {
    secret: process.env.SUPABASE_JWT_SECRET,
    expiresIn: '7d'
  },
  
  // RLS policies enforce data access
  rowLevelSecurity: true,
  
  // Session management
  session: {
    persistSession: true,
    autoRefreshToken: true
  }
}

// Authorization middleware
export async function authMiddleware(req: Request) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  
  if (!token) {
    throw new Error('No authentication token provided')
  }
  
  const { data: user } = await supabase.auth.getUser(token)
  
  if (!user) {
    throw new Error('Invalid authentication token')
  }
  
  return user
}
```

### Data Protection

```typescript
// Environment variables
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'OPENAI_API_KEY',
  'CLAUDE_API_KEY'
]

// Input validation
export const validateInput = (schema: z.ZodSchema, data: unknown) => {
  return schema.parse(data)
}

// Rate limiting
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
})
```

## Performance Architecture

### Caching Strategy

```typescript
// React Query for client-side caching
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false
    }
  }
})

// Supabase query caching
export const useProjectData = (projectId: string) => {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: () => fetchProject(projectId),
    enabled: !!projectId
  })
}
```

### Code Splitting

```typescript
// Dynamic imports for agent components
const AnalystAgent = dynamic(() => import('@/components/agents/AnalystAgent'), {
  loading: () => <AgentSkeleton />,
  ssr: false
})

const ArchitectAgent = dynamic(() => import('@/components/agents/ArchitectAgent'), {
  loading: () => <AgentSkeleton />,
  ssr: false
})

// Route-based code splitting
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Projects = lazy(() => import('@/pages/Projects'))
```

## Deployment Architecture

### Vercel Deployment

```typescript
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["cle1", "iad1"],
  "env": {
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase-url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase-anon-key",
    "SUPABASE_SERVICE_ROLE_KEY": "@supabase-service-role-key"
  }
}
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Monitoring & Analytics

### Error Tracking

```typescript
// Sentry configuration
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  beforeSend(event) {
    // Filter out sensitive data
    return event
  }
})
```

### Performance Monitoring

```typescript
// Web Vitals tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

const vitals = {
  cls: getCLS,
  fid: getFID,
  fcp: getFCP,
  lcp: getLCP,
  ttfb: getTTFB
}

// Track performance metrics
Object.entries(vitals).forEach(([name, fn]) => {
  fn((metric) => {
    // Send to analytics
    analytics.track('Web Vital', {
      name,
      value: metric.value,
      id: metric.id
    })
  })
})
```

## Development Workflow

### Local Development

```bash
# Environment setup
cp .env.example .env.local
npm install

# Database setup
npx supabase start
npx supabase db reset

# Development server
npm run dev

# Type checking
npm run type-check

# Testing
npm run test
```

### Testing Strategy

```typescript
// Jest configuration
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts'
  ]
}

// Testing utilities
export const renderWithProviders = (ui: React.ReactElement) => {
  return render(ui, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    )
  })
}
```

---

This architecture provides a solid foundation for building the BMad Visual Platform with excellent performance, security, and scalability. The modular design allows for iterative development and easy maintenance as the platform grows.