import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { motion, AnimatePresence } from 'framer-motion';
import { IntelligenceMesh } from '../components/IntelligenceMesh';

export const DashboardLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col h-screen w-screen bg-background overflow-hidden relative">
      <IntelligenceMesh />
      <Topbar />
      <div className="flex flex-1 min-h-0 w-full overflow-hidden relative z-10">
        <Sidebar />
        <main className="flex-1 overflow-y-auto w-full relative grid-bg">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full h-full relative z-10"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};
