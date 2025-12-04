import { ScanStatus } from '@/lib/scanner';
import { Activity, Wifi, Clock, Signal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScannerStatusProps {
  status: ScanStatus;
  isRunning: boolean;
}

export function ScannerStatus({ status, isRunning }: ScannerStatusProps) {
  const progress = status.totalPairs > 0 
    ? (status.scannedCount / status.totalPairs) * 100 
    : 0;

  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={cn(
            'w-3 h-3 rounded-full',
            isRunning ? 'bg-long animate-pulse' : 'bg-muted-foreground'
          )} />
          <span className="font-medium text-foreground">
            {isRunning ? 'Tarama Aktif' : 'Tarama Durduruldu'}
          </span>
        </div>
        {status.isScanning && (
          <span className="text-xs text-muted-foreground font-mono animate-scan">
            {status.currentPair}
          </span>
        )}
      </div>

      {status.isScanning && (
        <div className="mb-4">
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan to-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>{status.scannedCount} / {status.totalPairs}</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-secondary/50 rounded-lg p-3 text-center">
          <Wifi className="w-4 h-4 mx-auto mb-1 text-cyan" />
          <span className="text-xs text-muted-foreground block">Tarama</span>
          <span className="font-mono text-foreground">
            {status.totalPairs}
          </span>
        </div>
        <div className="bg-secondary/50 rounded-lg p-3 text-center">
          <Signal className="w-4 h-4 mx-auto mb-1 text-long" />
          <span className="text-xs text-muted-foreground block">Sinyal</span>
          <span className="font-mono text-foreground">
            {status.signalsFound}
          </span>
        </div>
        <div className="bg-secondary/50 rounded-lg p-3 text-center">
          <Clock className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
          <span className="text-xs text-muted-foreground block">Son</span>
          <span className="font-mono text-foreground text-sm">
            {status.lastScanTime ? formatTime(status.lastScanTime) : '--:--'}
          </span>
        </div>
      </div>
    </div>
  );
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
