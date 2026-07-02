import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';


export const DashboardLayout: React.FC = () => {
  // If database/dataset is not loaded, we shouldn't grant full workspace access yet.
  // In our store we set isDatasetLoaded true by default, but if someone resets it, we route back.
  return (
    <div className="flex flex-col h-screen w-screen bg-background overflow-hidden">
      <Topbar />
      <div className="flex flex-1 min-h-0 w-full overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto w-full relative grid-bg">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
