# Bulk Email Firing Application

A Node.js application for sending bulk emails using BullMQ queue system, with MongoDB for data persistence and Redis for job queue management.

## 🚀 Features

- Bulk email sending with queue management
- BullMQ for job processing
- MongoDB for database
- Redis for queue storage
- Zoho email integration
- Docker containerization for easy deployment

## 📋 Prerequisites

- Docker (version 20.10 or higher)
- Docker Compose (version 2.0 or higher)

## 🛠️ Quick Start with Docker

### 1. Clone the repository and navigate to the project directory

```bash
cd bulk-email-firing
```

### 2. Set up environment variables

Copy the example environment file and update with your credentials:

```bash
cp .env.example .env
```

Edit `.env` file and update the Zoho email credentials:

```env
ZOHO_EMAIL=your-email@example.com
ZOHO_PASSWORD=your-zoho-password
```

**Note:** For Docker Compose setup, MongoDB and Redis URLs are already configured. You only need to update the Zoho credentials.

### 3. Build and start the application

```bash
# Build and start all services (MongoDB, Redis, and the app)
docker-compose up --build

# Or run in detached mode (background)
docker-compose up -d --build
```

### 4. Verify the services are running

```bash
docker-compose ps
```

You should see three services running:
- `bulk-email-app` - The main application (port 5004)
- `bulk-email-mongodb` - MongoDB database (port 27017)
- `bulk-email-redis` - Redis queue (port 6379)

## 🔧 Docker Commands

### Start the application
```bash
docker-compose up -d
```

### Stop the application
```bash
docker-compose down
```

### Stop and remove all data (including volumes)
```bash
docker-compose down -v
```

### View logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f app
docker-compose logs -f mongodb
docker-compose logs -f redis
```

### Restart a service
```bash
docker-compose restart app
```

### Rebuild after code changes
```bash
docker-compose up -d --build
```

### Execute commands inside containers
```bash
# Access app container shell
docker-compose exec app sh

# Access MongoDB shell
docker-compose exec mongodb mongosh -u admin -p admin123

# Access Redis CLI
docker-compose exec redis redis-cli
```

## 🌐 API Endpoints

Once the application is running, you can access it at:
- **Base URL:** `http://localhost:5004`
- **API Routes:** `http://localhost:5004/api/*`

## 📁 Project Structure

```
bulk-email-firing/
├── config/           # Configuration files (DB, Redis)
├── email/            # Email sending logic
├── queue/            # Queue setup
├── routes/           # API routes
├── worker/           # Background workers
├── server.js         # Main application file
├── Dockerfile        # Docker image configuration
├── docker-compose.yml # Multi-container setup
└── .env             # Environment variables (not in git)
```

## 🔐 Environment Variables

| Variable | Description | Default (Docker) |
|----------|-------------|------------------|
| `MONGO_URL` | MongoDB connection URL | `mongodb://admin:admin123@mongodb:27017/toolo_dev?authSource=admin` |
| `DB_NAME` | Database name | `toolo_dev` |
| `REDIS_URL` | Redis connection URL | `redis://redis:6379` |
| `ZOHO_EMAIL` | Zoho email for sending | Required |
| `ZOHO_PASSWORD` | Zoho email password | Required |
| `PORT` | Application port | `5004` |

## 🚢 Deployment to Production Server

### Option 1: Using Docker Compose (Recommended)

1. Install Docker and Docker Compose on your server
2. Copy all files to your server
3. Update `.env` with production credentials
4. Run `docker-compose up -d --build`

### Option 2: Using Pre-built Image

1. Build the image locally:
   ```bash
   docker build -t bulk-email-app:latest .
   ```

2. Push to a registry (Docker Hub, AWS ECR, etc.):
   ```bash
   docker tag bulk-email-app:latest your-registry/bulk-email-app:latest
   docker push your-registry/bulk-email-app:latest
   ```

3. On the server, pull and run:
   ```bash
   docker pull your-registry/bulk-email-app:latest
   docker-compose up -d
   ```

## 🐛 Troubleshooting

### Container fails to start
```bash
# Check logs
docker-compose logs app

# Check if ports are already in use
lsof -i :5004
lsof -i :27017
lsof -i :6379
```

### MongoDB connection issues
```bash
# Verify MongoDB is healthy
docker-compose exec mongodb mongosh -u admin -p admin123 --eval "db.adminCommand('ping')"
```

### Redis connection issues
```bash
# Test Redis connection
docker-compose exec redis redis-cli ping
```

### Reset everything
```bash
# Stop and remove all containers, networks, and volumes
docker-compose down -v
# Rebuild from scratch
docker-compose up --build
```

## 📝 Development

For local development without Docker:

1. Install Node.js (v18 or higher)
2. Install MongoDB and Redis locally
3. Update `.env` with local connection URLs:
   ```env
   MONGO_URL=mongodb://localhost:27017/toolo_dev
   REDIS_URL=redis://127.0.0.1:6379
   ```
4. Run:
   ```bash
   npm install
   npm start
   ```

## 📄 License

ISC

## 👥 Author

Rakesh Modak
