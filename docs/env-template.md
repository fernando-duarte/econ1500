# Environment Variables Template

This document provides a template for the environment variables needed in this project.

## Setup Instructions

1. Create a `.env.local` file in the root of the project
2. Copy the variables below and set appropriate values
3. Never commit your actual `.env` files to the repository

## Required Variables

```
# API Configuration
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Authentication
AUTH_SECRET=your_auth_secret_here

# External Services (uncomment as needed)
# DATABASE_URL=postgres://username:password@localhost:5432/dbname

# Feature Flags
FEATURE_NEW_UI=false
```

## Environment Types

Different environment files can be used for different contexts:

- `.env.local`: For local development (not committed)
- `.env.development`: For development environment (can be committed if no secrets)
- `.env.production`: For production environment (can be committed if no secrets)
- `.env.test`: For test environment (can be committed if no secrets)

## Variable Naming Conventions

- Use `NEXT_PUBLIC_` prefix for variables that need to be accessible in the browser
- Use `UPPERCASE_WITH_UNDERSCORES` for all variable names
- Group related variables with comments

## Security Best Practices

1. Never commit actual secrets or API keys to the repository
2. Use different values for development and production
3. Consider using a secrets manager for production environments
4. Rotate secrets regularly
5. Use placeholder values in templates and documentation
