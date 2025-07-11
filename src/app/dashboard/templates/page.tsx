'use client'

import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Plus, Template, Code, Palette, Database, Globe, Smartphone, Server, Download, Eye } from 'lucide-react'
import { useState } from 'react'

export default function TemplatesPage() {
  const [templates] = useState([
    {
      id: 1,
      name: 'React SaaS Starter',
      description: 'Complete SaaS application with authentication, payments, and dashboard',
      category: 'Web App',
      icon: Code,
      color: 'from-blue-500 to-cyan-500',
      tags: ['React', 'NextJS', 'TypeScript', 'Tailwind'],
      downloads: 1284,
      preview: '/templates/react-saas.png'
    },
    {
      id: 2,
      name: 'E-commerce Platform',
      description: 'Full-featured online store with cart, checkout, and inventory management',
      category: 'E-commerce',
      icon: Globe,
      color: 'from-green-500 to-emerald-500',
      tags: ['React', 'Stripe', 'MongoDB', 'Express'],
      downloads: 2156,
      preview: '/templates/ecommerce.png'
    },
    {
      id: 3,
      name: 'Mobile App Starter',
      description: 'Cross-platform mobile app with navigation and state management',
      category: 'Mobile',
      icon: Smartphone,
      color: 'from-purple-500 to-pink-500',
      tags: ['React Native', 'Expo', 'Redux', 'Firebase'],
      downloads: 892,
      preview: '/templates/mobile-app.png'
    },
    {
      id: 4,
      name: 'API Backend',
      description: 'RESTful API with authentication, database, and documentation',
      category: 'Backend',
      icon: Server,
      color: 'from-orange-500 to-red-500',
      tags: ['Node.js', 'Express', 'MongoDB', 'JWT'],
      downloads: 1567,
      preview: '/templates/api-backend.png'
    },
    {
      id: 5,
      name: 'Dashboard Template',
      description: 'Modern admin dashboard with charts, tables, and analytics',
      category: 'Dashboard',
      icon: Template,
      color: 'from-indigo-500 to-purple-500',
      tags: ['React', 'Chart.js', 'Material-UI', 'Redux'],
      downloads: 3421,
      preview: '/templates/dashboard.png'
    },
    {
      id: 6,
      name: 'Portfolio Website',
      description: 'Beautiful portfolio site with animations and contact form',
      category: 'Portfolio',
      icon: Palette,
      color: 'from-pink-500 to-rose-500',
      tags: ['NextJS', 'Framer Motion', 'Tailwind', 'Vercel'],
      downloads: 756,
      preview: '/templates/portfolio.png'
    },
    {
      id: 7,
      name: 'Blog Platform',
      description: 'Content management system with markdown support and SEO',
      category: 'Content',
      icon: Database,
      color: 'from-teal-500 to-blue-500',
      tags: ['NextJS', 'MDX', 'Prisma', 'PostgreSQL'],
      downloads: 1089,
      preview: '/templates/blog.png'
    },
    {
      id: 8,
      name: 'Landing Page',
      description: 'High-converting landing page with modern design and animations',
      category: 'Marketing',
      icon: Globe,
      color: 'from-yellow-500 to-orange-500',
      tags: ['React', 'Tailwind', 'Framer Motion', 'Vercel'],
      downloads: 2834,
      preview: '/templates/landing.png'
    }
  ])

  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  const categories = ['All', 'Web App', 'E-commerce', 'Mobile', 'Backend', 'Dashboard', 'Portfolio', 'Content', 'Marketing']

  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Templates</h1>
          <p className="text-slate-300 text-lg">
            Jumpstart your projects with pre-built templates
          </p>
        </div>
        <Button className="gradient-button hover:scale-105 transition-transform">
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category ? "gradient-button" : "glass-button"}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredTemplates.map((template, index) => (
          <Card 
            key={template.id} 
            className="agent-card group cursor-pointer animate-slide-up"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => setSelectedTemplate(template)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 bg-gradient-to-r ${template.color} rounded-xl group-hover:scale-110 transition-transform`}>
                  <template.icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-xs bg-white/10 text-slate-300 px-2 py-1 rounded-full">
                  {template.category}
                </span>
              </div>
              <CardTitle className="text-lg text-white">{template.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-400 mb-4 text-sm">{template.description}</p>
              <div className="flex flex-wrap gap-1 mb-4">
                {template.tags.slice(0, 2).map((tag, idx) => (
                  <span key={idx} className="text-xs bg-white/10 text-slate-300 px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
                {template.tags.length > 2 && (
                  <span className="text-xs bg-white/10 text-slate-300 px-2 py-1 rounded-full">
                    +{template.tags.length - 2}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                <span>{template.downloads} downloads</span>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1 glass-button">
                  <Download className="h-4 w-4 mr-1" />
                  Use
                </Button>
                <Button variant="outline" size="sm" className="glass-button">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setSelectedTemplate(null)}>
          <Card className="glass-card max-w-4xl w-full mx-4 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-4 bg-gradient-to-r ${selectedTemplate.color} rounded-xl`}>
                    <selectedTemplate.icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl text-white">{selectedTemplate.name}</CardTitle>
                    <p className="text-slate-400">{selectedTemplate.description}</p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setSelectedTemplate(null)} className="glass-button">
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.tags.map((tag, idx) => (
                      <span key={idx} className="bg-white/10 text-slate-300 px-3 py-1 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold gradient-text">{selectedTemplate.downloads}</div>
                      <div className="text-slate-400 text-sm">Downloads</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold gradient-text">{selectedTemplate.category}</div>
                      <div className="text-slate-400 text-sm">Category</div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Button className="gradient-button flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Use This Template
                  </Button>
                  <Button variant="outline" className="glass-button">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}