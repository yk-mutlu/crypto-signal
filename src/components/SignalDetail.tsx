import { ArrowLeft, TrendingUp, TrendingDown, Star, Clock, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SignalResult } from '@/lib/indicators';
import { PriceChart } from './PriceChart';
import { useState } from 'react';

interface SignalDetailProps {
  signal: SignalResult;
  isFavorite: boolean;
  onBack: () => void;
  onToggleFavorite: (symbol: string) => void;
}

export function SignalDetail({ signal, isFavorite, onBack, onToggleFavorite }: SignalDetailProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1h' | '15m'>(signal.timeframe);
  const isLong = signal.direction === 'LONG';

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Geri
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onToggleFavorite(signal.symbol)}
          className={isFavorite ? 'text-yellow-500' : 'text-muted-foreground'}
        >
          <Star className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </Button>
      </div>

      {/* Signal Info Card */}
      <Card className="glass-card p-4 border-border/50">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isLong ? 'bg-long/20' : 'bg-short/20'}`}>
              {isLong ? (
                <TrendingUp className="w-6 h-6 text-long" />
              ) : (
                <TrendingDown className="w-6 h-6 text-short" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold font-mono">{signal.symbol}</h1>
              <p className="text-sm text-muted-foreground capitalize">{signal.exchange}</p>
            </div>
          </div>
          <Badge
            variant={isLong ? 'default' : 'destructive'}
            className={`text-sm font-semibold ${
              isLong ? 'bg-long/20 text-long border-long/30' : 'bg-short/20 text-short border-short/30'
            }`}
          >
            {signal.direction}
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Fiyat</p>
            <p className="font-mono font-semibold text-lg">${signal.price.toLocaleString()}</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">RSI (14)</p>
            <p className={`font-mono font-semibold text-lg ${
              signal.rsi >= 70 ? 'text-short' : signal.rsi <= 30 ? 'text-long' : 'text-foreground'
            }`}>
              {signal.rsi.toFixed(1)}
            </p>
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Zaman Dilimi</p>
            <p className="font-mono font-semibold text-lg">{signal.timeframe}</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Zaman
            </p>
            <p className="font-mono text-sm">
              {new Date(signal.timestamp).toLocaleTimeString('tr-TR')}
            </p>
          </div>
        </div>

        {/* Moving Averages */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Hareketli Ortalamalar</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'MA5', value: signal.ma5 },
              { label: 'MA13', value: signal.ma13 },
              { label: 'MA34', value: signal.ma34 },
              { label: 'MA200', value: signal.ma200 },
            ].map(({ label, value }) => (
              <div key={label} className="bg-muted/20 rounded px-2 py-1">
                <span className="text-xs text-muted-foreground">{label}: </span>
                <span className="text-xs font-mono">${value.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Chart Section */}
      <Card className="glass-card p-4 border-border/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan" />
            <span className="font-semibold">Fiyat Grafiği</span>
          </div>
          <div className="flex gap-1">
            {(['15m', '1h'] as const).map((tf) => (
              <Button
                key={tf}
                size="sm"
                variant={selectedTimeframe === tf ? 'default' : 'ghost'}
                className={`text-xs ${
                  selectedTimeframe === tf
                    ? 'bg-cyan/20 text-cyan border border-cyan/30'
                    : 'text-muted-foreground'
                }`}
                onClick={() => setSelectedTimeframe(tf)}
              >
                {tf}
              </Button>
            ))}
          </div>
        </div>
        <PriceChart symbol={signal.symbol} timeframe={selectedTimeframe} />
      </Card>

      {/* Signal Criteria */}
      <Card className="glass-card p-4 border-border/50">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <span className={isLong ? 'text-long' : 'text-short'}>●</span>
          Sinyal Kriterleri
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <span className="text-long">✓</span>
            RSI(14) {isLong ? '≥ 50' : '≤ 50'} ({signal.rsi.toFixed(1)})
          </li>
          <li className="flex items-center gap-2">
            <span className="text-long">✓</span>
            Close {isLong ? '>' : '<'} MA200 (${signal.ma200.toFixed(2)})
          </li>
          <li className="flex items-center gap-2">
            <span className="text-long">✓</span>
            MA5-MA13-MA34 {isLong ? 'yukarı' : 'aşağı'} kesişim
          </li>
        </ul>
      </Card>
    </div>
  );
}
