import React from 'react';
import { Routes, Route, Navigate, HashRouter } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ExecutiveBrief } from './pages/ExecutiveBrief';
import { BusinessSignals } from './pages/BusinessSignals';
import { StrategyCanvas } from './pages/StrategyCanvas';
import { DecisionCopilot } from './pages/DecisionCopilot';
import { Forecast } from './pages/Forecast';
import { Reports } from './pages/Reports';
import { DataExplorer } from './pages/DataExplorer';
import { BusinessTimeline } from './pages/BusinessTimeline';

const App: React.FC = () => {
  return (
    <HashRouter>
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
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
