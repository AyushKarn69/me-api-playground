# Me-API Playground

A full-stack personal profile API and web application showcasing professional information, projects, skills, and work experience via a REST API with a React frontend.

**Resume**: [Ayush Karn - Resume](https://drive.google.com/file/d/1W3VJstd7AswSNUJs8gew5SOin03e94ui/view?usp=sharing)

## 🏗️ Architecture

### Tech Stack
- **Backend**: Node.js + Express.js with PostgreSQL
- **Frontend**: React + Vite
- **Security**: Helmet, CORS, Rate Limiting
- **Database**: PostgreSQL with normalized schema

### Backend Architecture
```
Express Server (Port 3001)
├── Middleware (Helmet, CORS, Rate Limit)
├── Health Check Endpoint
└── API Routes
    ├── /api/profile
    ├── /api/projects
    ├── /api/skills
    └── /api/search
```

### Frontend Architecture
```
React App (Port 3000)
├── Components
│   ├── Profile - Display candidate information
│   ├── Projects - Browse projects with skill filtering
│   ├── Search - Full-text search functionality
│   └── Navigation
└── API Layer
    └── Axios client for backend communication
```
## 📊 Database Schema

### Tables

**profile**
```
id (PK)           - Auto-incremented ID
name              - Candidate name
email (UNIQUE)    - Email address
education         - Educational background
github_link       - GitHub profile URL
linkedin_link     - LinkedIn profile URL
portfolio_link    - Portfolio URL
created_at        - Timestamp
updated_at        - Timestamp
```

**skills**
```
id (PK)
profile_id (FK)   - References profile.id (CASCADE)
skill_name        - Skill name
proficiency       - Level (Beginner, Intermediate, Advanced)
created_at        - Timestamp
UNIQUE(profile_id, skill_name)
```

**projects**
```
id (PK)
profile_id (FK)   - References profile.id (CASCADE)
title             - Project title
description       - Project description
github_link       - GitHub repository URL
live_link         - Live deployment URL
created_at        - Timestamp
updated_at        - Timestamp
```

**project_skills** (Many-to-Many)
```
id (PK)
project_id (FK)   - References projects.id (CASCADE)
skill_name        - Associated skill
created_at        - Timestamp
UNIQUE(project_id, skill_name)
```

**work_experience**
```
id (PK)
profile_id (FK)   - References profile.id (CASCADE)
company           - Company name
position          - Job title
start_date        - Start date
end_date          - End date
description       - Job description
created_at        - Timestamp
updated_at        - Timestamp
```

## 🚀 Setup

### Prerequisites
- Node.js >= 16
- PostgreSQL >= 12
- npm or yarn

### Local Setup

#### 1. Clone and Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

#### 2. Database Configuration

```bash
# Create .env file in backend directory
cd backend
cat > .env << EOF
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_DB=me_api_playground
PORT=3001
NODE_ENV=development
EOF
```

#### 3. Initialize Database

```bash
# Initialize schema
npm run db:init

# Seed with sample data
npm run db:seed
```

#### 4. Start Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev
# Backend: http://localhost:3001

# Terminal 2 - Frontend
cd frontend
npm run dev
# Frontend: http://localhost:3000
```

### Production Setup

#### 1. Environment Configuration

```bash
# backend/.env
POSTGRES_USER=prod_user
POSTGRES_PASSWORD=strong_password
POSTGRES_HOST=your_db_host
POSTGRES_PORT=5432
POSTGRES_DB=me_api_playground_prod
PORT=3001
NODE_ENV=production
```

#### 2. Database Setup

```bash
# On production database server
psql -U prod_user -d me_api_playground_prod < db/schema.sql
node db/seed.js
```

#### 3. Build and Run

```bash
# Backend (with PM2 or systemd)
npm install pm2 -g
pm2 start server.js --name "me-api"
pm2 save

# Frontend (build static files)
cd frontend
npm run build
# Deploy dist/ folder to web server (nginx, Apache, etc.)
```

#### 4. Web Server Configuration (Nginx Example)

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /var/www/me-api/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 📡 API Endpoints

### Health Check
- `GET /health` - Database and API health status

### Profile
- `GET /api/profile` - Get latest profile
- `GET /api/profile/:id` - Get specific profile
- `GET /api/profile/:id/full` - Get profile with all related data
- `POST /api/profile` - Create profile
- `PUT /api/profile/:id` - Update profile

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects?skill=React` - Filter projects by skill
- `GET /api/projects/:id` - Get specific project
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Skills
- `GET /api/skills` - Get all skills
- `GET /api/skills/top?limit=10` - Get top skills

### Search
- `GET /api/search?q=query` - Search across projects and skills

## 📝 Sample Requests

### Using cURL

```bash
# Health check
curl http://localhost:3001/health

# Get profile
curl http://localhost:3001/api/profile

# Get all projects
curl http://localhost:3001/api/projects

# Filter projects by skill
curl 'http://localhost:3001/api/projects?skill=React'

# Get top skills
curl 'http://localhost:3001/api/skills/top?limit=5'

# Search
curl 'http://localhost:3001/api/search?q=python'
```

### Using Postman

Import the provided Postman collection:
- File: `Me-API-Playground.postman_collection.json`
- Contains pre-configured requests for all API endpoints
- Ready to use in Postman for testing and documentation

For detailed curl requests, see `sample-curl-requests.sh`

## ⚠️ Known Limitations

1. **Single Profile**: The API currently supports only one active profile. Multi-user support would require authentication and user management.

2. **No Authentication**: The API has no built-in authentication. In production, add JWT or OAuth2 for security.

3. **Rate Limiting**: Global rate limit of 100 requests per 15 minutes per IP. High-volume use cases may need adjustment.

4. **No Caching**: No Redis or caching layer. High-traffic scenarios may benefit from caching.

5. **Search Functionality**: Full-text search is basic and case-sensitive. Advanced search requires PostgreSQL `tsvector` or Elasticsearch.

6. **File Uploads**: No support for profile pictures or document uploads. S3/cloud storage integration would be needed.

7. **Frontend Limitations**:
   - No pagination for large project lists
   - Limited to 6 projects per category on frontend
   - No offline support
   - Browser-dependent (no progressive web app)

8. **Database**:
   - No soft deletes (cascade deletes are permanent)
   - Limited to one profile per database instance
   - No migration tools (manual SQL schema changes required)

9. **Deployment**:
   - No containerization (Docker setup needed for consistent environments)
   - Assumes manual database setup in production
   - SSL/TLS configuration required but not included

10. **Monitoring & Logging**:
    - Minimal error handling
    - No request logging or monitoring
    - No performance metrics or analytics

## 🔧 Development

### Project Structure
```
me-api-playground/
├── backend/
│   ├── db/
│   │   ├── connection.js
│   │   ├── init.js
│   │   ├── schema.sql
│   │   └── seed.js
│   ├── routes/
│   │   ├── profile.js
│   │   ├── projects.js
│   │   ├── skills.js
│   │   └── search.js
│   ├── middleware/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Profile.jsx
│   │   │   ├── Projects.jsx
│   │   │   └── Search.jsx
│   │   ├── App.jsx
│   │   ├── api.js
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

### Database Commands

```bash
# Initialize database schema
npm run db:init

# Seed database with sample data
npm run db:seed

# Access PostgreSQL directly
psql -U postgres -d me_api_playground
```

## 📱 Frontend Features

- **Profile Component**: Display candidate information, education, and links
- **Projects Component**: Browse projects with skill-based filtering
- **Search Component**: Full-text search across projects and skills
- **Responsive Design**: Mobile-friendly interface
- **Live Filtering**: Real-time project filtering by selected skills

## 🔐 Security Features

- **Helmet.js**: Sets HTTP headers for security
- **CORS**: Configured for cross-origin requests
- **Rate Limiting**: Prevents abuse with 100 req/15min per IP
- **SQL Injection Prevention**: Uses parameterized queries
- **Input Validation**: Server-side validation on all endpoints

## 📚 Additional Resources
- [GitHub Profile](https://github.com/AyushKarn69)
- [LinkedIn](https://www.linkedin.com/in/ayushkarn01/)

## 📄 License

This project is open source and available under the MIT License.
