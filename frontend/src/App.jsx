import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from './components/ThemeContext';
import './App.css';
import Navbar from './components/Navbar';
import Manager from './components/Manager';
import About from './components/About';
import Contact from './components/Contact';
import { useAuth } from '@clerk/clerk-react';
import { SignIn, SignUp } from '@clerk/clerk-react';

function ProtectedRoute({ children }) {
  const { isSignedIn, isLoaded } = useAuth();
  const location = useLocation();

  if (!isLoaded) return null; // or a loading spinner

  if (!isSignedIn) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return children;
}

function App() {
  return (
    <ThemeProvider>
      <>
        <Routes>
          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Navbar />
                <Manager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <Navbar />
                <About />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <Navbar />
                <Contact />
              </ProtectedRoute>
            }
          />

          {/* Clerk Auth routes */}
          <Route path="/sign-in/*" element={<SignIn routing="path" path="/sign-in" />} />
          <Route path="/sign-up/*" element={<SignUp routing="path" path="/sign-up" />} />

          {/* Redirect all other routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Toaster
          position="top-center"
          expand={true}
          richColors
          closeButton
          theme="system"
          toastOptions={{
            style: {
              fontSize: '0.95rem',
              padding: '12px',
              maxWidth: '360px'
            },
            actionButtonStyle: {
              fontSize: '1rem',
              padding: '10px 20px',
              fontWeight: '600',
              borderRadius: '6px',
              minWidth: '90px'
            },
            cancelButtonStyle: {
              fontSize: '1rem',
              padding: '10px 20px',
              fontWeight: '600',
              borderRadius: '6px',
              minWidth: '90px'
            },
            description: {
              style: {
                fontSize: '0.9rem'
              }
            }
          }}
        />
      </>
    </ThemeProvider>
  );
}

export default App;