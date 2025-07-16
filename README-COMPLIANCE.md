# Quality Compliance Dashboard

A comprehensive web-based Quality Compliance Dashboard built with Next.js, React, and Supabase. This fullstack application provides monitoring and management of quality compliance metrics with a modern, responsive interface.

## Features

### 🔐 Authentication & Security
- **Supabase Authentication**: Secure login/signup with email/password
- **Social Login**: Google and GitHub authentication support
- **Role-based Access**: User profiles and permissions
- **Session Management**: Persistent sessions with auto-refresh

### 📊 Dashboard Components
- **KPI Cards**: Real-time metrics display
  - Overall Compliance Rate with trend indicators
  - Open CAPAs (Corrective and Preventive Actions)
  - Training Completion tracking
  - Audit Findings breakdown
- **Recent Audits Table**: Searchable audit history
- **Compliance Areas Chart**: Radar chart showing performance across areas
- **Document Management**: File upload, organization, and sharing

### 📈 Data Visualization
- **Recharts Integration**: Interactive charts and graphs
- **Trend Analysis**: Historical data visualization
- **Performance Metrics**: Real-time compliance scoring
- **Responsive Charts**: Mobile-friendly visualizations

### 🗄️ Database Schema
- **Compliance Metrics**: Time-series data storage
- **CAPA Management**: Corrective action tracking
- **Training Records**: Employee training completion
- **Audit Management**: Audit scheduling and findings
- **Document Storage**: File management with metadata

## Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Recharts**: Data visualization library
- **Lucide Icons**: Modern icon library
- **React Query**: Server state management

### Backend
- **Next.js API Routes**: Serverless functions
- **Supabase**: PostgreSQL database and auth
- **TypeScript**: Full-stack type safety
- **Supabase Storage**: File storage and management

### Database
- **PostgreSQL**: Relational database via Supabase
- **Row Level Security**: Data access controls
- **Real-time Subscriptions**: Live data updates
- **Automated Backups**: Data protection

## Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account and project
- Git

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bmadMethod
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy environment template
   cp .env.example .env.local
   
   # Add your Supabase credentials
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Run database migrations**
   ```bash
   # Apply the compliance dashboard schema
   supabase db push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Open http://localhost:3000
   - Navigate to `/compliance` for the dashboard

## Database Schema

### Core Tables

#### compliance_metrics
- Stores KPI and performance metrics
- Time-series data with targets and actuals
- Supports multiple metric types (percentage, count, etc.)

#### capas
- Corrective and Preventive Actions management
- Status tracking (open, in_progress, closed)
- Due date monitoring and assignment

#### training_records
- Employee training completion tracking
- Certification management
- Compliance training requirements

#### audits
- Audit scheduling and management
- Findings tracking and resolution
- Multi-type audit support (internal, external, etc.)

#### compliance_areas
- Performance scoring across compliance domains
- Radar chart data source
- Assessment history tracking

#### compliance_documents
- Document storage and metadata
- File organization and categorization
- Version control and access tracking

### Relationships
- All tables link to projects for multi-tenancy
- User associations for ownership and assignments
- Audit findings linked to specific audits
- Training records linked to users

## API Endpoints

### Authentication
- `POST /api/auth/login` - User authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - Session termination

### Compliance Data
- `GET /api/compliance/metrics` - Fetch compliance metrics
- `POST /api/compliance/metrics` - Create new metrics
- `PUT /api/compliance/metrics` - Update existing metrics
- `DELETE /api/compliance/metrics` - Delete metrics

### CAPA Management
- `GET /api/compliance/capas` - Fetch CAPAs
- `POST /api/compliance/capas` - Create new CAPA
- `PUT /api/compliance/capas` - Update CAPA
- `DELETE /api/compliance/capas` - Delete CAPA

### Additional APIs
- Document management endpoints
- Training record APIs
- Audit management endpoints
- Compliance area APIs

## Usage

### Dashboard Navigation
1. **Login/Signup**: Access the authentication system
2. **Dashboard Overview**: View KPI cards and metrics
3. **Audit Management**: Track audit status and findings
4. **Document Center**: Upload and manage compliance documents
5. **Training Center**: Monitor training completion rates

### Data Management
1. **Metrics Input**: Add new compliance measurements
2. **CAPA Creation**: Log corrective actions
3. **Document Upload**: Store compliance documents
4. **Report Generation**: Export compliance reports

### Visualization
1. **KPI Cards**: Real-time metric display
2. **Trend Charts**: Historical performance analysis
3. **Radar Charts**: Multi-dimensional compliance scoring
4. **Progress Bars**: Training and target completion

## Configuration

### Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_BYPASS_AUTH=false # Set to true for development
```

### Supabase Configuration
1. **Database Setup**: Apply provided migrations
2. **Storage Buckets**: Create 'documents' bucket
3. **RLS Policies**: Configure row-level security
4. **Auth Providers**: Enable email and social authentication

### Customization
- **Branding**: Update colors and logos in Tailwind config
- **Metrics**: Modify KPI calculations in components
- **Charts**: Customize visualization styles
- **Workflow**: Adapt business logic to organizational needs

## Deployment

### Production Deployment
1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel/Netlify**
   ```bash
   # Vercel
   vercel --prod
   
   # Netlify
   netlify deploy --prod
   ```

3. **Configure production environment**
   - Set production Supabase credentials
   - Configure domain and SSL
   - Set up monitoring and logging

### CI/CD Pipeline
- **GitHub Actions**: Automated testing and deployment
- **Environment Management**: Staging and production environments
- **Database Migrations**: Automated schema updates
- **Performance Monitoring**: Real-time application insights

## Contributing

### Development Workflow
1. **Fork the repository**
2. **Create feature branch**
3. **Implement changes**
4. **Write tests**
5. **Submit pull request**

### Code Standards
- **TypeScript**: Strict type checking
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **Conventional Commits**: Commit message standards

### Testing
- **Jest**: Unit testing
- **React Testing Library**: Component testing
- **Playwright**: End-to-end testing
- **Coverage**: Minimum 80% test coverage

## Support

### Documentation
- **API Reference**: Detailed endpoint documentation
- **Component Library**: Reusable UI components
- **Database Schema**: Complete ERD and relationships
- **Deployment Guide**: Step-by-step deployment instructions

### Community
- **GitHub Issues**: Bug reports and feature requests
- **Discussions**: Community support and ideas
- **Wiki**: Extended documentation and examples
- **Changelog**: Version history and updates

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with the BMad Framework for Universal AI Agent systems
- Uses Supabase for backend infrastructure
- Leverages modern React and Next.js patterns
- Implements accessibility best practices
- Follows quality compliance industry standards

---

For more information, visit the [BMad Framework](https://github.com/bmad-framework) documentation.