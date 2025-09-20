import React, { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { ThemeProvider } from './components/ThemeContext';
import Navbar from './components/Navbar';
import About from './components/About';
import Contact from './components/Contact';
import Manager from './components/Manager';
import LoadingScreen from './components/LoadingScreen';
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
            className="toaster toaster--center group"
            toastOptions={{
              classNames: {
                toast: 'group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-950 group-[.toaster]:border-slate-200 group-[.toaster]:shadow-lg dark:group-[.toaster]:bg-slate-950 dark:group-[.toaster]:text-slate-50 dark:group-[.toaster]:border-slate-800',
                description: 'group-[.toast]:text-slate-500 dark:group-[.toast]:text-slate-400',
                actionButton: 'group-[.toast]:bg-slate-900 group-[.toast]:text-slate-50 dark:group-[.toast]:bg-slate-50 dark:group-[.toast]:text-slate-900',
                cancelButton: 'group-[.toast]:bg-slate-100 group-[.toast]:text-slate-500 dark:group-[.toast]:bg-slate-800 dark:group-[.toast]:text-slate-400',
              },
            }}
            position="bottom-center"
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
  const [isLoading, setIsLoading] = useState(false);
  const [shouldShowLoading, setShouldShowLoading] = useState(false);

  useEffect(() => {
    // Function to detect if this is a fresh browser session vs refresh
    const detectFreshSession = () => {
      // Check if sessionStorage has our flag
      const hasShownInThisSession = sessionStorage.getItem('hasShownLoadingInSession');
      
      // Also check navigation type to distinguish between fresh open and refresh
      const navigationType = performance.getEntriesByType('navigation')[0]?.type;
      
      // Show loading if:
      // 1. Haven't shown in this session AND
      // 2. It's not a reload (refresh)
      if (!hasShownInThisSession && navigationType !== 'reload') {
        return true;
      }
      
      return false;
    };

    const shouldShow = detectFreshSession();
    
    if (shouldShow) {
      // Show loading screen
      setShouldShowLoading(true);
      setIsLoading(true);
      
      // Mark as shown for this session
      sessionStorage.setItem('hasShownLoadingInSession', 'true');
      
      // Hide loading after 2.5 seconds
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2500);

      return () => clearTimeout(timer);
    } else {
      // Skip loading screen
      setIsLoading(false);
      setShouldShowLoading(false);
    }
  }, []);

  // Show loading screen if conditions are met
  if (shouldShowLoading && isLoading) {
    return <LoadingScreen />;
  }

  return <RouterProvider router={router} />;
}

// Development helper function
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.resetLoadingForTesting = () => {
    sessionStorage.removeItem('hasShownLoadingInSession');
    console.log('Loading screen reset for this session. Refresh to test.');
  };
}

export default App;