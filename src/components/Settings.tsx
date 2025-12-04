import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { ScannerConfig } from '@/lib/scanner';
import {
  Bell,
  Volume2,
  TrendingUp,
  TrendingDown,
  Clock,
  Wifi,
  Info,
  Smartphone,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsProps {
  config: ScannerConfig;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  onConfigChange: (config: Partial<ScannerConfig>) => void;
  onEnableNotifications: () => Promise<boolean>;
  onSoundChange: (enabled: boolean) => void;
}

export function Settings({
  config,
  notificationsEnabled,
  soundEnabled,
  onConfigChange,
  onEnableNotifications,
  onSoundChange,
}: SettingsProps) {
  const scanIntervals = [
    { value: 15, label: '15 saniye' },
    { value: 30, label: '30 saniye' },
    { value: 60, label: '1 dakika' },
    { value: 120, label: '2 dakika' },
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <h1 className="text-xl font-bold text-foreground">Ayarlar</h1>

      {/* Notification Settings */}
      <div className="glass-card p-4 space-y-4">
        <h2 className="font-semibold text-foreground flex items-center gap-2">
          <Bell className="w-5 h-5 text-cyan" />
          Bildirim Ayarları
        </h2>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Smartphone className="w-5 h-5 text-muted-foreground" />
            <div>
              <span className="text-foreground">Push Bildirimleri</span>
              <p className="text-xs text-muted-foreground">
                {notificationsEnabled ? 'Aktif' : 'Kapalı'}
              </p>
            </div>
          </div>
          {notificationsEnabled ? (
            <div className="text-xs text-long bg-long/20 px-2 py-1 rounded">
              Aktif
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={onEnableNotifications}>
              Etkinleştir
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Volume2 className="w-5 h-5 text-muted-foreground" />
            <div>
              <span className="text-foreground">Ses Efektleri</span>
              <p className="text-xs text-muted-foreground">Sinyal sesi çal</p>
            </div>
          </div>
          <Switch checked={soundEnabled} onCheckedChange={onSoundChange} />
        </div>
      </div>

      {/* Signal Settings */}
      <div className="glass-card p-4 space-y-4">
        <h2 className="font-semibold text-foreground flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-long" />
          Sinyal Türleri
        </h2>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded bg-long/20">
              <TrendingUp className="w-4 h-4 text-long" />
            </div>
            <div>
              <span className="text-foreground">LONG Sinyalleri</span>
              <p className="text-xs text-muted-foreground">RSI ≥ 50, Price &gt; MA200</p>
            </div>
          </div>
          <Switch
            checked={config.enableLong}
            onCheckedChange={(checked) => onConfigChange({ enableLong: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded bg-short/20">
              <TrendingDown className="w-4 h-4 text-short" />
            </div>
            <div>
              <span className="text-foreground">SHORT Sinyalleri</span>
              <p className="text-xs text-muted-foreground">RSI ≤ 50, Price &lt; MA200</p>
            </div>
          </div>
          <Switch
            checked={config.enableShort}
            onCheckedChange={(checked) => onConfigChange({ enableShort: checked })}
          />
        </div>
      </div>

      {/* Timeframe Settings */}
      <div className="glass-card p-4 space-y-4">
        <h2 className="font-semibold text-foreground flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan" />
          Zaman Dilimleri
        </h2>

        <div className="flex gap-3">
          <button
            onClick={() => {
              const has15m = config.timeframes.includes('15m');
              onConfigChange({
                timeframes: has15m
                  ? config.timeframes.filter((t) => t !== '15m')
                  : [...config.timeframes, '15m'],
              });
            }}
            className={cn(
              'flex-1 py-3 rounded-lg font-mono text-sm font-semibold transition-all',
              config.timeframes.includes('15m')
                ? 'bg-primary text-primary-foreground glow-cyan'
                : 'bg-secondary text-muted-foreground'
            )}
          >
            15M
          </button>
          <button
            onClick={() => {
              const has1h = config.timeframes.includes('1h');
              onConfigChange({
                timeframes: has1h
                  ? config.timeframes.filter((t) => t !== '1h')
                  : [...config.timeframes, '1h'],
              });
            }}
            className={cn(
              'flex-1 py-3 rounded-lg font-mono text-sm font-semibold transition-all',
              config.timeframes.includes('1h')
                ? 'bg-primary text-primary-foreground glow-cyan'
                : 'bg-secondary text-muted-foreground'
            )}
          >
            1H
          </button>
        </div>
      </div>

      {/* Scan Interval */}
      <div className="glass-card p-4 space-y-4">
        <h2 className="font-semibold text-foreground flex items-center gap-2">
          <Wifi className="w-5 h-5 text-cyan" />
          Tarama Sıklığı
        </h2>

        <div className="grid grid-cols-2 gap-2">
          {scanIntervals.map((interval) => (
            <button
              key={interval.value}
              onClick={() => onConfigChange({ scanInterval: interval.value })}
              className={cn(
                'py-3 rounded-lg text-sm font-medium transition-all',
                config.scanInterval === interval.value
                  ? 'bg-primary text-primary-foreground glow-cyan'
                  : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
              )}
            >
              {interval.label}
            </button>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="glass-card p-4 border-l-4 border-l-cyan">
        <div className="flex gap-3">
          <Info className="w-5 h-5 text-cyan flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-foreground font-medium mb-1">Sinyal Kriterleri</p>
            <ul className="text-muted-foreground space-y-1 text-xs">
              <li>• RSI(14) ≥ 50 (LONG) veya ≤ 50 (SHORT)</li>
              <li>• Fiyat MA200'ün üzerinde (LONG) veya altında (SHORT)</li>
              <li>• Fiyat MA5, MA13, MA34'ü aynı anda kesiyor</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
