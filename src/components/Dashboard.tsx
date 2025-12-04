import { Button } from '@/components/ui/button';
import { ScannerStatus } from '@/components/ScannerStatus';
import { SignalCard } from '@/components/SignalCard';
import { ScanStatus } from '@/lib/scanner';
import { SignalResult } from '@/lib/indicators';
import { Play, Square, Zap, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardProps {
  isRunning: boolean;
  status: ScanStatus;
  signals: SignalResult[];
  onStart: () => void;
  onStop: () => void;
}

export function Dashboard({ isRunning, status, signals, onStart, onStop }: DashboardProps) {
  const recentSignals = signals.slice(0, 3);
  const longCount = signals.filter(s => s.direction === 'LONG').length;
  const shortCount = signals.filter(s => s.direction === 'SHORT').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center pt-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap className="w-8 h-8 text-cyan" />
          <h1 className="text-2xl font-bold text-foreground">Crypto Scanner</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Binance & MEXC Sinyal Tarayıcı
        </p>
      </div>

      {/* Main Control Button */}
      <div className="flex justify-center">
        <Button
          variant={isRunning ? 'destructive' : 'scanner'}
          size="xl"
          onClick={isRunning ? onStop : onStart}
          className="w-full max-w-xs"
        >
          {isRunning ? (
            <>
              <Square className="w-5 h-5" />
              Taramayı Durdur
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Taramayı Başlat
            </>
          )}
        </Button>
      </div>

      {/* Scanner Status */}
      <ScannerStatus status={status} isRunning={isRunning} />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 border-l-4 border-l-long">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-long/20">
              <TrendingUp className="w-5 h-5 text-long" />
            </div>
            <div>
              <span className="text-2xl font-bold font-mono text-foreground">{longCount}</span>
              <p className="text-xs text-muted-foreground">LONG Sinyal</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 border-l-4 border-l-short">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-short/20">
              <TrendingDown className="w-5 h-5 text-short" />
            </div>
            <div>
              <span className="text-2xl font-bold font-mono text-foreground">{shortCount}</span>
              <p className="text-xs text-muted-foreground">SHORT Sinyal</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Signals */}
      {recentSignals.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan animate-pulse" />
            Son Sinyaller
          </h2>
          <div className="space-y-3">
            {recentSignals.map((signal, i) => (
              <SignalCard key={`${signal.symbol}-${signal.timestamp}-${i}`} signal={signal} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {signals.length === 0 && (
        <div className="glass-card p-8 text-center">
          <Zap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            Henüz sinyal yok
          </h3>
          <p className="text-muted-foreground text-sm">
            Taramayı başlattığınızda burada sinyaller görünecek
          </p>
        </div>
      )}
    </div>
  );
}
