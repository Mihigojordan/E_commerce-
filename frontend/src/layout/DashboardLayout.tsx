import React, { useState } from 'react';

import Header from '../components/dashboard/Header';

import Sidebar from '../components/dashboard/Sidebar';

import { Outlet, useOutletContext } from 'react-router-dom';
import type { OutletContextType } from '../router';

const DashboardLayout = () => {

    const [isOpen, setIsOpen] = useState(false)
 
  const onToggle = () => {
    setIsOpen(!isOpen)
  }
  const context = useOutletContext<OutletContextType>();

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar onToggle={onToggle} isOpen={isOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onToggle={onToggle} />
        <main className="flex-1 overflow-y-auto">
         <Outlet context={context} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;