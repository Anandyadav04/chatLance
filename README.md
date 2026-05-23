# chatLance

A production-oriented realtime chat application built to learn and implement real backend architecture, WebSockets, distributed systems concepts, caching, monitoring, and scalable infrastructure.

---

# Tech Stack

## Frontend

* React + Vite
* React Router
* Axios
* Socket.IO Client

## Backend

* Node.js
* Express.js
* Socket.IO
* MongoDB + Mongoose
* Redis
* JWT Authentication

## Infrastructure

* Docker
* Nginx
* Prometheus
* Grafana

---

# Core Features

## Authentication

* JWT-based authentication
* Register/Login system
* Protected routes
* Secure password hashing using bcrypt

## Realtime Messaging

* Live messaging using WebSockets
* Multiple chat rooms
* Join/leave room events
* Online user tracking
* Typing indicators

## Scalability Features

* Redis Pub/Sub
* Socket.IO Redis Adapter
* Rate limiting
* Caching layer
* Reverse proxy with Nginx
* Horizontal scalability support

## Monitoring

* Prometheus metrics
* Grafana dashboards
* API latency tracking
* Active connection monitoring
* Request logging

## Security

* Helmet security headers
* CORS configuration
* Request throttling
* JWT verification
* Input validation

---

## Concepts Implemented

* WebSocket architecture
* Stateless authentication
* Middleware pipeline
* Reverse proxying
* Rate limiting
* Redis caching
* Pub/Sub messaging
* Horizontal scaling
* Dockerized services
* Monitoring and observability
* Load balancing
* API security

---

# Project Structure

```txt
chatLance/
│
├── client/
├── server/
├── nginx/
├── monitoring/
├── redis/
├── postgres/
├── docker-compose.yml
└── README.md
```

---

# Backend Architecture

```txt
Client
   ↓
Nginx Reverse Proxy
   ↓
Express Server + Socket.IO
   ↓
Redis Pub/Sub Layer
   ↓
MongoDB
```

---

# Folder Breakdown

## Client

Contains frontend React application.

### Responsibilities

* UI rendering
* Socket communication
* Authentication state
* Chat room management
* API requests

---

## Server

Contains backend APIs and realtime infrastructure.

### Responsibilities

* Authentication
* WebSocket communication
* Room management
* Message persistence
* Redis integration
* Metrics and monitoring

---

## Nginx

Acts as:

* Reverse proxy
* Load balancer
* WebSocket proxy

---

## Monitoring

Contains:

* Prometheus configuration
* Grafana dashboards

---

# Getting Started

---

# Prerequisites

Install:

* Node.js
* MongoDB
* Redis
* Docker Desktop
* Git

---

# Clone Repository

```bash
git clone https://github.com/Anandyadav04/chatLance.git
cd chatLance
```

---

# Backend Setup

Go inside backend:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create `.env`

```env
PORT=5000

MONGO_URI=mongodb://localhost:27017/realtime_chat

JWT_SECRET=your_super_secret_key

CLIENT_URL=http://localhost:5173

REDIS_HOST=localhost
REDIS_PORT=6379
```

Run backend:

```bash
npm run dev
```

---

# Frontend Setup

Go inside frontend:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

---

# Socket.IO Architecture

## Connection Flow

```txt
Client Connects
    ↓
Socket Authentication
    ↓
Join Room
    ↓
Realtime Messaging
    ↓
Broadcast to Room
```

---

# Authentication Flow

```txt
User Login
   ↓
Server Verifies Credentials
   ↓
JWT Generated
   ↓
Client Stores Token
   ↓
Protected API Access
```

---

# Redis Usage

Redis is used for:

* Socket scaling
* Pub/Sub communication
* Caching
* Online user tracking
* Rate limiting support

---

# Monitoring Stack

## Prometheus

Collects:

* API metrics
* Request counts
* Socket metrics
* Memory usage
* Latency

## Grafana

Visualizes:

* Active users
* Server load
* Traffic spikes
* Message throughput

---

# Docker Services

The system will eventually run through:

```txt
Frontend
Backend
Redis
MongoDB
Nginx
Prometheus
Grafana
```

---

# Security Features

## Helmet

Protects against:

* XSS
* Clickjacking
* MIME sniffing

## Rate Limiting

Protects against:

* Brute force attacks
* API abuse
* Flooding

## JWT Authentication

Ensures:

* Stateless authentication
* Secure API access

---

# API Endpoints

## Auth Routes

```txt
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

---

# Socket Events

## Room Events

```txt
join_room
leave_room
create_room
```

## Message Events

```txt
send_message
receive_message
typing
stop_typing
```

---

# Development Roadmap

## Phase 1

* Backend setup
* Express architecture
* MongoDB connection
* Authentication APIs

## Phase 2

* Socket.IO integration
* Room system
* Messaging system

## Phase 3

* React frontend
* Chat UI
* Authentication state

## Phase 4

* Redis scaling
* Monitoring
* Dockerization
* Nginx
* Load balancing

---

# Future Improvements

* Message encryption
* File uploads
* Voice/video calls
* Kubernetes deployment
* CI/CD pipeline
* Microservices architecture
* RabbitMQ integration
* Distributed caching

---

# Learning Outcomes

This project teaches:

* Realtime system design
* Scalable backend architecture
* Distributed systems basics
* Production-ready Node.js patterns
* Monitoring and observability
* Infrastructure engineering
* Docker workflows
* Redis architecture

---

# Contributing

Pull requests and improvements are welcome.

---

# License

MIT License

---

# Author

Built for learning advanced backend engineering and system design concepts.
