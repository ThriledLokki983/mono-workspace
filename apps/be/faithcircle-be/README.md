# Huishelder Backend API

A robust Node.js backend service for the Huishelder application, providing user management and authentication services.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Development Setup](#development-setup)
  - [Production Setup](#production-setup)
- [Environment Configuration](#environment-configuration)
- [API Documentation](#api-documentation)
- [Database Migrations](#database-migrations)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- User authentication and management
- JWT-based authentication system
- Role-based access control
- API rate limiting
- Database migrations
- Comprehensive error handling
- Request validation
- Logging and monitoring
- Docker support for development and production

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Caching**: Redis
- **Authentication**: JWT (JSON Web Tokens)
- **API Documentation**: OpenAPI (Swagger)
- **Testing**: Jest
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions (configured separately)

## 📋 Prerequisites

- Node.js (v16+)
- Docker & Docker Compose
- Git

## 🚀 Getting Started

Clone the repository:

```bash
git clone <repository-url>
cd huishelder-be
```

### Development Setup

1. Create a `.env.development.local` file based on the example template

2. Start the development environment:

```bash
# Start all development services
docker-compose up

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f server
```

The development server will be available at: http://localhost:3000

### Production Setup

1. Create a `.env.production.local` file based on the example template

2. Run the application in production mode:

```bash
# Build and start all production services
docker-compose -f docker-compose.prod.yml up --build

# Run in detached mode
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f server-prod
```

Production environment includes:

- Multi-stage Docker builds for smaller image sizes
- SSL configuration through Nginx
- Dedicated volumes for persistent data
- Production-optimized configurations

## ⚙️ Environment Configuration

The project uses different environment files for different environments:

- `.env.development.local`: Development environment variables
- `.env.production.local`: Production environment variables

Key environment variables include:

```
# Server configuration
PORT=3000
NODE_ENV=development|production

# Database configuration
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_DATABASE=huishelder

# JWT configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=86400

# Redis configuration
REDIS_HOST=redis
REDIS_PORT=6379
```

## 📝 API Documentation

API documentation is generated using OpenAPI (Swagger) specification.

- Development Swagger UI: http://localhost:3000/api-docs
- Production Swagger UI: https://your-production-domain.com/api-docs

The API provides endpoints for:

- User management (CRUD operations)
- Authentication (login, register, refresh token)
- System health monitoring

## 🗄️ Database Migrations

This project uses a migration system to manage database schema changes. Migrations can be found in the `/migrations` folder.

To run migrations manually:

```bash
# Through docker-compose service
docker-compose exec server npm run migrate:up

# For production
docker-compose -f docker-compose.prod.yml exec server-prod npm run migrate:up
```

## 🧪 Testing

Run tests with:

```bash
# In development environment
npm test

# With coverage report
npm run test:coverage

# In Docker
docker-compose exec server npm test
```

## 📁 Project Structure

```
├── migrations/           # Database migrations
├── src/
│   ├── app.ts            # Express app setup
│   ├── server.ts         # Server entry point
│   ├── config/           # Configuration files
│   ├── controllers/      # Request controllers
│   ├── database/         # Database connection and models
│   ├── dtos/             # Data Transfer Objects
│   ├── exceptions/       # Custom exceptions
│   ├── http/             # HTTP request examples
│   ├── interfaces/       # TypeScript interfaces
│   ├── logs/             # Application logs
│   ├── middlewares/      # Express middlewares
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── test/             # Test files
│   └── utils/            # Utility functions
├── docker-compose.yml    # Development Docker setup
├── docker-compose.prod.yml # Production Docker setup
├── Dockerfile.dev        # Development Dockerfile
├── Dockerfile.prod       # Production Dockerfile
├── swagger.yaml          # API documentation
└── tsconfig.json         # TypeScript configuration
```

## 👥 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the [MIT License](LICENSE).
