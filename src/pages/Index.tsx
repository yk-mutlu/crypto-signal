import { useState } from 'react';
import { useScanner } from '@/hooks/useScanner';
import { BottomNav } from '@/components/BottomNav';
import { Dashboard } from '@/components/Dashboard';
import { SignalList } from '@/components/SignalList';
import { Settings } from '@/components/Settings';

type Tab = 'dashboard' | 'signals' | 'settings';

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const {
    isRunning,
    status,
    signals,
    config,
    notificationsEnabled,
    soundEnabled,
    startScanner,
    stopScanner,
    updateConfig,
    enableNotifications,
    setSoundEnabled,
    clearSignals,
  } = useScanner();

  const todaySignals = signals.filter(
    (s) => Date.now() - s.timestamp < 24 * 60 * 60 * 1000
  );

  return (
    <div className="min-h-screen bg-background">
      <main className="px-4 pb-24 pt-2 max-w-lg mx-auto">
        {activeTab === 'dashboard' && (
          <Dashboard
            isRunning={isRunning}
            status={status}
            signals={signals}
            onStart={startScanner}
            onStop={stopScanner}
          />
        )}
        {activeTab === 'signals' && (
          <SignalList signals={signals} onClear={clearSignals} />
        )}
        {activeTab === 'settings' && (
          <Settings
            config={config}
            notificationsEnabled={notificationsEnabled}
            soundEnabled={soundEnabled}
            onConfigChange={updateConfig}
            onEnableNotifications={enableNotifications}
            onSoundChange={setSoundEnabled}
          />
        )}
      </main>

      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        signalCount={todaySignals.length}
      />
    </div>
  );
};

export default Index;
