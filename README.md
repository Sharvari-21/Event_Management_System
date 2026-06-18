# Event Management System

## Overview

The Event Management System is a full-stack web application that enables users to discover, register for, and manage events. The platform provides secure authentication, role-based access control, attendee management, and automated email notifications.

## Features

### User Features

* User Registration & Login
* JWT Authentication
* Browse Events
* Search & Filter Events
* View Event Details
* Register for Events
* Cancel Registrations
* View My Registrations

### Admin Features

* Create Events
* Update Events
* Delete Events
* View Event Attendees
* Role-Based Access Control (RBAC)

## Tech Stack

### Frontend

* React
* Vite
* Axios
* React Router

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* Nodemailer

## Setup Instructions

### Prerequisites

* Node.js (v18+)
* MongoDB Atlas or Local MongoDB
* Git

### Backend Setup

1. Navigate to backend folder

```bash
cd backend
```

2. Install dependencies

```bash
npm install
```

3. Create .env file

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

4. Start backend

```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend folder

```bash
cd frontend
```

2. Install dependencies

```bash
npm install
npm install axios react-router-dom
```

3. Create .env

```env
VITE_API_URL=http://localhost:5000/api
```

4. Start frontend

```bash
npm run dev
```

## Test Credentials

### Admin

[admin@example.com](mailto:admin@example.com)
password123

### User

[user@example.com](mailto:user@example.com)
password123

## Future Enhancements

* Payment Gateway Integration
* Event Analytics Dashboard
* QR Code Event Check-in
* Event Recommendations using AI
* Real-Time Notifications

# 2. API Documentation

### Authentication APIs

| Method | Endpoint             | Description      |
| ------ | -------------------- | ---------------- |
| POST   | `/api/auth/register` | Register User    |
| POST   | `/api/auth/login`    | Login User       |
| GET    | `/api/auth/me`       | Get Current User |

### Event APIs

| Method | Endpoint                    |
| ------ | --------------------------- |
| GET    | `/api/events`               |
| GET    | `/api/events/:id`           |
| POST   | `/api/events`               |
| PUT    | `/api/events/:id`           |
| DELETE | `/api/events/:id`           |
| GET    | `/api/events/:id/attendees` |

### Registration APIs

| Method | Endpoint                   |
| ------ | -------------------------- |
| POST   | `/api/events/:id/register` |
| DELETE | `/api/events/:id/register` |
| GET    | `/api/registrations/my`    |

### Sample Login Request

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Sample Login Response

```json
{
  "_id": "123",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "jwt_token"
}
```

---

# 3. Performance & Security Practices

### Security

* JWT-based Authentication
* Password Hashing using bcryptjs
* Role-Based Access Control (Admin/User)
* Input Validation using express-validator
* Protected Routes Middleware
* Environment Variables for Secrets
* MongoDB Injection Prevention through Mongoose
* Centralized Error Handling Middleware
* CORS Configuration

### Performance

* Indexed MongoDB Queries
* Pagination for Event Listings
* Reusable React Components
* Axios Instance for API Calls
* Optimized Database Population
* Client-side Route Protection
* Modular Backend Architecture
* Efficient State Management using React Context

---

# 4. Deployment & Documentation

### Backend Deployment (Render)

```bash
Build Command:
npm install

Start Command:
npm start
```

Environment Variables:

```env
MONGO_URI=
JWT_SECRET=
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USER=
EMAIL_PASS=
```

### Frontend Deployment (Vercel)

```bash
npm run build
```

Environment Variables:

```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### Deployment Architecture

```text
Frontend (Vercel)
       |
       v
Backend API (Render)
       |
       v
MongoDB Atlas
```

### Documentation Deliverables

* README.md
* API Documentation
* Database Schema Description
* Deployment Guide
* User Manual

---

