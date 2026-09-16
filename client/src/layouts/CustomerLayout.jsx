import React from 'react';
import { Outlet } from 'react-router-dom';
import { CustomerNavbar } from './CustomerNavbar';
import { Footer } from './Footer';
import { AiRentalAssistant } from '../features/ai/AiRentalAssistant';

export const CustomerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-mesh text-slate-900 dark:text-slate-100 relative">
      <CustomerNavbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      {/* Feature D: Conversational AI Rental Assistant */}
      <AiRentalAssistant />
    </div>
  );
};
