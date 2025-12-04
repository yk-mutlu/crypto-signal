import { SignalCard } from '@/components/SignalCard';
import { SignalResult } from '@/lib/indicators';
import { Button } from '@/components/ui/button';
import { Trash2, TrendingUp, TrendingDown, Filter } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SignalListProps {
  signals: SignalResult[];
  onClear: () => void;
  onSignalClick?: (signal: SignalResult) => void;
}

type FilterType = 'all' | 'long' | 'short';

export function SignalList({ signals, onClear, onSignalClick }: SignalListProps) {
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredSignals = signals.filter(s => {
    if (filter === 'long') return s.direction === 'LONG';
    if (filter === 'short') return s.direction === 'SHORT';
    return true;
  });

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Sinyal Geçmişi</h1>
        {signals.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            <Trash2 className="w-4 h-4 mr-1" />
            Temizle
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={cn(
            'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all',
            filter === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
          )}
        >
          <Filter className="w-4 h-4 inline mr-1" />
          Tümü ({signals.length})
        </button>
        <button
          onClick={() => setFilter('long')}
          className={cn(
            'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all',
            filter === 'long'
              ? 'bg-long text-primary-foreground glow-long'
              : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
          )}
        >
          <TrendingUp className="w-4 h-4 inline mr-1" />
          Long ({signals.filter(s => s.direction === 'LONG').length})
        </button>
        <button
          onClick={() => setFilter('short')}
          className={cn(
            'flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all',
            filter === 'short'
              ? 'bg-short text-destructive-foreground glow-short'
              : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
          )}
        >
          <TrendingDown className="w-4 h-4 inline mr-1" />
          Short ({signals.filter(s => s.direction === 'SHORT').length})
        </button>
      </div>

      {/* Signal List */}
      <div className="space-y-3 pb-20">
        {filteredSignals.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <p className="text-muted-foreground">
              {signals.length === 0
                ? 'Henüz sinyal tespit edilmedi'
                : 'Bu filtreye uygun sinyal yok'}
            </p>
          </div>
        ) : (
          filteredSignals.map((signal, i) => (
            <SignalCard 
              key={`${signal.symbol}-${signal.timestamp}-${i}`} 
              signal={signal}
              onClick={() => onSignalClick?.(signal)}
            />
          ))
        )}
      </div>
    </div>
  );
}
