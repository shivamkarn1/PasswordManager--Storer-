import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from './components/ThemeContext';
import './App.css';
import Navbar from './components/Navbar';
import Manager from './components/Manager';
import About from './components/About';
import Contact from './components/Contact';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <>
          <Navbar />
          <Manager />
        </>
      ),
    },
    {
      path: '/about',
      element: (
        <>
          <Navbar />
          <About />
        </>
      ),
    },
    {
      path: '/contact',
      element: (
        <>
          <Navbar />
          <Contact />
        </>
      ),
    },
  ]);

  return (
    <ThemeProvider>
      <>
        <RouterProvider router={router} />
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