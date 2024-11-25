# Investo - Investment Portfolio Management System

## Overview
Investo is a modern web application built with React, TypeScript, and Supabase that helps financial advisors manage their clients' investment portfolios. The system provides a user-friendly interface for client management, portfolio analysis, and investment tracking.

## Features
- **Secure Authentication**: Powered by Clerk for robust user authentication
- **Client Management**: Add and manage client profiles
- **Portfolio Analytics**: Visual representation of investment portfolios
- **Risk Analysis**: Comprehensive risk assessment tools
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Tech Stack
- **Frontend**:
  - React 18
  - TypeScript
  - Vite
  - Tailwind CSS
  - Material-UI
  - Framer Motion
  - Recharts
  - Lucide Icons

- **Backend**:
  - Supabase (Database)
  - Clerk (Authentication)

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- Clerk account

## Environment Variables
Create a `.env` file in the root directory with the following variables:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_CLERK_SECRET_KEY=your_clerk_secret_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Installation
1. Clone the repository:
```bash
git clone https://github.com/vamshichintu002/frontend-BuildX
cd project
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Project Structure
```
project/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   ├── types/         # TypeScript type definitions
│   └── App.tsx        # Main application component
├── public/           # Static assets
└── vite.config.ts    # Vite configuration
```

## Key Components
- **Dashboard**: Main interface for managing clients and viewing analytics
- **NewClient**: Form for adding new clients
- **Analytics**: Detailed portfolio analysis and visualization
- **ProtectedRoute**: Route protection for authenticated users

## Deployment
The application can be deployed using platforms like Netlify or Vercel. Make sure to:
1. Configure environment variables in your deployment platform
2. Set up build commands and directory
3. Configure client-side routing

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

