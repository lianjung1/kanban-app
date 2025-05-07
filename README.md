
# Kano

A full-stack Kanban task management application built with React, TypeScript, Express.js, and MongoDB. This application allows users to create, update, and manage boards, columns, tasks, and comments in real-time using Socket.IO.


## Live Demo

https://kano-ashy.vercel.app


## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Folder Structure](#folder-structure)
- [Deployment](#deployment)

## Features

- **User Authentication**: Secure login and registration using JWT and bcrypt.
- **Board Management**: Create, update, and delete boards.
- **Column Management**: Manage columns within boards.
- **Task Management**: Add, update, delete, and move tasks across columns.
- **Comments**: Add, edit, and delete comments on tasks.
- **Real-Time Updates**: Instant updates across clients using Socket.IO.
- **Responsive Design**: Optimized for both desktop and mobile devices.



## Tech Stack

**Client:** React, Typescript, Vite, Axios, Socket.IO Client, shadcn/ui, TailwindCSS,

**Server:** Node.js, Express.js, MongoDB, Socket.IO, JWT, bcryptjs


## Installation

Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB instance

Clone the repository:

```bash
  git clone https://github.com/lianjung1/kanban-app.git
  cd kanban-app
```

Install dependencies for both client and server:
```bash
# Install server dependencies
  cd server
  npm install

# Install client dependencies
  cd ../client
  npm install
```


    
## Environment Variables

To run this project, you will need to add the following environment variables to your .env files

#### Server (server/.env)

`MONGODB_URI` - MongoDB connection string

`PORT` - Port number for the server

`JWT_SECRET` - Secret key for JWT

`CLIENT_URL` - URL of the frontend application

#### Client (client/.env)

`VITE_API_URL` - URL of the backend API


## Run Locally

#### Server
```bash
# Start the server
  npm start

# Start the server with nodemon for development
  npm run dev
```

#### Client
```bash
# Start the development server
  npm run dev

# Build the application for production
  npm run build

# Preview the production build
  npm run preview
```

    
## Folder Structure

```bash
.
├── client/             # Frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── main.tsx
│   ├── .env
│   ├── index.html
│   └── vite.config.ts
├── server/             # Backend application
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── .env
│   └── index.js
├── package.json
└── README.md
```
## Deployment

#### Backend

The backend is deployed on Render.

```bash
Steps:

Create a new Web Service on Render.

Connect your GitHub repository.

Set the build command to npm install.

Set the start command to npm start.

Add the necessary environment variables in the Render dashboard.

```

#### Frontend

The frontend is deploted on Vercel.

```bash
Steps:

Import your GitHub repository into Vercel.

Set the project settings:

Framework: Vite

Build Command: npm run build

Output Directory: dist

Root Directory: client

Add the necessary environment variables in the Vercel dashboard.

```

