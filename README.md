# ShopCustomerManager

A web-based customer management application built using React, Django REST Framework, PostgreSQL, Redis, and Docker.

## Overview

ShopCustomerManager helps shopkeepers manage customer records and track payment-related information through a web interface.

## Features

- User registration and login
- JWT-based authentication (if configured in the application)
- Customer record management
- Store customer name, phone number, account number, bank name, and amount
- Payment method and transaction details
- Customer-specific data access
- REST API backend
- PostgreSQL database
- Docker-based development environment
- Redis integration

## Tech Stack

**Frontend**
- React
- JavaScript
- HTML and CSS

**Backend**
- Python
- Django
- Django REST Framework

**Database and Services**
- PostgreSQL
- Redis
- Docker and Docker Compose

## Project Structure

```text
ShopCustomerManager/
├── backend/
├── frontend/
├── nginx/
├── .env.example
├── .gitignore
├── compose.yaml
└── README.md
```

## Prerequisites

Install the following tools before running the project:

- Python
- Node.js and npm
- Docker Desktop
- Git

## Local Setup

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd ShopCustomerManager
```

### 2. Configure environment variables

Create a local `.env` file using `.env.example` as a reference. Set your Django secret key, database credentials, and other required configuration values.

**Never commit your actual `.env` file or passwords to GitHub.**

### 3. Start the services

```bash
docker compose up --build -d
```

### 4. Apply database migrations

```bash
docker compose exec backend python manage.py migrate
```

### 5. Access the application

- Frontend: http://localhost:5173
- Backend: http://localhost:8001

These URLs assume the current development configuration in `compose.yaml`.

## Environment Configuration

Keep sensitive values in environment variables, including:

- Django `SECRET_KEY`
- Database name, username, and password
- Debug and allowed-host settings
- Frontend API base URL

Use different configuration values for local development and production deployment.

## Deployment

The planned deployment environment is an Ubuntu virtual machine running Docker Compose, with a custom domain and HTTPS configured through a reverse proxy.

Domain: `shopmanager.co.in`

## Security Notes

- Do not commit secrets or database credentials.
- Use HTTPS in production.
- Disable Django debug mode in production.
- Restrict database access to trusted services.
- Ensure authenticated users can access only their own customer records.

## License

No license has been specified yet. All rights are reserved by default unless a license is added.

## Author

**Dhiraj Pal**
