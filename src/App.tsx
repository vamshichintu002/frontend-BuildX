import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import Dashboard from './pages/Dashboard';
import NewClient from './pages/NewClient';
import Auth from './pages/Auth';
import { Toaster } from 'react-hot-toast';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const App = () => {
  const { isSignedIn } = useAuth();

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* Auth route */}
        <Route 
          path="/auth" 
          element={
            isSignedIn ? <Navigate to="/dashboard" replace /> : <Auth />
          } 
        />
        
        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/new-client" 
          element={
            <ProtectedRoute>
              <NewClient />
            </ProtectedRoute>
          } 
        />
        
        {/* Default and catch-all routes */}
        <Route 
          path="/" 
          element={
            isSignedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/auth" replace />
            )
          } 
        />
        
        <Route 
          path="*" 
          element={
            isSignedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/auth" replace />
            )
          } 
        />
      </Routes>
    </>
  );
};

export default App;