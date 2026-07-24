import React, { Suspense } from 'react';
import { Routes, Route, Navigate, HashRouter } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DemoController } from './components/DemoController';
import { AIThinkingLoader } from './components/ui';

import { initAccentTheme } from './features/themeEngine';

// Lazy load heavy page components to optimize initial bundle sizes and performance
const Landing = React.lazy(() => import('./pages/Landing').then(m => ({ default: m.Landing })));
const ExecutiveBrief = React.lazy(() => import('./pages/ExecutiveBrief').then(m => ({ default: m.ExecutiveBrief })));
const BusinessSignals = React.lazy(() => import('./pages/BusinessSignals').then(m => ({ default: m.BusinessSignals })));
const StrategyCanvas = React.lazy(() => import('./pages/StrategyCanvas').then(m => ({ default: m.StrategyCanvas })));
const DecisionCopilot = React.lazy(() => import('./pages/DecisionCopilot').then(m => ({ default: m.DecisionCopilot })));
const Forecast = React.lazy(() => import('./pages/Forecast').then(m => ({ default: m.Forecast })));
const Reports = React.lazy(() => import('./pages/Reports').then(m => ({ default: m.Reports })));
const DataExplorer = React.lazy(() => import('./pages/DataExplorer').then(m => ({ default: m.DataExplorer })));
const BusinessTimeline = React.lazy(() => import('./pages/BusinessTimeline').then(m => ({ default: m.BusinessTimeline })));
const Settings = React.lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));

const App: React.FC = () => {
  React.useEffect(() => {
    initAccentTheme();
  }, []);

  return (
    <HashRouter>
      <DemoController />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen bg-[#090B10] text-[#83D18B]">
          <AIThinkingLoader />
        </div>
      }>
        <Routes>
          <Route path="/" element={<Landing />} />
          
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard/brief" replace />} />
            <Route path="brief" element={<ExecutiveBrief />} />
            <Route path="brief/:reportId" element={<Reports />} />
            <Route path="timeline" element={<BusinessTimeline />} />
            <Route path="signals" element={<BusinessSignals />} />
            <Route path="projections" element={<StrategyCanvas />} />
            <Route path="copilot" element={<DecisionCopilot />} />
            <Route path="forecast" element={<Forecast />} />
            <Route path="reports" element={<Reports />} />
            <Route path="explorer" element={<DataExplorer />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
};

export default App;
