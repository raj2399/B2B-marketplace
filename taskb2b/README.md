# TaskB2B API

A RESTful API for TaskB2B platform built with Node.js, Express, and MongoDB.

## Prerequisites

- Node.js (v12 or higher)
- MongoDB (v4.0 or higher)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd taskb2b
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/taskb2b
```

## Running the Application

1. Start MongoDB service on your machine

2. Start the server:
```bash
npm start
```

The server will start running at `http://localhost:3000`

## API Endpoints

### Categories
- GET `/api/categories` - Get all categories
- POST `/api/categories` - Create a new category

### Search
- GET `/api/search` - Search functionality

## Project Structure

```
src/
├── index.js         - Application entry point
├── routes/          - API routes
│   ├── category.js  - Category routes
│   └── search.js    - Search routes
└── models/          - Database models
```

## Dependencies

- express - Web framework
- mongoose - MongoDB object modeling
- cors - Cross-Origin Resource Sharing
- dotenv - Environment variables management 