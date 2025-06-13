# Online Judge Platform

A full-stack online judge platform that allows users to solve programming problems, submit solutions, and get instant feedback. The platform includes features for both users and administrators.

See Video Tutorial -> https://www.loom.com/share/73752714d3b84b73a77b7e0688bce728?sid=789263f0-0af5-4dec-af28-4e530829c711

## 🌟Features

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

## 👨‍💻Tech Stack

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

## 🚀Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Docker (optional)

## ⚙️Installation

1. Clone the repository:
```bash
git clone https://github.com/ritwik1709/judgeX
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

## 🤝Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 🧑‍💼Author

Ritwik Sudhakar Tat

## 📄License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏Acknowledgments

- Inspired by Other Coding Platforms.
