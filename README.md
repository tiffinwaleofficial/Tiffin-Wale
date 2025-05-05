# Tiffin-Wale

A comprehensive tiffin meal subscription platform for easy food delivery.

## Project Structure

```
tiffin-wale/
├── monolith_backend/     # NestJS backend service
├── interface/            # Frontend applications
│   ├── webapp/
│   │   ├── OfficialWeb/  # Customer web interface (Next.js)
│   │   └── SuperAdmin/   # Admin dashboard
│   └── mobile-app/       # Mobile application
```

## Local Development

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Docker (optional, for containerized development)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd tiffin-wale
```

2. Install all dependencies:

```bash
npm run install:all
```

3. Set up environment variables:

```bash
# Backend
cp monolith_backend/.env.example monolith_backend/.env
# Edit the .env file with your configuration
```

### Running the Application

```bash
# Start backend only
npm run backend

# Start frontend only
npm run frontend

# Start both concurrently
npm run both

# Development mode with hot-reload
npm run both:dev
```

## Docker Development

### Building Docker Images

```bash
# Build backend image
docker build -f Dockerfile.backend -t tiffin-wale-backend .

# Build frontend image
docker build -f Dockerfile.frontend -t tiffin-wale-frontend .
```

### Running with Docker

```bash
# Run backend container
docker run -p 3000:3000 tiffin-wale-backend

# Run frontend container
docker run -p 3001:3000 tiffin-wale-frontend
```

## GCP Deployment

### Manual Deployment

1. Set up GCP CLI and authenticate:

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

2. Build and deploy backend to Cloud Run:

```bash
docker build -f Dockerfile.backend -t gcr.io/YOUR_PROJECT_ID/tiffin-wale-backend .
docker push gcr.io/YOUR_PROJECT_ID/tiffin-wale-backend
gcloud run deploy tiffin-wale-backend \
  --image gcr.io/YOUR_PROJECT_ID/tiffin-wale-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

3. Build and deploy frontend to Cloud Run:

```bash
docker build -f Dockerfile.frontend -t gcr.io/YOUR_PROJECT_ID/tiffin-wale-frontend .
docker push gcr.io/YOUR_PROJECT_ID/tiffin-wale-frontend
gcloud run deploy tiffin-wale-frontend \
  --image gcr.io/YOUR_PROJECT_ID/tiffin-wale-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### CI/CD Deployment

Set up Cloud Build trigger to automatically deploy when code is pushed:

1. Enable Cloud Build API in your GCP project
2. Create a trigger in Cloud Build that uses the provided `cloudbuild.yaml`
3. Push to your repository to trigger the deployment

### Custom Domain Setup

1. Map your domain to the frontend service:

```bash
gcloud beta run domain-mappings create \
  --service tiffin-wale-frontend \
  --domain tiffin-wale.com
```

2. Add DNS records as instructed by Google Cloud

3. (Optional) Map backend to API subdomain:

```bash
gcloud beta run domain-mappings create \
  --service tiffin-wale-backend \
  --domain api.tiffin-wale.com
```

Note: Backend will be available at the provided GCP URL (e.g., https://tiffin-wale-backend-xyz.a.run.app) without requiring a custom subdomain.

## Environment Variables

### Backend (.env)

```
# Database
MONGODB_URI=mongodb://localhost:27017/TiffinWale

# Authentication
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=24h

# API Configuration
PORT=3000
API_PREFIX=/api
```

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

In production, the frontend should point to the backend Cloud Run URL or subdomain:

```
NEXT_PUBLIC_API_URL=https://tiffin-wale-backend-xyz.a.run.app/api
# or if using custom domain
NEXT_PUBLIC_API_URL=https://api.tiffin-wale.com/api
```

---

Built with ❤️ for tiffin lovers
