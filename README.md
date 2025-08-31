# Rails-React-Docker-Devise

A modern full-stack web application built with Ruby on Rails API backend, React frontend, and PostgreSQL database, all orchestrated with Docker for seamless development and deployment.

## 🚀 Quick Start

```bash
# Clone the repository
git clone <repository-url>
cd Rails-React-Docker-Devise

# Start all services with Docker Compose
docker compose -f dockerfiles/docker-compose.yml up --build

# Access the applications
# Frontend: http://localhost:3001
# Backend API: http://localhost:3000
# Database: localhost:5432
```

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Documentation](#-documentation)
- [Development](#-development)
- [API Reference](#-api-reference)
- [Authentication](#-authentication)
- [Docker Services](#-docker-services)
- [Environment Setup](#-environment-setup)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🔐 Authentication & Security
- **JWT-based Authentication** with Devise and Devise-JWT
- **Secure User Registration** with email validation
- **Session Persistence** across browser refreshes
- **CORS Configuration** for cross-origin requests
- **CSRF Protection** configured for API endpoints

### 🎨 User Interface
- **Modern React Frontend** with responsive design
- **Navigation System** with user dropdown menu
- **Authentication Forms** with error handling
- **Home Dashboard** with personalized welcome messages
- **Component-based Architecture** for maintainability

### 🐳 Development Experience
- **Docker Compose** orchestration for all services
- **Hot Reloading** for both frontend and backend
- **Database Persistence** with Docker volumes
- **Organized Code Structure** with clear separation of concerns
- **Comprehensive Documentation** for easy onboarding

## 🛠️ Technology Stack

### Frontend
- **React 19.1.1** - Modern UI library
- **Create React App** - Build tooling and development server
- **CSS3** - Styling with modular stylesheets
- **Fetch API** - HTTP client for API communication

### Backend
- **Ruby on Rails 7.1.5.2** - API framework
- **Ruby 3.2.2** - Programming language
- **Devise 4.9.4** - Authentication solution
- **Devise-JWT** - JWT token management
- **Puma** - Web server

### Database & DevOps
- **PostgreSQL 15** - Primary database
- **Docker & Docker Compose** - Containerization
- **Webpack Dev Server** - Frontend development server

## 📁 Project Structure

```
Rails-React-Docker-Devise/
├── 📚 docs/                          # Documentation
│   └── ARCHITECTURE_README.md        # Detailed architecture guide
├── 🐳 dockerfiles/                   # Docker configuration
│   └── docker-compose.yml           # Multi-service orchestration
├── 📝 logs/                          # Application logs
├── 💻 src/                           # Source code
│   ├── 🚀 backend/                   # Rails API backend
│   │   ├── app/                      # Application code
│   │   ├── config/                   # Configuration files
│   │   ├── db/                       # Database files
│   │   ├── Dockerfile.dev            # Development Docker image
│   │   ├── Gemfile                   # Ruby dependencies
│   │   └── wait-for-postgres.sh      # Database readiness script
│   └── ⚛️ frontend/                  # React frontend
│       ├── public/                   # Static assets
│       ├── src/                      # Source code
│       │   ├── components/           # Reusable UI components
│       │   ├── pages/               # Page-level components
│       │   └── README.md            # Frontend documentation
│       ├── Dockerfile               # Production Docker image
│       └── package.json             # Node dependencies
└── 📖 README.md                     # This file
```

## 📚 Documentation

| Document | Description | Link |
|----------|-------------|------|
| **Architecture Guide** | Comprehensive system architecture and design decisions | [docs/ARCHITECTURE_README.md](docs/ARCHITECTURE_README.md) |
| **Frontend Guide** | React component structure and organization | [src/frontend/src/README.md](src/frontend/src/README.md) |
| **API Documentation** | Backend API endpoints and usage | [Backend README](src/backend/README.md) |

## 💻 Development

### Prerequisites
- **Docker** and **Docker Compose** installed
- **Git** for version control
- Code editor of choice (VS Code recommended)

### Local Development Setup

1. **Clone and Navigate**
   ```bash
   git clone <repository-url>
   cd Rails-React-Docker-Devise
   ```

2. **Start Development Environment**
   ```bash
   docker compose -f dockerfiles/docker-compose.yml up --build
   ```

3. **Access Applications**
   - Frontend: http://localhost:3001
   - Backend API: http://localhost:3000
   - Database: localhost:5432

### Development Workflow

- **Frontend Changes**: Automatically reloaded via Webpack dev server
- **Backend Changes**: Rails auto-reloading in development mode
- **Database Changes**: Run migrations inside backend container
- **Logs**: View with `docker compose logs <service-name>`

## 🔌 API Reference

### Authentication Endpoints

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `POST` | `/users` | User registration | `{ user: { email, password } }` |
| `POST` | `/users/sign_in` | User login | `{ user: { email, password } }` |
| `DELETE` | `/users/sign_out` | User logout | - |

### Response Format
```json
{
  "email": "user@example.com",
  "created_at": "2025-08-30T12:00:00.000Z"
}
```

### Headers
- **Authorization**: `Bearer <jwt-token>` (for authenticated requests)
- **Content-Type**: `application/json`

## 🔐 Authentication

### JWT Token Flow
1. User submits credentials to `/users/sign_in`
2. Backend validates and returns JWT in `Authorization` header
3. Frontend stores token in localStorage
4. Token included in subsequent API requests
5. User remains logged in across browser sessions

### Security Features
- Password encryption with bcrypt
- JWT token expiration and rotation
- CORS protection for cross-origin requests
- CSRF protection for non-JSON requests

## 🐳 Docker Services

### Service Configuration

| Service | Port | Description | Dependencies |
|---------|------|-------------|--------------|
| **frontend** | 3001 | React development server | - |
| **backend** | 3000 | Rails API server | database |
| **db** | 5432 | PostgreSQL database | - |

### Docker Commands

```bash
# Start all services
docker compose -f dockerfiles/docker-compose.yml up

# Start in background
docker compose -f dockerfiles/docker-compose.yml up -d

# Stop services
docker compose -f dockerfiles/docker-compose.yml down

# Rebuild and start
docker compose -f dockerfiles/docker-compose.yml up --build

# View logs
docker compose -f dockerfiles/docker-compose.yml logs <service>

# Execute commands in containers
docker compose -f dockerfiles/docker-compose.yml exec backend bundle exec rails c
docker compose -f dockerfiles/docker-compose.yml exec frontend npm run test
```

## 🌍 Environment Setup

### Required Environment Variables

#### Backend (.env or docker-compose.yml)
```bash
RAILS_ENV=development
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=db
```

#### Frontend
```bash
CHOKIDAR_USEPOLLING=true
WDS_SOCKET_HOST=localhost
WDS_SOCKET_PORT=3001
```

### Database Configuration
- **Development**: PostgreSQL in Docker container
- **Production**: Configure external PostgreSQL service
- **Migrations**: `docker compose exec backend bundle exec rails db:migrate`

## 🧪 Testing

### Backend Testing
```bash
# Run Rails tests
docker compose exec backend bundle exec rspec

# Run specific test file
docker compose exec backend bundle exec rspec spec/models/user_spec.rb

# Generate test coverage
docker compose exec backend bundle exec rspec --format documentation
```

### Frontend Testing
```bash
# Run React tests
docker compose exec frontend npm test

# Run tests in CI mode
docker compose exec frontend npm test -- --coverage --ci

# Update snapshots
docker compose exec frontend npm test -- --updateSnapshot
```

## 🤝 Contributing

### Development Guidelines

1. **Branch Strategy**: Feature branches off `main`
2. **Code Style**: Follow Rails and React conventions
3. **Testing**: Write tests for new features
4. **Documentation**: Update relevant README files
5. **Pull Requests**: Use descriptive titles and descriptions

### Code Standards

- **Backend**: Follow Rails conventions and RuboCop rules
- **Frontend**: Use React best practices and ESLint rules
- **Git**: Conventional commit messages
- **Docker**: Optimize Dockerfile layers for caching

### Getting Started Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit changes: `git commit -m 'Add amazing feature'`
5. Push to branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📊 Monitoring & Debugging

### Log Access
```bash
# All service logs
docker compose -f dockerfiles/docker-compose.yml logs

# Specific service logs
docker compose -f dockerfiles/docker-compose.yml logs backend
docker compose -f dockerfiles/docker-compose.yml logs frontend

# Follow logs in real-time
docker compose -f dockerfiles/docker-compose.yml logs -f backend
```

### Database Access
```bash
# Connect to PostgreSQL
docker compose -f dockerfiles/docker-compose.yml exec db psql -U postgres -d backend_development

# Rails console
docker compose -f dockerfiles/docker-compose.yml exec backend bundle exec rails console
```

## 🚀 Deployment

### Production Considerations
- Use environment variables for all configuration
- Set up SSL/TLS certificates
- Configure production database
- Set up monitoring and logging
- Use Docker Swarm or Kubernetes for orchestration

### Environment-Specific Configurations
- **Development**: Hot reloading, debug mode, local database
- **Staging**: Production-like setup with test data
- **Production**: Optimized builds, external services, monitoring

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Ruby on Rails** community for excellent framework and documentation
- **React** team for powerful frontend library
- **Devise** gem maintainers for authentication solution
- **Docker** for containerization platform

---

## 📞 Support

For questions, issues, or contributions:

1. **Issues**: Open a GitHub issue for bugs or feature requests
2. **Discussions**: Use GitHub Discussions for questions
3. **Documentation**: Check the [Architecture Guide](docs/ARCHITECTURE_README.md) for detailed information

---

**Happy Coding!** 🎉
