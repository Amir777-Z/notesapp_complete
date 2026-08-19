# Notes App

A fullstack notes application built as a university assignment. Users can register, log in, and create, edit, and delete their own notes, while browsing other users' notes through a paginated feed with a notification area showing recent activity.

## Screenshots

![Notification area](./screenshots/Notification-area.webp)
![Pagination](./screenshots/Pagination.webp)

## Tech Stack

**Frontend**
- React 19 + TypeScript
- Vite
- Playwright (end-to-end testing)
- Axios, JWT decoding for auth state

**Backend**
- Node.js + Express 5
- MongoDB with Mongoose
- JWT-based authentication
- bcrypt for password hashing
- express-validator for request validation

## Features

- User registration and login with JWT authentication
- Create, edit, and delete personal notes
- Browse other users' notes in a paginated feed
- Notification area showing recent activity
- Custom pagination component handling edge cases: fewer than 5 total pages, being near the start/end of the list, and keeping a consistent button count (current page, two previous, two next)

## Project Structure

```
notesapp_complete/
├── backend/          # Express API (routes, controllers, models, middleware)
└── frontend/         # React + TypeScript client (Vite)
```

## Getting Started

### Prerequisites

- Node.js
- A MongoDB connection string (e.g. from MongoDB Atlas)

### Backend

```
cd backend
npm install
```

Create a `.env` file in `backend/` with:

```
MONGOURI=your_mongodb_connection_string
SECRET=your_jwt_secret
```

```
npm run dev
```

The API runs on `http://localhost:3001` by default.

### Frontend

```
cd frontend
npm install
npm run dev
```

## Testing

The frontend includes Playwright end-to-end tests:

```
cd frontend
npm test
```

## Notes

This project was built as part of a university course. It's shared here to showcase fullstack work across a React/TypeScript frontend and an Express/MongoDB backend, including authentication, pagination, and API design.
