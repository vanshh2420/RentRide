import React from 'react';
import { Outlet } from 'react-router-dom';
import { CustomerNavbar } from './CustomerNavbar';
import { Footer } from './Footer';
import { AiRentalAssistant } from '../features/ai/AiRentalAssistant';
import { MobileBottomNav } from '../components/navigation/MobileBottomNav';

export const CustomerLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 dark:bg-[#070b14] text-slate-900 dark:text-slate-100 relative pb-16 md:pb-0">
      <CustomerNavbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      {/* Conversational AI Rental Assistant */}
      <AiRentalAssistant />
      {/* Mobile Bottom Bar */}
      <MobileBottomNav />
    </div>
  );
};

export default CustomerLayout;
