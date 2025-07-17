# BMad Visual Platform v1.0

🎉 **Now Ready for Production!** Transform your development workflow with AI-powered agents in a beautiful, intuitive interface. Experience "vibe coding" with the structured power of the BMad Method.

✨ **Latest Update**: Enhanced agent picker popup with improved positioning and visibility - now with better @ symbol integration!

## 🎭 BMad Framework Chat
**Production Ready:** Access the BMad chat interface at [/bmad-chat](https://bmad-visual-platform.netlify.app/bmad-chat)
- 7 specialized BMad agents (Orchestrator, Analyst, Architect, Developer, QA, Scrum Master, UX Expert)
- BMad command system with `*` prefix
- Agent switching with `@` symbol for seamless workflow
- Responsive design optimized for all screen sizes
- Ready for live API integration

## 🎯 Features

### ✨ Beautiful Agent Personalities
- **7 Specialized Agents** - Each with unique visual identity and expertise
- **Smooth Animations** - Fluid transitions and interactions
- **Real-time Chat** - Natural conversation with AI agents
- **Agent Switching** - Seamlessly switch between specialists using `@` symbol
- **Responsive Interface** - Optimized for desktop, tablet, and mobile devices

### 🧠 BMad Method Power
- **Strategic Planning** - Analyst agent for requirements and project briefs
- **Architecture Design** - Architect agent for system design
- **Story Management** - Scrum Master for breaking down work
- **Quality Assurance** - QA agent for testing and validation
- **Full Development Lifecycle** - From ideation to deployment

### 🚀 Modern Tech Stack
- **Next.js 14** - Latest React framework with App Router
- **Supabase** - Backend-as-a-Service with real-time capabilities
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **TypeScript** - Full type safety

## 🏗️ Architecture

### Frontend
- **React 18** with Server Components
- **Tailwind CSS** + **shadcn/ui** for beautiful components
- **Framer Motion** for animations
- **Zustand** for state management

### Backend
- **Supabase PostgreSQL** - Scalable database
- **Row Level Security** - Secure multi-tenant data
- **Real-time Subscriptions** - Live collaboration
- **Edge Functions** - AI integration endpoints

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Supabase account
- AI API keys (OpenAI/Claude)

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd bmad-visual-platform
npm install
```

2. **Set up Supabase:**
```bash
# Create a new Supabase project at https://supabase.com
# Copy your project URL and anon key
```

3. **Configure environment variables:**
```bash
cp .env.example .env.local
# Edit .env.local with your values
```

4. **Set up the database:**
```bash
# Run the SQL schema from supabase/schema.sql in your Supabase dashboard
# Or use the Supabase CLI if you have it set up
```

5. **Start the development server:**
```bash
npm run dev
```

Visit `http://localhost:3000` to see your BMad Visual Platform!

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── dashboard/         # Main application
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── agents/           # Agent-specific components
│   └── auth/             # Authentication components
├── contexts/             # React contexts
├── lib/                  # Utility functions
├── types/                # TypeScript types
└── hooks/                # Custom React hooks
```

## 🤖 Available Agents

### 📊 Sarah - Strategic Analyst
- **Expertise:** Requirements analysis, market research, project planning
- **Use for:** Creating project briefs, understanding requirements
- **Color:** Blue theme

### 🏗️ Winston - System Architect  
- **Expertise:** System design, architecture, technology selection
- **Use for:** Designing technical architecture, selecting technologies
- **Color:** Green theme

### 💻 James - Full Stack Developer
- **Expertise:** Coding, debugging, implementation
- **Use for:** Writing code, implementing features
- **Color:** Purple theme

### 🛡️ Maya - Quality Assurance
- **Expertise:** Testing, quality assurance, bug detection
- **Use for:** Testing applications, ensuring quality
- **Color:** Amber theme

### 👥 Alex - Scrum Master
- **Expertise:** Project management, workflow optimization
- **Use for:** Breaking down work, managing sprints
- **Color:** Red theme

### 🎯 Emma - Product Owner
- **Expertise:** Product strategy, user needs, business value
- **Use for:** Defining requirements, prioritizing features
- **Color:** Pink theme

### 🎨 Jordan - UX Expert
- **Expertise:** User experience, interface design, usability
- **Use for:** Designing user interfaces, improving UX
- **Color:** Indigo theme

## 🎨 Design System

### Color Scheme
Each agent has a unique color palette:
- **Primary:** Main brand color
- **Secondary:** Lighter accent color  
- **Accent:** Darker emphasis color

### Typography
- **Font:** Inter (clean, modern sans-serif)
- **Scale:** Tailwind's typography scale
- **Weight:** Regular, medium, semibold, bold

### Components
Built with **shadcn/ui** for:
- Consistent design language
- Accessibility by default
- Customizable themes
- High-quality animations

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Adding New Agents
1. Define agent personality in `src/types/agents.ts`
2. Add agent colors to `src/app/globals.css`
3. Create agent-specific components if needed
4. Update agent switcher and hub components

### Database Changes
1. Modify `supabase/schema.sql`
2. Run migrations in Supabase dashboard
3. Update TypeScript types in `src/types/database.ts`

## 🚀 Deployment

### Production Deployment (v1.0 Ready)
The BMad Visual Platform is production-ready and can be deployed to any modern hosting platform:

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy automatically

### Netlify
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables
5. Deploy automatically on push

### Environment Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_key
CLAUDE_API_KEY=your_claude_key
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

## 🆘 Support

- **Documentation:** [Link to docs]
- **Issues:** [GitHub Issues](https://github.com/your-repo/issues)
- **Discord:** [Community Discord](https://discord.gg/your-server)

## 🙏 Acknowledgments

- **BMad Method** - The foundational development methodology
- **Supabase** - Amazing backend-as-a-service platform
- **Vercel** - Seamless deployment and hosting
- **shadcn/ui** - Beautiful, accessible component library

---

**Built with ❤️ for the future of AI-driven development**

*Transform your development workflow. Experience vibe coding with structure.*