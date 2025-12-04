import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, IChartApi, CandlestickSeries, Time } from 'lightweight-charts';
import { fetchBinanceKlines } from '@/lib/api';
import { Candle } from '@/lib/indicators';

interface PriceChartProps {
  symbol: string;
  timeframe: '1h' | '15m';
}

export function PriceChart({ symbol, timeframe }: PriceChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#a1a1aa',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 300,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      crosshair: {
        vertLine: {
          color: 'rgba(0, 247, 255, 0.3)',
          labelBackgroundColor: '#00f7ff',
        },
        horzLine: {
          color: 'rgba(0, 247, 255, 0.3)',
          labelBackgroundColor: '#00f7ff',
        },
      },
    });

    chartRef.current = chart;

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderUpColor: '#22c55e',
      borderDownColor: '#ef4444',
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });

    // Load data
    const loadData = async () => {
      setLoading(true);
      const candles = await fetchBinanceKlines(symbol, timeframe);
      
      if (candles.length > 0) {
        const chartData = candles.map((c: Candle) => ({
          time: (c.time / 1000) as Time,
          open: c.open,
          high: c.high,
          low: c.low,
          close: c.close,
        }));
        candlestickSeries.setData(chartData);
        chart.timeScale().fitContent();
      }
      setLoading(false);
    };

    loadData();

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [symbol, timeframe]);

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-card/50 z-10">
          <div className="animate-pulse text-muted-foreground">Yükleniyor...</div>
        </div>
      )}
      <div ref={chartContainerRef} className="w-full" />
    </div>
  );
}
