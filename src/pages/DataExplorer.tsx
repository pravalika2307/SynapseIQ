import React, { useState } from 'react';
import { 
  Button, 
  Card, 
  Badge, 
  Input, 
  Dropdown, 
  SectionHeader, 
  MetricCard, 
  ChartContainer 
} from '../components/ui';
import { 
  Play, 
  Plus, 
  Search, 
  MoreVertical, 
  Eye,
  Database
} from 'lucide-react';

import { DeveloperDatasetTester } from '../components/DeveloperDatasetTester';

export const DataExplorer: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');

  const [statusMsg, setStatusMsg] = useState('');

  const sampleDropdownItems = [
    { id: 'view', label: 'View Profile', icon: <Eye size={14} />, onClick: () => setStatusMsg('Viewing node details profile...') },
    { id: 'add', label: 'Assign Tag', icon: <Plus size={14} />, onClick: () => setStatusMsg('Classification tags updated.') },
  ];

  const handleValidation = () => {
    if (!inputValue) {
      setInputError('Intake record lookup identifier is required.');
      setStatusMsg('');
    } else {
      setInputError('');
      setStatusMsg(`Verified record token: ${inputValue}`);
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-8 md:px-12 py-10 flex flex-col gap-8 md:gap-10 font-sans">
      {/* Title */}
      <SectionHeader 
        label="Design System Playground"
        title="SynapseIQ Component Explorer"
        description="A showcase of the premium, high-fidelity atomic UI foundation engineered for Google Cloud and Linear aesthetics."
      />

      {/* Internal Developer Testing Utility */}
      <DeveloperDatasetTester />

      {/* Spacing & Rhythm Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        
        {/* Buttons section */}
        <Card elevation="flat" className="p-5 md:p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="text-14 font-semibold text-white/90">Atomic Buttons</h3>
            <Badge variant="sage">interactive</Badge>
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" size="sm">Primary Small</Button>
              <Button variant="primary" size="md">Primary Medium</Button>
              <Button variant="primary" size="lg">Primary Large</Button>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" size="sm">Secondary Small</Button>
              <Button variant="secondary" size="md">Secondary Medium</Button>
              <Button variant="secondary" size="lg">Secondary Large</Button>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button variant="ghost" size="sm">Ghost Small</Button>
              <Button variant="critical" size="sm">Critical</Button>
              <Button variant="warn" size="sm">Warning</Button>
            </div>

            <Button variant="primary" fullWidth className="gap-2">
              <Play size={14} /> Full Width Primary Button
            </Button>
          </div>
        </Card>

        {/* Inputs & Dropdowns */}
        <Card elevation="flat" className="p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="text-14 font-semibold text-white/90">Inputs & Dropdowns</h3>
            <Badge variant="neutral">atomic</Badge>
          </div>

          <div className="space-y-4">
            <Input 
              icon={<Search size={14} />} 
              placeholder="Search index entries..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              error={inputError}
            />

            <div className="flex gap-4">
              <Button variant="secondary" size="md" onClick={handleValidation}>
                Trigger Error Validation
              </Button>

              <Dropdown 
                trigger={
                  <Button variant="secondary" className="gap-2">
                    Actions Menu <MoreVertical size={14} />
                  </Button>
                }
                items={sampleDropdownItems}
                align="left"
              />
            </div>
            {statusMsg && (
              <p className="text-12 text-[#83D18B] font-mono border-t border-white/5 pt-2">{statusMsg}</p>
            )}
          </div>
        </Card>

        {/* Badges & Flags */}
        <Card elevation="flat" className="p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h3 className="text-14 font-semibold text-white/90">Status Badges</h3>
            <Badge variant="neutral">Flags</Badge>
          </div>

          <div className="flex flex-wrap gap-3">
            <Badge variant="sage">Optimized</Badge>
            <Badge variant="critical">Critical Risk</Badge>
            <Badge variant="warn">Solvency Alert</Badge>
            <Badge variant="neutral">Draft Briefing</Badge>
          </div>
        </Card>

        {/* Metric Cards Showcases */}
        <div className="grid grid-cols-2 gap-4">
          <MetricCard 
            label=" Wafer Yield Rate"
            value="99.4%"
            trend={{ value: '↑ 0.8% peak', type: 'up' }}
          />

          <MetricCard 
            label="Port Transit Latency"
            value="32 days"
            trend={{ value: '↓ 4d backlog', type: 'down' }}
          />
        </div>
      </div>

      {/* Chart Container mockup */}
      <ChartContainer 
        title="Interactive Sandbox Telemetry" 
        subtitle="Historical waiver log comparison index"
      >
        <div className="h-44 bg-white/[0.01] border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-center p-6 gap-3">
          <Database size={24} className="text-white/20" />
          <span className="text-12 text-white/40 max-w-sm leading-relaxed">
            Data Explorer chart canvas mounts here. Ready to render optimized SVG telemetry metrics.
          </span>
        </div>
      </ChartContainer>
    </div>
  );
};
