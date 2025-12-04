import { useState, useEffect } from 'react';
import { useScanner } from '@/hooks/useScanner';
import { useFavorites } from '@/hooks/useFavorites';
import { BottomNav } from '@/components/BottomNav';
import { Dashboard } from '@/components/Dashboard';
import { SignalList } from '@/components/SignalList';
import { Settings } from '@/components/Settings';
import { SignalDetail } from '@/components/SignalDetail';
import { FavoritesList } from '@/components/FavoritesList';
import { SignalResult } from '@/lib/indicators';

type Tab = 'dashboard' | 'signals' | 'settings' | 'favorites';

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [selectedSignal, setSelectedSignal] = useState<SignalResult | null>(null);
  
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

  const {
    favorites,
    favoritesOnly,
    toggleFavorite,
    setFavoritesOnlyMode,
    isFavorite,
    allPairs,
    getPairsToScan,
  } = useFavorites();

  // Update scanner with favorites when favoritesOnly changes
  useEffect(() => {
    if (favoritesOnly && favorites.length > 0) {
      updateConfig({ customPairs: favorites });
    } else {
      updateConfig({ customPairs: undefined });
    }
  }, [favoritesOnly, favorites, updateConfig]);

  const todaySignals = signals.filter(
    (s) => Date.now() - s.timestamp < 24 * 60 * 60 * 1000
  );

  const handleSignalClick = (signal: SignalResult) => {
    setSelectedSignal(signal);
  };

  const handleBackFromDetail = () => {
    setSelectedSignal(null);
  };

  // If a signal is selected, show detail view
  if (selectedSignal) {
    return (
      <div className="min-h-screen bg-background">
        <main className="px-4 pb-24 pt-2 max-w-lg mx-auto">
          <SignalDetail
            signal={selectedSignal}
            isFavorite={isFavorite(selectedSignal.symbol)}
            onBack={handleBackFromDetail}
            onToggleFavorite={toggleFavorite}
          />
        </main>
        <BottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          signalCount={todaySignals.length}
          favoritesCount={favorites.length}
        />
      </div>
    );
  }

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
            onSignalClick={handleSignalClick}
          />
        )}
        {activeTab === 'signals' && (
          <SignalList 
            signals={signals} 
            onClear={clearSignals} 
            onSignalClick={handleSignalClick}
          />
        )}
        {activeTab === 'favorites' && (
          <FavoritesList
            favorites={favorites}
            favoritesOnly={favoritesOnly}
            allPairs={allPairs}
            onToggleFavorite={toggleFavorite}
            onSetFavoritesOnly={setFavoritesOnlyMode}
          />
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
        favoritesCount={favorites.length}
      />
    </div>
  );
};

export default Index;
