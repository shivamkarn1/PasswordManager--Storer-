import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { ThemeProvider } from './components/ThemeContext';
import Navbar from './components/Navbar';
import About from './components/About';
import Contact from './components/Contact';
import Manager from './components/Manager';
import { Toaster } from 'sonner';
import './App.css';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

// Layout component that wraps all routes
function RootLayout() {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <ThemeProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
          <Navbar />
          
          {/* This is where child routes will be rendered */}
          <Outlet />
          
          {/* Sonner Toast Provider */}
          <Toaster 
            theme="light"
            className="toaster group"
            toastOptions={{
              classNames: {
                toast: 'group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-950 group-[.toaster]:border-slate-200 group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-slate-950 dark:group-[.toaster]:text-slate-50 dark:group-[.toaster]:border-slate-800',
                description: 'group-[.toast]:text-slate-500 dark:group-[.toast]:text-slate-400',
                actionButton: 'group-[.toast]:bg-slate-900 group-[.toast]:text-slate-50 dark:group-[.toast]:bg-slate-50 dark:group-[.toast]:text-slate-900',
                cancelButton: 'group-[.toast]:bg-slate-100 group-[.toast]:text-slate-500 dark:group-[.toast]:bg-slate-800 dark:group-[.toast]:text-slate-400',
              },
            }}
            position="top-right"
            expand={false}
            richColors
          />
        </div>
      </ThemeProvider>
    </ClerkProvider>
  );
}

// Create router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Manager />
      },
      {
        path: "/about",
        element: <About />
      },
      {
        path: "/contact", 
        element: <Contact />
      },
      {
        path: "/manager",
        element: <Manager />
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;