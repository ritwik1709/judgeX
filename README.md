# Online Judge Platform

A full-stack online judge platform that allows users to solve programming problems, submit solutions, and get instant feedback. The platform includes features for both users and administrators.

## Features

### User Features
- User authentication (login/register)
- Browse and solve programming problems
- Submit solutions in multiple languages (C++, Python, Java)
- View submission history and results
- Get AI-powered Suggestions/hints for wrong submissions
- View user profile with statistics
- Dark/Light mode support

### Admin Features
- Manage problems (CRUD operations)
- Manage users (view, delete, change roles)
- View admin statistics
- Responsive admin dashboard

## Tech Stack

### Frontend
- React.js
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- Context API for state management
- Monaco Editor for code editing

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Docker for containerization

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Docker (optional)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd onlineJudge
```

2. Install dependencies for both frontend and backend:
```bash
# Install backend dependencies
cd oj-backend
npm install

# Install frontend dependencies
cd ../oj-frontend
npm install
```

3. Set up environment variables:

Create a `.env` file in the `oj-backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
ADMIN_SECRET_CODE=..
OPENAI_API_KEY=..
GOOGLE_AI_API_KEY=..
```

4. Start the development servers:

```bash
# Start backend server (from oj-backend directory)
npm run dev

# Start frontend server (from oj-frontend directory)
npm run dev
```

## Deployment

The application is deployed on:
- Frontend: Vercel
- Backend: Render

## Project Structure

```
onlineJudge/
├── oj-frontend/          # React frontend
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # Context providers
│   │   └── utils/       # Utility functions
│   └── public/          # Static files
│
└── oj-backend/          # Node.js backend
    ├── controllers/     # Route controllers
    ├── models/         # Mongoose models
    ├── routes/         # API routes
    ├── middleware/     # Custom middleware
    └── utils/          # Utility functions
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Problems
- `GET /api/problems` - Get all problems
- `GET /api/problems/:id` - Get problem by ID
- `POST /api/problems` - Create new problem (admin only)
- `PUT /api/problems/:id` - Update problem (admin only)
- `DELETE /api/problems/:id` - Delete problem (admin only)

### Submissions
- `POST /api/submissions/submit` - Submit solution
- `GET /api/submissions/my-submissions` - Get user's submissions

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/stats` - Get admin statistics
- `DELETE /api/admin/users/:id` - Delete user (admin only)
- `PATCH /api/admin/users/:id` - Update user role (admin only)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## Author

Ritwik Sudhakar Tat

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by Other Coding Platforms.
