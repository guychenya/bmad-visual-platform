# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BMad-Method is a Universal AI Agent Framework that transforms domains through specialized AI expertise. It provides agentic modes, tasks, and templates for repeatable workflows in agile development and various other domains through expansion packs.

## Core Architecture

The project centers around the `bmad-core/` directory containing:
- `agents/` - AI agent definitions (analyst, architect, dev, qa, etc.)
- `agent-teams/` - Team configurations combining multiple agents
- `workflows/` - Predefined workflow definitions for different project types
- `templates/` - Output templates for documents and stories
- `tasks/` - Specific task definitions for agents
- `checklists/` - Quality assurance checklists
- `data/` - Knowledge base files and reference materials

## Development Commands

### Building and Installation
```bash
# Build all bundles (agents, teams, expansion packs)
npm run build

# Build only agent bundles
npm run build:agents

# Build only team bundles  
npm run build:teams

# Install BMad to a project
npm run install:bmad
```

### Version Management
```bash
# Bump patch version
npm run version:patch

# Bump minor version
npm run version:minor

# Bump major version
npm run version:major

# Update core version specifically
npm run version:core
```

### Development Tools
```bash
# Format markdown files
npm run format

# Validate configuration
npm run validate

# List available agents
npm run list:agents
```

## Key Components

### CLI Tool (`tools/cli.js`)
Main entry point for build operations and project management. Handles:
- Building web bundles for agents and teams
- Version management
- Project validation
- Installation workflows

### Web Builder (`tools/builders/web-builder.js`)
Processes agent and team configurations into web-compatible bundles by:
- Resolving dependencies between agents, tasks, and templates
- Generating combined markdown files for web agents
- Creating distribution packages

### Installer (`tools/installer/`)
Handles project installation and configuration:
- Detects existing installations
- Manages upgrades and expansion packs
- Configures IDE integrations
- Maintains project-specific settings

### Core Configuration (`bmad-core/core-config.yaml`)
Central configuration file defining:
- Version information
- Document locations and patterns
- Workflow settings
- Development file paths

## Agent System

Agents are markdown files with embedded YAML configuration that define:
- Persona and role
- Specialized capabilities
- Dependencies (tasks, templates, checklists)
- Interaction patterns

Key agents include:
- `bmad-orchestrator` - Master coordinator for workflow management
- `analyst` - Requirements analysis and project brief creation
- `architect` - System architecture and technical design
- `dev` - Development implementation
- `qa` - Quality assurance and testing
- `sm` - Scrum Master for story management

## Workflow Types

### Greenfield Projects
- Full project creation from scratch
- Complete planning and architecture phases
- Structured development cycles

### Brownfield Projects  
- Enhancement of existing applications
- Legacy system analysis and integration
- Safe modification workflows

## Template System

Templates use YAML configuration with embedded variables:
- `{{variable}}` syntax for dynamic content
- Output format specification
- Workflow mode definitions
- Agent configuration sections

## Development Guidelines

### File Structure
- All agent files use `.md` extension with embedded YAML
- Configuration files use `.yaml` extension
- Templates follow naming pattern `*-tmpl.yaml`
- Stories generated to `docs/stories/` directory

### Build Process
The build system processes core files and expansion packs to create:
- Web bundles for browser-based agents
- Distribution packages for NPM
- IDE integration files

### Testing
- Validate configurations with `npm run validate`
- Test builds with `npm run build`
- Use expansion packs for domain-specific testing

## Expansion Packs

Located in `expansion-packs/` directory, these extend BMad to specialized domains:
- Game development (`bmad-2d-phaser-game-dev/`)
- Infrastructure/DevOps (`bmad-infrastructure-devops/`)
- Creator tools (`bmad-creator-tools/`)

Each expansion pack contains its own agents, workflows, and templates following the same structure as the core system.