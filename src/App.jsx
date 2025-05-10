import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
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
          <Toaster 
            position="top-center"
            expand={true}
            richColors
            theme="light"
          />
        </>
      ),
    },
    {
      path: '/about',
      element: (
        <>
          <Navbar />
          <About />
          <Toaster 
            position="top-center"
            expand={true}
            richColors
            theme="light"
          />
        </>
      ),
    },
    {
      path: '/contact',
      element: (
        <>
          <Navbar />
          <Contact />
          <Toaster 
            position="top-center"
            expand={true}
            richColors
            theme="light"
          />
        </>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;