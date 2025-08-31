# Rails Backend API

A Ruby on Rails 7.1.5.2 API backend providing authentication services with JWT tokens, built with Devise and PostgreSQL integration.

## 🚀 Quick Start

```bash
# Navigate to backend directory
cd src/backend

# Install dependencies
bundle install

# Setup database
bundle exec rails db:create db:migrate

# Start the server
bundle exec rails server -b 0.0.0.0 -p 3000

# Or using Docker
docker compose -f ../../dockerfiles/docker-compose.yml up backend
```

## 📋 Table of Contents

- [Technology Stack](#-technology-stack)
- [Dependencies](#-dependencies)
- [API Routes](#-api-routes)
- [Authentication](#-authentication)
- [Database Schema](#-database-schema)
- [Background Jobs](#-background-jobs)
- [Configuration](#-configuration)
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)

## 🛠️ Technology Stack

- **Framework**: Ruby on Rails 7.1.5.2
- **Language**: Ruby 3.2.2
- **Database**: PostgreSQL 15
- **Authentication**: Devise 4.9.4 + Devise-JWT
- **Background Jobs**: Redis + Sidekiq 8.0.7
- **CORS**: rack-cors 3.0.0
- **Web Server**: Puma 6.6.1

## 📦 Dependencies

### Core Dependencies (Gemfile)

```ruby
# Framework
gem 'rails', '~> 7.1.5'

# Database
gem 'pg', '~> 1.1'

# Authentication
gem 'devise', '~> 4.9'
gem 'devise-jwt', '~> 0.11.0'

# Background Jobs
gem 'redis', '>= 4.0.1'
gem 'sidekiq', '~> 8.0'

# CORS handling
gem 'rack-cors', '~> 3.0'

# Web server
gem 'puma', '~> 6.6'

# Bootsnap for faster boot times
gem 'bootsnap', '>= 1.4.4', require: false

# Development/Test
group :development, :test do
  gem 'debug', platforms: %i[ mri mingw x64_mingw ]
end

group :development do
  gem 'web-console', '>= 4.1.0'
  gem 'listen', '~> 3.3'
  gem 'spring'
end
```

### Key Gem Features

| Gem | Version | Purpose |
|-----|---------|---------|
| **devise** | 4.9.4 | User authentication framework |
| **devise-jwt** | 0.11.0 | JWT token management for API authentication |
| **redis** | >= 4.0.1 | Redis client for background jobs and caching |
| **sidekiq** | ~8.0 | Background job processing framework |
| **rack-cors** | 3.0.0 | Cross-Origin Resource Sharing (CORS) support |
| **pg** | ~1.1 | PostgreSQL database adapter |
| **puma** | 6.6.1 | Multi-threaded HTTP server |

## 🛣️ API Routes

### Authentication Routes

```ruby
# config/routes.rb
Rails.application.routes.draw do
  devise_for :users, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations'
  }
  
  # Sidekiq Web Dashboard - Admin only access
  authenticate :user, ->(user) { user.admin? } do
    mount Sidekiq::Web => '/admin/sidekiq'
  end
  
  # Health check
  get "up" => "rails/health#show", as: :rails_health_check
end
```

### Available Endpoints

| Method | Endpoint | Controller Action | Description | Auth Required |
|--------|----------|-------------------|-------------|---------------|
| `POST` | `/users` | `registrations#create` | User registration | No |
| `POST` | `/users/sign_in` | `sessions#create` | User login | No |
| `DELETE` | `/users/sign_out` | `sessions#destroy` | User logout | Yes |
| `PUT` | `/users` | `registrations#update` | Update user account | Yes |
| `DELETE` | `/users` | `registrations#destroy` | Delete user account | Yes |
| `GET` | `/admin/sidekiq` | `sidekiq/web` | Background jobs dashboard | Admin only |
| `GET` | `/up` | `rails/health#show` | Health check | No |

### Request/Response Examples

#### User Registration
```bash
# Request
POST /users
Content-Type: application/json

{
  "user": {
    "email": "user@example.com",
    "password": "securepassword"
  }
}

# Response (201 Created)
{
  "email": "user@example.com",
  "created_at": "2025-08-30T12:00:00.000Z"
}

# Headers
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

#### User Login
```bash
# Request
POST /users/sign_in
Content-Type: application/json

{
  "user": {
    "email": "user@example.com",
    "password": "securepassword"
  }
}

# Response (201 Created)
{
  "email": "user@example.com"
}

# Headers
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

#### User Logout
```bash
# Request
DELETE /users/sign_out
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...

# Response (204 No Content)
```

## 🔐 Authentication

### JWT Configuration

The application uses **Devise-JWT** for stateless authentication with JSON Web Tokens.

#### JWT Settings (`config/initializers/devise.rb`)
```ruby
Devise.setup do |config|
  config.jwt do |jwt|
    jwt.secret = Rails.application.credentials.devise_jwt_secret_key
    jwt.dispatch_requests = [
      ['POST', %r{^/users/sign_in$}],
      ['POST', %r{^/users$}]
    ]
    jwt.revocation_requests = [
      ['DELETE', %r{^/users/sign_out$}]
    ]
    jwt.expiration_time = 1.day.to_i
  end
end
```

### Custom Controllers

#### Users::RegistrationsController
```ruby
class Users::RegistrationsController < Devise::RegistrationsController
  respond_to :json
  
  # Handles user registration with JSON responses
  # Automatically generates JWT token on successful registration
end
```

#### Users::SessionsController
```ruby
class Users::SessionsController < Devise::SessionsController
  respond_to :json
  
  # Handles user login/logout with JSON responses
  # Manages JWT token lifecycle
end
```

### CSRF Protection

CSRF protection is configured to allow JSON API requests:

```ruby
# app/controllers/application_controller.rb
class ApplicationController < ActionController::Base
  # Skip CSRF protection for JSON requests (API)
  protect_from_forgery with: :null_session, if: -> { request.format.json? }
end
```

## 🗄️ Database Schema

### User Model

```ruby
# app/models/user.rb
class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist
end
```

### Database Tables

#### users
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | bigint | PRIMARY KEY | Unique user identifier |
| `email` | string | NOT NULL, UNIQUE | User email address |
| `encrypted_password` | string | NOT NULL | Encrypted password |
| `reset_password_token` | string | UNIQUE | Password reset token |
| `reset_password_sent_at` | datetime | | Password reset timestamp |
| `remember_created_at` | datetime | | Remember me timestamp |
| `created_at` | datetime | NOT NULL | Record creation time |
| `updated_at` | datetime | NOT NULL | Record update time |

#### jwt_denylist (for token revocation)
| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | bigint | PRIMARY KEY | Unique identifier |
| `jti` | string | NOT NULL, UNIQUE | JWT identifier |
| `exp` | datetime | NOT NULL | Token expiration time |

## 📋 Background Jobs

The application uses **Redis** and **Sidekiq** for background job processing, providing robust asynchronous task execution.

### Overview

- **Redis**: Message broker and data store for job queues
- **Sidekiq**: Multi-threaded background job processor
- **Admin Dashboard**: Web interface for monitoring jobs (admin-only access)

### Configuration

#### Sidekiq Configuration (`config/initializers/sidekiq.rb`)
```ruby
require 'sidekiq'
require 'sidekiq/web'

# Configure Sidekiq connections
Sidekiq.configure_server do |config|
  config.redis = { url: ENV.fetch('REDIS_URL', 'redis://redis:6379/0') }
end

Sidekiq.configure_client do |config|
  config.redis = { url: ENV.fetch('REDIS_URL', 'redis://redis:6379/0') }
end
```

#### Application Configuration (`config/application.rb`)
```ruby
module Backend
  class Application < Rails::Application
    # Use Sidekiq for background jobs
    config.active_job.queue_adapter = :sidekiq
  end
end
```

### Jobs

#### WelcomeEmailJob Example
```ruby
# app/jobs/welcome_email_job.rb
class WelcomeEmailJob < ApplicationJob
  queue_as :default

  def perform(user_id)
    user = User.find(user_id)
    # Send welcome email logic here
    Rails.logger.info "Sending welcome email to #{user.email}"
    
    # Simulate some work
    sleep(2)
    
    Rails.logger.info "Welcome email sent to #{user.email}"
  rescue ActiveRecord::RecordNotFound
    Rails.logger.error "User with ID #{user_id} not found"
  end
end
```

### Usage Examples

#### Enqueueing Jobs
```ruby
# Enqueue job immediately
WelcomeEmailJob.perform_later(user.id)

# Enqueue job with delay
WelcomeEmailJob.set(wait: 5.minutes).perform_later(user.id)

# Enqueue job at specific time
WelcomeEmailJob.set(wait_until: Date.tomorrow.noon).perform_later(user.id)

# Enqueue job with priority
WelcomeEmailJob.set(priority: 10).perform_later(user.id)
```

#### Integration in Controllers
```ruby
# app/controllers/users/registrations_controller.rb
class Users::RegistrationsController < Devise::RegistrationsController
  def create
    super do |resource|
      if resource.persisted?
        # Enqueue welcome email job after successful registration
        WelcomeEmailJob.perform_later(resource.id)
      end
    end
  end
end
```

### Admin Dashboard

#### Access Control
The Sidekiq web dashboard is restricted to admin users only:

```ruby
# config/routes.rb
authenticate :user, ->(user) { user.admin? } do
  mount Sidekiq::Web => '/admin/sidekiq'
end
```

#### Admin User Setup
```bash
# Create admin user via Rails console
docker compose exec backend bundle exec rails console

# In console:
user = User.find_by(email: 'admin@example.com')
user.update!(admin: true)

# Or use rake task:
docker compose exec backend bundle exec rake admin:make_admin[admin@example.com]
```

#### Dashboard Features
- **Queue Monitoring**: View active, pending, and failed jobs
- **Job Details**: Inspect job arguments, execution time, and errors
- **Retry Management**: Manually retry failed jobs
- **Performance Metrics**: Job processing statistics and trends
- **Worker Information**: Active Sidekiq processes and thread usage

### Monitoring & Management

#### Docker Services
```bash
# View Sidekiq logs
docker compose logs sidekiq

# Restart Sidekiq service
docker compose restart sidekiq

# Scale Sidekiq workers
docker compose up --scale sidekiq=3
```

#### Job Management
```bash
# Clear all jobs
docker compose exec backend bundle exec rails runner "Sidekiq::Queue.new.clear"

# Clear failed jobs
docker compose exec backend bundle exec rails runner "Sidekiq::RetrySet.new.clear"

# View queue stats
docker compose exec backend bundle exec rails runner "
  require 'sidekiq/api'
  puts 'Queues:'
  Sidekiq::Queue.all.each { |q| puts "  #{q.name}: #{q.size}" }
  puts "Failed: #{Sidekiq::DeadSet.new.size}"
  puts "Retry: #{Sidekiq::RetrySet.new.size}"
"
```

#### Testing Jobs
```ruby
# In Rails console or test files
require 'sidekiq/testing'

# Inline mode - execute jobs immediately
Sidekiq::Testing.inline! do
  WelcomeEmailJob.perform_later(user.id)
end

# Fake mode - capture jobs without executing
Sidekiq::Testing.fake! do
  WelcomeEmailJob.perform_later(user.id)
  assert_equal 1, WelcomeEmailJob.jobs.size
end
```

### Environment Variables

```bash
# Redis Configuration
REDIS_URL=redis://redis:6379/0

# Sidekiq Dashboard (optional, defaults to Devise authentication)
SIDEKIQ_USERNAME=admin
SIDEKIQ_PASSWORD=password
```

### Production Considerations

1. **Redis Persistence**: Configure Redis with appropriate persistence settings
2. **Memory Management**: Monitor Redis memory usage and configure limits
3. **Worker Scaling**: Adjust Sidekiq worker count based on job volume
4. **Job Retention**: Configure job history retention policies
5. **Monitoring**: Set up alerts for failed jobs and queue backlogs

### Common Job Patterns

#### Email Jobs
```ruby
class EmailJob < ApplicationJob
  queue_as :emails
  
  def perform(user_id, template, options = {})
    user = User.find(user_id)
    EmailService.new(user, template, options).deliver
  end
end
```

#### Data Processing Jobs
```ruby
class DataProcessingJob < ApplicationJob
  queue_as :data_processing
  
  def perform(file_path)
    DataProcessor.new(file_path).process
  end
end
```

#### Cleanup Jobs
```ruby
class CleanupJob < ApplicationJob
  queue_as :maintenance
  
  def perform
    User.where('created_at < ?', 30.days.ago).destroy_all
  end
end
```

## ⚙️ Configuration

### Database Configuration

```yaml
# config/database.yml
development:
  adapter: postgresql
  encoding: unicode
  database: backend_development
  username: <%= ENV['POSTGRES_USER'] || 'postgres' %>
  password: <%= ENV['POSTGRES_PASSWORD'] || 'postgres' %>
  host: <%= ENV['POSTGRES_HOST'] || 'localhost' %>
  port: 5432
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  timeout: 5000
```

## ⚙️ Configuration

### Environment Variables

```bash
# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_HOST=db
POSTGRES_DB=backend_development

# Redis Configuration
REDIS_URL=redis://redis:6379/0

# Rails Configuration
RAILS_ENV=development
RAILS_MASTER_KEY=<your-master-key>

# JWT Secret (stored in credentials)
DEVISE_JWT_SECRET_KEY=<your-jwt-secret>
```

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

### Application Configuration

```ruby
# config/application.rb
module Backend
  class Application < Rails::Application
    config.load_defaults 7.1
    
    # API-only configuration
    config.api_only = false # Set to false to support web console
    
    # CORS and middleware configuration
    config.middleware.use ActionDispatch::Cookies
    config.middleware.use ActionDispatch::Session::CookieStore
  end
end
```

## 💻 Development

### Local Development Setup

1. **Install Ruby Dependencies**
   ```bash
   bundle install
   ```

2. **Setup Database**
   ```bash
   bundle exec rails db:create
   bundle exec rails db:migrate
   bundle exec rails db:seed  # Optional
   ```

3. **Start Development Server**
   ```bash
   bundle exec rails server -b 0.0.0.0 -p 3000
   ```

### Docker Development

```bash
# Build and start backend service
docker compose -f ../../dockerfiles/docker-compose.yml up backend --build

# Run migrations in container
docker compose -f ../../dockerfiles/docker-compose.yml exec backend bundle exec rails db:migrate

# Access Rails console
docker compose -f ../../dockerfiles/docker-compose.yml exec backend bundle exec rails console

# View logs
docker compose -f ../../dockerfiles/docker-compose.yml logs backend
```

### Common Development Commands

```bash
# Database operations
bundle exec rails db:create         # Create database
bundle exec rails db:migrate        # Run migrations
bundle exec rails db:rollback       # Rollback last migration
bundle exec rails db:reset          # Drop, create, and migrate
bundle exec rails db:seed           # Load seed data

# Rails console
bundle exec rails console           # Interactive Ruby console
bundle exec rails dbconsole         # Database console

# Code analysis
bundle exec rubocop                 # Run style checker
bundle exec brakeman               # Security analysis

# Server management
bundle exec rails server           # Start development server
bundle exec rails server -e production  # Start in production mode
```

## 🧪 Testing

### Test Framework Setup

```ruby
# Gemfile (test group)
group :test do
  gem 'rspec-rails'
  gem 'factory_bot_rails'
  gem 'shoulda-matchers'
  gem 'database_cleaner-active_record'
end
```

### Running Tests

```bash
# Run all tests
bundle exec rspec

# Run specific test file
bundle exec rspec spec/models/user_spec.rb

# Run with documentation format
bundle exec rspec --format documentation

# Run with coverage
bundle exec rspec --format documentation --require spec_helper
```

### Example Test Structure

```ruby
# spec/models/user_spec.rb
RSpec.describe User, type: :model do
  describe 'validations' do
    it { should validate_presence_of(:email) }
    it { should validate_uniqueness_of(:email) }
  end

  describe 'devise modules' do
    it 'includes jwt_authenticatable' do
      expect(User.devise_modules).to include(:jwt_authenticatable)
    end
  end
end

# spec/requests/users/registrations_spec.rb
RSpec.describe 'User Registration', type: :request do
  describe 'POST /users' do
    let(:valid_params) do
      {
        user: {
          email: 'test@example.com',
          password: 'password123'
        }
      }
    end

    it 'creates a new user' do
      expect {
        post '/users', params: valid_params, as: :json
      }.to change(User, :count).by(1)
    end

    it 'returns JWT token in header' do
      post '/users', params: valid_params, as: :json
      expect(response.headers['Authorization']).to be_present
    end
  end
end
```

## 🚀 Deployment

### Production Configuration

1. **Environment Variables**
   ```bash
   RAILS_ENV=production
   RAILS_MASTER_KEY=<production-master-key>
   DATABASE_URL=postgresql://user:pass@host:port/dbname
   DEVISE_JWT_SECRET_KEY=<production-jwt-secret>
   ```

2. **Database Setup**
   ```bash
   RAILS_ENV=production bundle exec rails db:create
   RAILS_ENV=production bundle exec rails db:migrate
   ```

3. **Asset Compilation** (if needed)
   ```bash
   RAILS_ENV=production bundle exec rails assets:precompile
   ```

### Docker Production

```dockerfile
# Dockerfile (production)
FROM ruby:3.2.2-alpine

WORKDIR /app

# Install dependencies
COPY Gemfile Gemfile.lock ./
RUN bundle config --global frozen 1 && \
    bundle install --without development test

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Start server
CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0"]
```

### Health Checks

The application includes a built-in health check endpoint:

```bash
# Health check endpoint
GET /up

# Response (200 OK)
{
  "status": "ok",
  "timestamp": "2025-08-30T12:00:00Z"
}
```

## 🔍 Monitoring & Debugging

### Logging

```ruby
# config/environments/development.rb
config.log_level = :debug

# config/environments/production.rb
config.log_level = :info
```

### Performance Monitoring

```bash
# Monitor Rails performance
bundle exec rails server --binding=0.0.0.0 --port=3000 --environment=development

# Memory usage
ps aux | grep rails

# Database queries (in Rails console)
ActiveRecord::Base.logger = Logger.new(STDOUT)
```

### Common Debugging Commands

```bash
# View application logs
tail -f log/development.log

# Rails console for debugging
bundle exec rails console

# Database console
bundle exec rails dbconsole

# Check routes
bundle exec rails routes

# Check middleware stack
bundle exec rails middleware
```

## 📚 Additional Resources

- [Rails Guides](https://guides.rubyonrails.org/)
- [Devise Documentation](https://github.com/heartcombo/devise)
- [Devise-JWT Documentation](https://github.com/waiting-for-dev/devise-jwt)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## 🤝 Contributing

1. Follow Rails conventions and best practices
2. Write tests for new features
3. Update documentation for API changes
4. Use meaningful commit messages
5. Ensure all tests pass before submitting PRs

---

For questions or issues related to the backend API, please refer to the main project [README](../../README.md) or open an issue in the project repository.
