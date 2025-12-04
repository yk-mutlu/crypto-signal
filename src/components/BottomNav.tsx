import { LayoutDashboard, Bell, Settings, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tab = 'dashboard' | 'signals' | 'settings';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  signalCount?: number;
}

export function BottomNav({ activeTab, onTabChange, signalCount = 0 }: BottomNavProps) {
  const tabs = [
    { id: 'dashboard' as Tab, label: 'Tarama', icon: Activity },
    { id: 'signals' as Tab, label: 'Sinyaller', icon: Bell, badge: signalCount },
    { id: 'settings' as Tab, label: 'Ayarlar', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border safe-area-bottom">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full relative transition-all duration-200',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <div className="relative">
                <Icon className={cn('w-6 h-6', isActive && 'drop-shadow-[0_0_8px_hsl(var(--primary))]')} />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-short text-[10px] font-bold rounded-full flex items-center justify-center text-destructive-foreground">
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                )}
              </div>
              <span className="text-xs mt-1 font-medium">{tab.label}</span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
