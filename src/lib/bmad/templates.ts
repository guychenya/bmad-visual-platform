// BMad Professional Template Engine
// Generates comprehensive project deliverables using BMad methodology

export interface ProjectContext {
  name: string
  description: string
  industry?: string
  complexity: 'simple' | 'medium' | 'complex'
  timeline?: string
  budget?: string
  stakeholders?: string[]
  requirements?: string[]
  constraints?: string[]
  phase: 'setup' | 'requirements' | 'architecture' | 'development' | 'qa' | 'completed'
}

export interface DeliverableMetadata {
  title: string
  version: string
  author: string
  date: string
  reviewers?: string[]
  status: 'draft' | 'review' | 'approved'
}

export class BMadTemplateEngine {
  static generateProjectBrief(context: ProjectContext): string {
    const metadata: DeliverableMetadata = {
      title: `Project Brief: ${context.name}`,
      version: '1.0',
      author: 'BMad AI Business Analyst',
      date: new Date().toLocaleDateString(),
      status: 'draft'
    }

    return `# ${metadata.title}

**Document Metadata**
- Version: ${metadata.version}
- Author: ${metadata.author}
- Date: ${metadata.date}
- Status: ${metadata.status}

---

## Executive Summary

${context.name} is a ${context.complexity} complexity project designed to ${context.description}. This document outlines the strategic vision, scope, and implementation approach following BMad methodology principles.

### Project Vision
${BMadTemplateEngine.generateVisionStatement(context)}

### Success Criteria
${BMadTemplateEngine.generateSuccessCriteria(context)}

---

## Business Context

### Problem Statement
${BMadTemplateEngine.generateProblemStatement(context)}

### Target Market & Users
${BMadTemplateEngine.generateTargetMarket(context)}

### Business Objectives
${BMadTemplateEngine.generateBusinessObjectives(context)}

---

## Project Scope

### In Scope
${BMadTemplateEngine.generateInScope(context)}

### Out of Scope
${BMadTemplateEngine.generateOutOfScope(context)}

### Dependencies & Assumptions
${BMadTemplateEngine.generateDependenciesAssumptions(context)}

---

## Risk Assessment

### Technical Risks
${BMadTemplateEngine.generateTechnicalRisks(context)}

### Business Risks
${BMadTemplateEngine.generateBusinessRisks(context)}

### Mitigation Strategies
${BMadTemplateEngine.generateMitigationStrategies(context)}

---

## Resource Requirements

### Team Structure
- **BMad Orchestrator**: Project coordination and workflow management
- **Business Analyst**: Requirements gathering and stakeholder management
- **System Architect**: Technical architecture and system design
- **Full-Stack Developer**: Implementation and code development
- **QA Engineer**: Testing strategy and quality assurance
- **UX Expert**: User experience design and interface planning

### Timeline Estimation
${BMadTemplateEngine.generateTimelineEstimation(context)}

### Budget Considerations
${BMadTemplateEngine.generateBudgetConsiderations(context)}

---

## Next Steps

### Immediate Actions (Next 1-2 weeks)
1. **Requirements Deep Dive** - Conduct stakeholder interviews and requirements workshops
2. **Technical Research** - Investigate technology stack and architectural patterns
3. **User Research** - Define user personas and journey mapping
4. **Proof of Concept** - Develop technical feasibility demonstrations

### Phase 1: Requirements & Planning (Weeks 1-3)
- Detailed functional requirements documentation
- Non-functional requirements specification
- User story development and prioritization
- Technical architecture blueprint

### Phase 2: Design & Architecture (Weeks 4-6)
- System architecture design
- Database schema design
- API specification development
- User interface wireframes and mockups

### Phase 3: Development & Testing (Weeks 7-12)
- Sprint-based development cycles
- Continuous integration and testing
- Regular stakeholder reviews and feedback
- Quality assurance and performance testing

---

## Recommendations for Development

### For Vibe Coding System Integration

**1. Technical Stack Recommendations**
${BMadTemplateEngine.generateTechStackRecommendations(context)}

**2. Architecture Patterns**
${BMadTemplateEngine.generateArchitecturePatterns(context)}

**3. Development Approach**
${BMadTemplateEngine.generateDevelopmentApproach(context)}

**4. Quality Assurance Strategy**
${BMadTemplateEngine.generateQAStrategy(context)}

---

## Appendices

### A. Stakeholder Contact Information
${BMadTemplateEngine.generateStakeholderInfo(context)}

### B. Technical Requirements Summary
${BMadTemplateEngine.generateTechnicalRequirements(context)}

### C. Business Rules & Logic
${BMadTemplateEngine.generateBusinessRules(context)}

---

*This document was generated using BMad AI methodology. For questions or clarifications, please contact the project team.*

**Document Control**
- Next Review Date: ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
- Distribution: Project Team, Stakeholders, Development Team
- Classification: Internal Use`
  }

  static generateUserStories(context: ProjectContext): string {
    return `# User Stories: ${context.name}

**Document Metadata**
- Version: 1.0
- Author: BMad AI Business Analyst
- Date: ${new Date().toLocaleDateString()}
- Status: Draft

---

## Overview

This document contains comprehensive user stories for ${context.name}, organized by user type and feature area. Each story follows the standard format: "As a [user type], I want [goal] so that [benefit]."

---

## User Personas

${BMadTemplateEngine.generateUserPersonas(context)}

---

## Epic 1: User Authentication & Access Management

### Core Authentication Stories

**Story 1.1: User Registration**
- **As a** new user
- **I want to** create an account with email and password
- **So that** I can access the application securely

**Acceptance Criteria:**
- [ ] User can register with valid email address
- [ ] Password must meet security requirements (8+ chars, mixed case, numbers)
- [ ] Email verification is required before account activation
- [ ] User receives welcome email with onboarding information
- [ ] Duplicate email addresses are prevented
- [ ] Registration form validates input in real-time

**Story 1.2: User Login**
- **As a** registered user
- **I want to** log in with my credentials
- **So that** I can access my personalized dashboard

**Acceptance Criteria:**
- [ ] User can login with email and password
- [ ] Invalid credentials show clear error messages
- [ ] Account lockout after 5 failed attempts
- [ ] "Remember me" option for trusted devices
- [ ] Password reset functionality available
- [ ] Session management with automatic logout

---

## Epic 2: Core Application Features

${BMadTemplateEngine.generateCoreFeatureStories(context)}

---

## Epic 3: Administrative Functions

**Story 3.1: User Management**
- **As an** administrator
- **I want to** manage user accounts and permissions
- **So that** I can control system access and security

**Story 3.2: System Configuration**
- **As an** administrator
- **I want to** configure system settings and preferences
- **So that** the application meets organizational requirements

---

## Epic 4: Reporting & Analytics

**Story 4.1: Usage Analytics**
- **As a** stakeholder
- **I want to** view system usage analytics and reports
- **So that** I can make data-driven decisions

**Story 4.2: Export Functionality**
- **As a** user
- **I want to** export data and reports
- **So that** I can use the information in other systems

---

## Non-Functional Requirements

### Performance Requirements
- Page load times under 2 seconds
- API response times under 500ms
- Support for 1000+ concurrent users
- 99.9% uptime availability

### Security Requirements
- Data encryption in transit and at rest
- Regular security audits and penetration testing
- GDPR and privacy compliance
- Role-based access control

### Usability Requirements
- Mobile-responsive design
- WCAG 2.1 AA accessibility compliance
- Intuitive navigation and user interface
- Comprehensive help documentation

---

## Story Prioritization

### Must Have (P0) - MVP Release
${BMadTemplateEngine.generateMustHaveStories(context)}

### Should Have (P1) - Version 1.1
${BMadTemplateEngine.generateShouldHaveStories(context)}

### Could Have (P2) - Future Releases
${BMadTemplateEngine.generateCouldHaveStories(context)}

### Won't Have (P3) - Out of Scope
${BMadTemplateEngine.generateWontHaveStories(context)}

---

## Implementation Recommendations

### Development Approach
1. **Start with authentication** - Build secure foundation first
2. **Core features next** - Implement primary user workflows
3. **Administrative functions** - Add management capabilities
4. **Analytics last** - Layer on reporting and insights

### Technical Considerations
- Use industry-standard authentication libraries
- Implement API-first architecture for scalability
- Design responsive UI components from the start
- Plan for internationalization and localization

---

*This document represents a comprehensive user story collection for ${context.name}. Stories should be refined and estimated during sprint planning sessions.*`
  }

  static generateTechnicalArchitecture(context: ProjectContext): string {
    return `# Technical Architecture: ${context.name}

**Document Metadata**
- Version: 1.0
- Author: BMad AI System Architect
- Date: ${new Date().toLocaleDateString()}
- Status: Draft

---

## Architecture Overview

This document outlines the technical architecture for ${context.name}, providing a comprehensive blueprint for system design, technology selection, and implementation strategy.

### System Vision
${BMadTemplateEngine.generateSystemVision(context)}

### Architecture Principles
${BMadTemplateEngine.generateArchitecturePrinciples(context)}

---

## System Architecture

### High-Level Architecture Diagram
\`\`\`
[Frontend] ↔ [API Gateway] ↔ [Microservices] ↔ [Database]
     ↓              ↓              ↓              ↓
[CDN/Cache]   [Auth Service]  [Message Queue]  [File Storage]
\`\`\`

### Component Breakdown

#### Frontend Layer
${BMadTemplateEngine.generateFrontendArchitecture(context)}

#### API Layer
${BMadTemplateEngine.generateAPIArchitecture(context)}

#### Business Logic Layer
${BMadTemplateEngine.generateBusinessLogicArchitecture(context)}

#### Data Layer
${BMadTemplateEngine.generateDataArchitecture(context)}

---

## Technology Stack

### Frontend Technologies
${BMadTemplateEngine.generateFrontendStack(context)}

### Backend Technologies
${BMadTemplateEngine.generateBackendStack(context)}

### Database Technologies
${BMadTemplateEngine.generateDatabaseStack(context)}

### Infrastructure & DevOps
${BMadTemplateEngine.generateInfrastructureStack(context)}

---

## Security Architecture

### Authentication & Authorization
${BMadTemplateEngine.generateSecurityAuthentication(context)}

### Data Protection
${BMadTemplateEngine.generateDataProtection(context)}

### Network Security
${BMadTemplateEngine.generateNetworkSecurity(context)}

---

## Scalability & Performance

### Performance Requirements
${BMadTemplateEngine.generatePerformanceRequirements(context)}

### Scalability Strategy
${BMadTemplateEngine.generateScalabilityStrategy(context)}

### Caching Strategy
${BMadTemplateEngine.generateCachingStrategy(context)}

---

## Development Recommendations

### For Vibe Coding System

**1. Project Structure**
\`\`\`
project-root/
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── utils/
├── backend/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   └── middleware/
├── database/
│   ├── migrations/
│   ├── seeds/
│   └── schemas/
└── infrastructure/
    ├── docker/
    ├── kubernetes/
    └── ci-cd/
\`\`\`

**2. API Design Pattern**
${BMadTemplateEngine.generateAPIDesignPattern(context)}

**3. Database Schema Design**
${BMadTemplateEngine.generateDatabaseDesign(context)}

**4. Deployment Strategy**
${BMadTemplateEngine.generateDeploymentStrategy(context)}

---

## Implementation Phases

### Phase 1: Foundation (Weeks 1-2)
- Set up development environment
- Implement basic authentication
- Create core database schema
- Establish CI/CD pipeline

### Phase 2: Core Features (Weeks 3-6)
- Implement main user workflows
- Build API endpoints
- Develop frontend components
- Add basic security measures

### Phase 3: Advanced Features (Weeks 7-10)
- Add advanced functionality
- Implement caching and optimization
- Enhance security measures
- Performance testing and tuning

### Phase 4: Production Readiness (Weeks 11-12)
- Security audits and penetration testing
- Load testing and performance optimization
- Documentation and deployment guides
- Production deployment and monitoring

---

## Technical Debt & Maintenance

### Code Quality Standards
${BMadTemplateEngine.generateCodeQualityStandards(context)}

### Monitoring & Logging
${BMadTemplateEngine.generateMonitoringStrategy(context)}

### Backup & Recovery
${BMadTemplateEngine.generateBackupStrategy(context)}

---

*This technical architecture provides a solid foundation for ${context.name}. Regular reviews and updates should be conducted as the project evolves.*`
  }

  // Helper methods for generating specific sections
  private static generateVisionStatement(context: ProjectContext): string {
    return `To deliver a ${context.complexity}-scale solution that ${context.description}, providing measurable business value through innovative technology implementation.`
  }

  private static generateSuccessCriteria(context: ProjectContext): string {
    return `- Successful deployment and user adoption within planned timeline
- Achievement of defined performance benchmarks
- Positive user feedback and satisfaction metrics
- Technical architecture meets scalability requirements
- Budget adherence and resource optimization`
  }

  private static generateProblemStatement(context: ProjectContext): string {
    return `Current market conditions and user needs indicate a gap that ${context.name} aims to address through ${context.description}. This solution will provide significant value by improving efficiency, user experience, and business outcomes.`
  }

  private static generateTargetMarket(context: ProjectContext): string {
    return `Primary users include professionals and organizations seeking efficient solutions for ${context.description}. Secondary users encompass stakeholders who benefit from improved processes and outcomes.`
  }

  private static generateBusinessObjectives(context: ProjectContext): string {
    return `1. **Market Penetration** - Establish strong presence in target market
2. **User Satisfaction** - Achieve high user adoption and retention rates
3. **Operational Efficiency** - Streamline processes and reduce manual overhead
4. **Revenue Growth** - Generate sustainable business value and ROI
5. **Innovation Leadership** - Position as market leader in solution space`
  }

  private static generateInScope(context: ProjectContext): string {
    return `- Core application functionality as defined in requirements
- User authentication and authorization systems
- Data management and storage capabilities
- API development and integration points
- Frontend user interface and experience
- Basic reporting and analytics features
- Security implementation and compliance measures`
  }

  private static generateOutOfScope(context: ProjectContext): string {
    return `- Advanced AI/ML features (future enhancement)
- Third-party integrations beyond specified requirements
- Mobile native applications (web-responsive initially)
- Advanced analytics and business intelligence
- Multi-tenant architecture (single-tenant initially)
- Legacy system migration (if applicable)`
  }

  private static generateTechStackRecommendations(context: ProjectContext): string {
    const stacks = {
      simple: `**Recommended Stack for Simple Projects:**
- Frontend: React.js with TypeScript, Tailwind CSS
- Backend: Node.js with Express or Next.js full-stack
- Database: PostgreSQL or MongoDB
- Hosting: Vercel, Netlify, or AWS Amplify`,
      
      medium: `**Recommended Stack for Medium Projects:**
- Frontend: React.js/Next.js with TypeScript, component library
- Backend: Node.js with Express/NestJS or Python Django/FastAPI
- Database: PostgreSQL with Redis caching
- Infrastructure: AWS/GCP with containerization
- CI/CD: GitHub Actions or GitLab CI`,
      
      complex: `**Recommended Stack for Complex Projects:**
- Frontend: React.js/Next.js with micro-frontend architecture
- Backend: Microservices with Node.js/Python/Go
- Database: PostgreSQL cluster with Redis and search engines
- Infrastructure: Kubernetes on AWS/GCP/Azure
- Monitoring: DataDog, NewRelic, or Prometheus stack`
    }
    
    return stacks[context.complexity] || stacks.medium
  }

  private static generateArchitecturePatterns(context: ProjectContext): string {
    return `**Recommended Patterns:**
- **API-First Design** - Design APIs before implementation
- **Component-Based Frontend** - Reusable UI components
- **Service Layer Architecture** - Separation of business logic
- **Database Per Service** - If using microservices
- **Event-Driven Architecture** - For complex workflows
- **CQRS Pattern** - For complex read/write operations`
  }

  private static generateDevelopmentApproach(context: ProjectContext): string {
    return `**Agile Development Approach:**
1. **Sprint Planning** - 2-week sprints with clear deliverables
2. **Test-Driven Development** - Write tests before implementation
3. **Continuous Integration** - Automated testing and deployment
4. **Code Reviews** - Peer review for all code changes
5. **Documentation First** - Document APIs and architecture decisions
6. **Performance Testing** - Regular performance benchmarking`
  }

  private static generateQAStrategy(context: ProjectContext): string {
    return `**Comprehensive QA Strategy:**
- **Unit Testing** - 80%+ code coverage requirement
- **Integration Testing** - API and database integration tests
- **End-to-End Testing** - Critical user flow automation
- **Security Testing** - Regular vulnerability assessments
- **Performance Testing** - Load and stress testing
- **User Acceptance Testing** - Stakeholder validation sessions`
  }

  // Additional helper methods would continue here...
  private static generateUserPersonas(context: ProjectContext): string {
    return `### Primary User: Professional User
- **Demographics**: 25-45 years old, tech-savvy professionals
- **Goals**: Efficient task completion, reliable performance
- **Pain Points**: Complex interfaces, slow performance
- **Technology Comfort**: High, expects modern UX patterns

### Secondary User: Administrator
- **Demographics**: 30-50 years old, technical background
- **Goals**: System management, user oversight, reporting
- **Pain Points**: Limited visibility, manual processes
- **Technology Comfort**: Very high, power user capabilities`
  }

  private static generateCoreFeatureStories(context: ProjectContext): string {
    return `**Story 2.1: Dashboard Access**
- **As a** logged-in user
- **I want to** see a personalized dashboard
- **So that** I can quickly access my most important information

**Story 2.2: Data Management**
- **As a** user
- **I want to** create, read, update, and delete my data
- **So that** I can manage my information effectively

**Story 2.3: Search & Filter**
- **As a** user
- **I want to** search and filter through my data
- **So that** I can quickly find what I need`
  }

  private static generateSystemVision(context: ProjectContext): string {
    return `${context.name} will be built as a modern, scalable application following industry best practices for ${context.complexity} systems. The architecture emphasizes maintainability, performance, and security while enabling future growth and feature expansion.`
  }

  private static generateArchitecturePrinciples(context: ProjectContext): string {
    return `1. **Separation of Concerns** - Clear boundaries between layers
2. **Scalability First** - Design for growth from day one
3. **Security by Design** - Built-in security at every layer
4. **API-First Approach** - Enable future integrations
5. **Performance Optimization** - Fast, responsive user experience
6. **Maintainable Code** - Clean, documented, testable codebase`
  }

  // Continue with more helper methods...
  private static generateMustHaveStories(context: ProjectContext): string {
    return `- User authentication and basic profile management
- Core application functionality as defined in MVP
- Basic data CRUD operations
- Essential security measures
- Responsive web interface`
  }

  private static generateShouldHaveStories(context: ProjectContext): string {
    return `- Advanced search and filtering capabilities
- Email notifications and alerts
- Basic reporting features
- User preferences and customization
- Mobile optimization improvements`
  }

  private static generateCouldHaveStories(context: ProjectContext): string {
    return `- Advanced analytics and insights
- API integrations with third-party services
- Advanced user roles and permissions
- Bulk operations and data import/export
- Advanced customization options`
  }

  private static generateWontHaveStories(context: ProjectContext): string {
    return `- AI/ML capabilities (future roadmap)
- Native mobile applications
- Multi-language support
- Advanced workflow automation
- Enterprise-level integrations`
  }

  private static generateFrontendArchitecture(context: ProjectContext): string {
    return `**Modern React.js Architecture:**
- Component-based design with reusable UI elements
- State management with Context API or Redux
- Responsive design with mobile-first approach
- Progressive Web App (PWA) capabilities
- TypeScript for type safety and developer experience`
  }

  private static generateAPIArchitecture(context: ProjectContext): string {
    return `**RESTful API Design:**
- OpenAPI/Swagger documentation
- JWT-based authentication
- Rate limiting and throttling
- Comprehensive error handling
- API versioning strategy`
  }

  private static generateBusinessLogicArchitecture(context: ProjectContext): string {
    return `**Service Layer Pattern:**
- Business logic separated from controllers
- Domain-driven design principles
- Transaction management
- Error handling and logging
- Input validation and sanitization`
  }

  private static generateDataArchitecture(context: ProjectContext): string {
    return `**Database Design:**
- Normalized relational database structure
- Indexing strategy for performance
- Data migration and backup procedures
- Connection pooling and optimization
- Audit logging for compliance`
  }

  private static generateStakeholderInfo(context: ProjectContext): string {
    return `**Project Sponsor**: TBD - Business stakeholder
**Product Owner**: TBD - Requirements and priority decisions
**Technical Lead**: BMad AI System Architect
**Development Team**: BMad AI Development Team
**QA Lead**: BMad AI QA Engineer`
  }

  private static generateTechnicalRequirements(context: ProjectContext): string {
    return `**Performance**: Sub-2 second page loads, 99.9% uptime
**Security**: HTTPS, data encryption, secure authentication
**Compatibility**: Modern browsers, mobile responsive
**Scalability**: Support for 1000+ concurrent users
**Monitoring**: Application and infrastructure monitoring`
  }

  private static generateBusinessRules(context: ProjectContext): string {
    return `**Data Validation**: All inputs must be validated and sanitized
**User Access**: Role-based permissions for different user types
**Data Retention**: Comply with data protection regulations
**Audit Trail**: Track all significant user actions
**Business Logic**: Implement domain-specific rules and workflows`
  }

  private static generateTimelineEstimation(context: ProjectContext): string {
    const timelines = {
      simple: '6-8 weeks total development time',
      medium: '10-14 weeks total development time', 
      complex: '16-24 weeks total development time'
    }
    return timelines[context.complexity] || timelines.medium
  }

  private static generateBudgetConsiderations(context: ProjectContext): string {
    return `**Development Costs**: Team salaries and contractor fees
**Infrastructure**: Cloud hosting and service costs
**Tools & Licenses**: Development tools and software licenses
**Security**: Security audits and compliance costs
**Maintenance**: Ongoing support and maintenance budget`
  }

  private static generateTechnicalRisks(context: ProjectContext): string {
    return `**Performance Bottlenecks**: Database queries and API response times
**Security Vulnerabilities**: Data breaches and unauthorized access
**Scalability Issues**: Handling increased user load
**Integration Challenges**: Third-party service dependencies
**Technology Obsolescence**: Keeping up with technology changes`
  }

  private static generateBusinessRisks(context: ProjectContext): string {
    return `**Market Changes**: Shifting user requirements and competition
**Resource Constraints**: Team availability and budget limitations
**Stakeholder Alignment**: Changing priorities and requirements
**User Adoption**: Lower than expected user engagement
**Regulatory Changes**: New compliance requirements`
  }

  private static generateMitigationStrategies(context: ProjectContext): string {
    return `**Regular Reviews**: Weekly progress reviews and risk assessments
**Prototype Early**: Build MVPs to validate assumptions
**Flexible Architecture**: Design for change and adaptability
**Comprehensive Testing**: Automated testing and quality assurance
**Stakeholder Communication**: Regular updates and feedback sessions`
  }

  private static generateDependenciesAssumptions(context: ProjectContext): string {
    return `**Dependencies:**
- Access to necessary development environments
- Stakeholder availability for requirements validation
- Third-party service availability and reliability
- Adequate development resources and timeline

**Assumptions:**
- Requirements will remain stable during development
- Users have modern browsers and internet connectivity
- Business stakeholders will provide timely feedback
- Development team has necessary technical expertise`
  }

  private static generateFrontendStack(context: ProjectContext): string {
    return `**Frontend Framework**: React.js 18+ with TypeScript
**State Management**: Context API or Zustand for complex state
**Styling**: Tailwind CSS with component library (Shadcn/ui)
**Build Tool**: Vite or Next.js for optimization
**Testing**: Jest and React Testing Library`
  }

  private static generateBackendStack(context: ProjectContext): string {
    return `**Runtime**: Node.js 18+ LTS
**Framework**: Express.js or NestJS for enterprise features
**Language**: TypeScript for type safety
**Authentication**: JWT with refresh tokens
**Validation**: Joi or Zod for input validation`
  }

  private static generateDatabaseStack(context: ProjectContext): string {
    return `**Primary Database**: PostgreSQL 14+ for relational data
**Caching**: Redis for session and application caching
**Search**: Elasticsearch for full-text search (if needed)
**File Storage**: AWS S3 or similar for file uploads
**Migration**: Database migration tools for schema management`
  }

  private static generateInfrastructureStack(context: ProjectContext): string {
    return `**Cloud Provider**: AWS, Google Cloud, or Azure
**Containerization**: Docker for development and deployment
**Orchestration**: Kubernetes or Docker Compose
**CI/CD**: GitHub Actions or GitLab CI/CD
**Monitoring**: Application and infrastructure monitoring tools`
  }

  private static generateSecurityAuthentication(context: ProjectContext): string {
    return `**Authentication**: JWT tokens with secure refresh mechanism
**Authorization**: Role-based access control (RBAC)
**Password Security**: Bcrypt hashing with salt
**Session Management**: Secure session handling and timeout
**Two-Factor Authentication**: Optional 2FA for enhanced security`
  }

  private static generateDataProtection(context: ProjectContext): string {
    return `**Encryption**: AES-256 encryption for sensitive data
**Data Classification**: Categorize data by sensitivity level
**Access Controls**: Principle of least privilege
**Audit Logging**: Track all data access and modifications
**Backup Security**: Encrypted backups with secure storage`
  }

  private static generateNetworkSecurity(context: ProjectContext): string {
    return `**HTTPS Only**: Force SSL/TLS for all communications
**API Security**: Rate limiting and input validation
**CORS Policy**: Strict cross-origin resource sharing
**Firewall Rules**: Network-level access controls
**DDoS Protection**: Protection against distributed attacks`
  }

  private static generatePerformanceRequirements(context: ProjectContext): string {
    return `**Response Time**: API responses under 500ms
**Page Load**: Initial page load under 2 seconds
**Throughput**: Handle 1000+ concurrent users
**Availability**: 99.9% uptime requirement
**Database**: Query response times under 100ms`
  }

  private static generateScalabilityStrategy(context: ProjectContext): string {
    return `**Horizontal Scaling**: Load balancers and multiple server instances
**Database Scaling**: Read replicas and connection pooling
**Caching Strategy**: Multiple caching layers for performance
**CDN Usage**: Content delivery network for static assets
**Microservices**: Break into smaller services as needed`
  }

  private static generateCachingStrategy(context: ProjectContext): string {
    return `**Application Cache**: Redis for session and frequently accessed data
**Database Cache**: Query result caching and connection pooling
**CDN Cache**: Static asset caching at edge locations
**Browser Cache**: Proper cache headers for client-side caching
**Cache Invalidation**: Strategy for cache updates and expiration`
  }

  private static generateAPIDesignPattern(context: ProjectContext): string {
    return `**RESTful Design**: Standard HTTP methods and status codes
**Resource Naming**: Consistent and intuitive URL patterns
**Pagination**: Limit and offset for large result sets
**Filtering**: Query parameters for data filtering and sorting
**Error Handling**: Consistent error response format
**Documentation**: OpenAPI/Swagger for API documentation`
  }

  private static generateDatabaseDesign(context: ProjectContext): string {
    return `**Schema Design**: Normalized tables with proper relationships
**Indexing Strategy**: Optimize for common query patterns
**Data Types**: Appropriate data types for each field
**Constraints**: Foreign keys and check constraints
**Migrations**: Version-controlled schema changes
**Backup Strategy**: Regular automated backups with testing`
  }

  private static generateDeploymentStrategy(context: ProjectContext): string {
    return `**Environment Strategy**: Development, staging, and production environments
**CI/CD Pipeline**: Automated testing and deployment
**Blue-Green Deployment**: Zero-downtime deployments
**Rollback Plan**: Quick rollback capability for issues
**Monitoring**: Health checks and alerting systems
**Documentation**: Deployment guides and runbooks`
  }

  private static generateCodeQualityStandards(context: ProjectContext): string {
    return `**Code Style**: Consistent formatting with Prettier and ESLint
**Testing Coverage**: Minimum 80% test coverage requirement
**Code Reviews**: Mandatory peer review for all changes
**Documentation**: Clear code comments and README files
**Static Analysis**: Automated code quality checks
**Performance Monitoring**: Regular performance profiling`
  }

  private static generateMonitoringStrategy(context: ProjectContext): string {
    return `**Application Monitoring**: Error tracking and performance metrics
**Infrastructure Monitoring**: Server and database health checks
**User Analytics**: Usage patterns and user behavior tracking
**Alerting**: Automated alerts for critical issues
**Logging**: Centralized logging with structured format
**Dashboards**: Real-time monitoring dashboards`
  }

  private static generateBackupStrategy(context: ProjectContext): string {
    return `**Database Backups**: Daily automated backups with retention policy
**Code Repository**: Git-based version control with cloud backup
**Configuration Backup**: Infrastructure as code with version control
**File Storage**: Regular backup of uploaded files and assets
**Recovery Testing**: Regular backup restoration testing
**Disaster Recovery**: Documented disaster recovery procedures`
  }
}