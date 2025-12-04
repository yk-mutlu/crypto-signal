import { SignalResult } from '@/lib/indicators';
import { TrendingUp, TrendingDown, Clock, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SignalCardProps {
  signal: SignalResult;
}

export function SignalCard({ signal }: SignalCardProps) {
  const isLong = signal.direction === 'LONG';
  const timeAgo = getTimeAgo(signal.timestamp);

  return (
    <div
      className={cn(
        'glass-card p-4 animate-fade-in',
        isLong ? 'border-l-4 border-l-long' : 'border-l-4 border-l-short'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'p-2 rounded-lg',
              isLong ? 'bg-long/20' : 'bg-short/20'
            )}
          >
            {isLong ? (
              <TrendingUp className="w-5 h-5 text-long" />
            ) : (
              <TrendingDown className="w-5 h-5 text-short" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'font-bold text-lg',
                  isLong ? 'text-gradient-long' : 'text-gradient-short'
                )}
              >
                {signal.direction}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground uppercase">
                {signal.exchange}
              </span>
            </div>
            <h3 className="font-mono text-xl font-semibold text-foreground">
              {signal.symbol}
            </h3>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <Clock className="w-3 h-3" />
            <span>{timeAgo}</span>
          </div>
          <span className="text-xs px-2 py-1 rounded bg-secondary text-muted-foreground font-mono">
            {signal.timeframe}
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="bg-secondary/50 rounded-lg p-2">
          <span className="text-xs text-muted-foreground block">Fiyat</span>
          <span className="font-mono text-foreground font-semibold">
            ${signal.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="bg-secondary/50 rounded-lg p-2">
          <span className="text-xs text-muted-foreground block">RSI(14)</span>
          <span
            className={cn(
              'font-mono font-semibold',
              signal.rsi >= 50 ? 'text-long' : 'text-short'
            )}
          >
            {signal.rsi.toFixed(1)}
          </span>
        </div>
        <div className="bg-secondary/50 rounded-lg p-2">
          <span className="text-xs text-muted-foreground block">MA200</span>
          <span className="font-mono text-foreground font-semibold">
            ${signal.ma200.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <Activity className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">
          Sinyal gücü: {signal.strength}/3 MA kesişim
        </span>
        <div className="flex gap-1 ml-auto">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(
                'w-2 h-2 rounded-full',
                i <= signal.strength
                  ? isLong
                    ? 'bg-long'
                    : 'bg-short'
                  : 'bg-secondary'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return `${seconds}s önce`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}d önce`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}s önce`;
  return `${Math.floor(seconds / 86400)}g önce`;
}
