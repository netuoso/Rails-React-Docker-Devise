# Rails-React-Docker-Devise Architecture

This document provides a comprehensive overview of the application architecture, codebase structure, and design decisions.

## 🏗️ High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   React Frontend│◄──►│   Rails Backend │◄──►│   PostgreSQL    │
│   (Port 3001)   │    │   (Port 3000)   │    │   Database      │
│                 │    │                 │    │   (Port 5432)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         │                        │                        │
    ┌────▼────┐              ┌────▼────┐              ┌────▼────┐
    │ Docker  │              │ Docker  │              │ Docker  │
    │Container│              │Container│              │Container│
    └─────────┘              └─────────┘              └─────────┘
```

## 📁 Project Structure

```
Rails-React-Docker-Devise/
├── docs/                           # Documentation
│   └── ARCHITECTURE_README.md     # This file
├── dockerfiles/                   # Docker orchestration
│   └── docker-compose.yml        # Multi-service setup
├── logs/                          # Application logs
├── src/                           # Source code
│   ├── backend/                   # Rails API backend
│   └── frontend/                  # React frontend
└── README.md                      # Project overview
```

## 🚀 Technology Stack

### Frontend (React)
- **Framework**: React 19.1.1
- **Build Tool**: Create React App (react-scripts 5.0.1)
- **Styling**: CSS3 with modular stylesheets
- **Authentication**: JWT token storage in localStorage
- **HTTP Client**: Fetch API
- **Hot Reloading**: Webpack Dev Server

### Backend (Rails)
- **Framework**: Ruby on Rails 7.1.5.2
- **Language**: Ruby 3.2.2
- **Authentication**: Devise 4.9.4 + Devise-JWT
- **CORS**: rack-cors 3.0.0
- **Web Server**: Puma 6.6.1
- **Database ORM**: ActiveRecord

### Database
- **Database**: PostgreSQL 15
- **Connection**: Database environment variables
- **Migrations**: Rails ActiveRecord migrations

### DevOps
- **Containerization**: Docker & Docker Compose
- **Development**: Hot reloading for both frontend and backend
- **Database Persistence**: Docker volumes
- **Networking**: Custom Docker network

## 🏛️ Backend Architecture

### Directory Structure
```
src/backend/
├── app/
│   ├── controllers/
│   │   ├── application_controller.rb      # Base controller with CSRF config
│   │   └── users/                         # Custom Devise controllers
│   │       ├── registrations_controller.rb
│   │       └── sessions_controller.rb
│   ├── models/
│   │   └── user.rb                        # User model with JWT auth
│   └── [standard Rails directories]
├── config/
│   ├── application.rb                     # Rails app configuration
│   ├── database.yml                       # Database configuration
│   ├── routes.rb                          # API routes
│   └── initializers/
│       ├── cors.rb                        # CORS configuration
│       └── devise.rb                      # Devise + JWT configuration
├── db/
│   ├── migrate/                           # Database migrations
│   └── seeds.rb                           # Seed data
├── Dockerfile.dev                         # Development Docker image
├── Gemfile                                # Ruby dependencies
└── wait-for-postgres.sh                   # Database readiness script
```

### Key Design Decisions

#### Authentication Strategy
- **JWT (JSON Web Tokens)** for stateless authentication
- **Custom Devise Controllers** for JSON API responses
- **CSRF Protection** disabled for JSON requests
- **Token Storage** in Authorization headers

#### API Design
- **RESTful endpoints** following Rails conventions
- **JSON-only responses** with proper HTTP status codes
- **CORS enabled** for cross-origin requests from frontend
- **Error handling** with structured JSON responses

#### Database Configuration
- **Environment-based** configuration for Docker
- **Connection pooling** through Rails defaults
- **Migration-based** schema management

## 🎨 Frontend Architecture

### Directory Structure
```
src/frontend/src/
├── components/                    # Reusable UI components
│   ├── Navbar.js                 # Navigation component
│   ├── Navbar.css               # Navbar styles
│   └── index.js                 # Component exports
├── pages/                        # Page-level components
│   ├── Home.js                  # Home page
│   ├── Home.css                # Home styles
│   ├── Login.js                # Login page
│   ├── Register.js             # Registration page
│   └── index.js                # Page exports
├── App.js                       # Root component
├── App.css                      # Global styles
├── index.js                     # Application entry point
└── README.md                    # Frontend documentation
```

### Component Architecture

#### Separation of Concerns
- **Pages**: Full-screen components representing routes
- **Components**: Reusable UI elements
- **Styles**: Co-located CSS files with components

#### State Management
- **Local State**: React useState hooks
- **Authentication State**: Shared across components via props
- **Persistence**: localStorage for JWT tokens and user data

#### Navigation System
- **Conditional Rendering** based on authentication state
- **Dropdown Menus** for user actions
- **Clean Routing** through state-based page switching

## 🐳 Docker Architecture

### Service Configuration

#### Frontend Service
```yaml
frontend:
  build: ../src/frontend
  ports: ["3001:3000"]
  volumes: [../src/frontend:/app, /app/node_modules]
  environment:
    - CHOKIDAR_USEPOLLING=true
    - WDS_SOCKET_HOST=localhost
    - WDS_SOCKET_PORT=3001
```

#### Backend Service
```yaml
backend:
  build: ../src/backend (Dockerfile.dev)
  ports: ["3000:3000"]
  depends_on: [db]
  command: [wait-for-postgres.sh, rails server]
  environment: [POSTGRES_*, RAILS_ENV=development]
```

#### Database Service
```yaml
db:
  image: postgres:15
  ports: ["5432:5432"]
  volumes: [postgres_data:/var/lib/postgresql/data]
  environment: [POSTGRES_*]
```

### Network Architecture
- **Custom Bridge Network**: All services communicate internally
- **Port Mapping**: External access to frontend (3001) and backend (3000)
- **Volume Mounting**: Source code for hot reloading
- **Data Persistence**: PostgreSQL data survives container restarts

## 🔐 Authentication Flow

### Registration Process
```
1. User submits registration form
2. React sends POST /users with credentials
3. Rails validates and creates user
4. Devise-JWT generates token
5. Token returned in Authorization header
6. React stores token and email in localStorage
7. User redirected to authenticated state
```

### Login Process
```
1. User submits login form
2. React sends POST /users/sign_in
3. Rails validates credentials
4. Devise-JWT generates token
5. Token returned in Authorization header
6. React stores token and email in localStorage
7. User redirected to authenticated state
```

### Session Persistence
```
1. On app load, React checks localStorage
2. If token exists, user is automatically authenticated
3. Token included in future API requests
4. Logout clears localStorage and resets state
```

## 🔧 Development Workflow

### Getting Started
```bash
# Start all services
docker compose -f dockerfiles/docker-compose.yml up

# Access applications
Frontend: http://localhost:3001
Backend: http://localhost:3000
Database: localhost:5432
```

### Hot Reloading
- **Frontend**: Webpack dev server with live reload
- **Backend**: Rails auto-reloading in development
- **Database**: Persistent data across restarts

### Debugging
- **Frontend**: Browser dev tools + React dev tools
- **Backend**: Rails logs in Docker container
- **Database**: Direct PostgreSQL connection available

## 🚦 API Endpoints

### Authentication
- `POST /users` - User registration
- `POST /users/sign_in` - User login
- `DELETE /users/sign_out` - User logout (if implemented)

### CORS Configuration
```ruby
# config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins 'http://localhost:3001'
    resource '*', 
      headers: :any, 
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true
  end
end
```

## 📊 Data Models

### User Model
```ruby
class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist
  
  # Fields: email, encrypted_password, created_at, updated_at
end
```

## 🔒 Security Considerations

### Backend Security
- **CSRF Protection**: Disabled for JSON API requests
- **JWT Tokens**: Stateless authentication with expiration
- **CORS Policy**: Restricted to frontend origin
- **Password Encryption**: Devise bcrypt hashing

### Frontend Security
- **Token Storage**: localStorage (consider httpOnly cookies for production)
- **XSS Protection**: React's built-in XSS protection
- **Input Validation**: Client-side validation + server-side validation

## 🚀 Deployment Considerations

### Production Readiness
- **Environment Variables**: Externalize all configuration
- **Database**: Use managed PostgreSQL service
- **SSL/TLS**: Implement HTTPS for both frontend and backend
- **CDN**: Consider CDN for static assets
- **Monitoring**: Add application monitoring and logging

### Scaling Strategies
- **Horizontal Scaling**: Load balancer + multiple backend instances
- **Database**: Read replicas for read-heavy workloads
- **Caching**: Redis for session storage and caching
- **Asset Pipeline**: Separate asset serving from application servers

## 📝 Code Quality Standards

### Backend Standards
- **REST Conventions**: Follow Rails RESTful routing
- **Error Handling**: Consistent JSON error responses
- **Testing**: RSpec for comprehensive test coverage
- **Code Style**: RuboCop for consistent formatting

### Frontend Standards
- **Component Design**: Single responsibility principle
- **File Organization**: Co-located styles and components
- **Error Boundaries**: Graceful error handling
- **Testing**: Jest + React Testing Library

## 🔄 Future Enhancements

### Potential Features
- **User Profiles**: Extended user data and preferences
- **Email Verification**: Email confirmation for registration
- **Password Reset**: Forgot password functionality
- **Admin Panel**: Administrative interface
- **API Versioning**: Versioned API endpoints

### Technical Improvements
- **State Management**: Redux/Zustand for complex state
- **Routing**: React Router for client-side routing
- **TypeScript**: Type safety for frontend code
- **GraphQL**: More efficient data fetching
- **Microservices**: Service decomposition for scale

This architecture provides a solid foundation for a modern, scalable web application with clear separation of concerns and industry best practices.
