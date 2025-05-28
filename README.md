# B2B Marketplace

A full-stack B2B marketplace application with a Next.js frontend and Node.js/Express backend.

## Prerequisites

- Docker and Docker Compose
- Node.js v18 or higher (for local development)
- MongoDB v4.0 or higher (for local development)
- npm or yarn package manager (for local development)

## Project Structure

```
.
├── task-search-app/    # Frontend (Next.js)
└── taskb2b/           # Backend (Node.js/Express)
```

## Quick Start with Docker

1. Clone the repository:
```bash
git clone [repository-url]
cd b2b-marketplace
```

2. Start the application using Docker Compose:
```bash
docker-compose up
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Manual Setup (Development)

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd task-search-app
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd taskb2b
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskb2b
```

4. Start the development server:
```bash
npm start
```

## Seed Data

To populate the database with initial data:

1. Ensure MongoDB is running
2. Navigate to the backend directory:
```bash
cd taskb2b
```

3. Run the seed command:
```bash
npm run seed
```

This will populate the database with:
- Sample categories
- Test users
- Example products

## API Documentation

### Categories

#### GET /api/categories
Get all categories

Response:
```json
{
  "categories": [
    {
      "id": "string",
      "name": "string",
      "description": "string"
    }
  ]
}
```

#### POST /api/categories
Create a new category

Request Body:
```json
{
  "name": "string",
  "description": "string"
}
```

### Search

#### GET /api/search
Search functionality

Query Parameters:
- `q`: Search query string
- `category`: Category ID (optional)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

Response:
```json
{
  "results": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "category": "string"
    }
  ],
  "total": "number",
  "page": "number",
  "totalPages": "number"
}
```