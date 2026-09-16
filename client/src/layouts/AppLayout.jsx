import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-mesh text-slate-900 dark:text-slate-100">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
