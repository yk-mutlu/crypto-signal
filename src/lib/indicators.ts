// Technical Analysis Indicators

export interface Candle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

// Simple Moving Average
export function calculateSMA(data: number[], period: number): number[] {
  const sma: number[] = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      sma.push(0);
      continue;
    }
    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += data[i - j];
    }
    sma.push(sum / period);
  }
  return sma;
}

// RSI Calculation
export function calculateRSI(closes: number[], period: number = 14): number[] {
  const rsi: number[] = [];
  const gains: number[] = [];
  const losses: number[] = [];

  for (let i = 0; i < closes.length; i++) {
    if (i === 0) {
      gains.push(0);
      losses.push(0);
      rsi.push(50);
      continue;
    }

    const change = closes[i] - closes[i - 1];
    gains.push(change > 0 ? change : 0);
    losses.push(change < 0 ? Math.abs(change) : 0);

    if (i < period) {
      rsi.push(50);
      continue;
    }

    let avgGain = 0;
    let avgLoss = 0;

    if (i === period) {
      for (let j = 1; j <= period; j++) {
        avgGain += gains[j];
        avgLoss += losses[j];
      }
      avgGain /= period;
      avgLoss /= period;
    } else {
      const prevRsiIndex = rsi.length - 1;
      avgGain = (gains.slice(-period).reduce((a, b) => a + b, 0)) / period;
      avgLoss = (losses.slice(-period).reduce((a, b) => a + b, 0)) / period;
    }

    if (avgLoss === 0) {
      rsi.push(100);
    } else {
      const rs = avgGain / avgLoss;
      rsi.push(100 - (100 / (1 + rs)));
    }
  }

  return rsi;
}

// MA Cross Detection
export function detectCrossover(
  price: number,
  prevPrice: number,
  ma: number,
  prevMa: number
): 'up' | 'down' | null {
  if (prevPrice <= prevMa && price > ma) return 'up';
  if (prevPrice >= prevMa && price < ma) return 'down';
  return null;
}

// Check all MA crossovers at once
export function checkMACrossover(
  closes: number[],
  ma5: number[],
  ma13: number[],
  ma34: number[]
): { direction: 'up' | 'down' | null; strength: number } {
  const lastIdx = closes.length - 1;
  const prevIdx = lastIdx - 1;

  if (lastIdx < 1) return { direction: null, strength: 0 };

  const cross5 = detectCrossover(closes[lastIdx], closes[prevIdx], ma5[lastIdx], ma5[prevIdx]);
  const cross13 = detectCrossover(closes[lastIdx], closes[prevIdx], ma13[lastIdx], ma13[prevIdx]);
  const cross34 = detectCrossover(closes[lastIdx], closes[prevIdx], ma34[lastIdx], ma34[prevIdx]);

  let upCount = 0;
  let downCount = 0;

  if (cross5 === 'up') upCount++;
  if (cross13 === 'up') upCount++;
  if (cross34 === 'up') upCount++;
  if (cross5 === 'down') downCount++;
  if (cross13 === 'down') downCount++;
  if (cross34 === 'down') downCount++;

  if (upCount >= 2) return { direction: 'up', strength: upCount };
  if (downCount >= 2) return { direction: 'down', strength: downCount };
  return { direction: null, strength: 0 };
}

export interface SignalResult {
  symbol: string;
  exchange: 'binance' | 'mexc';
  timeframe: '1h' | '15m';
  direction: 'LONG' | 'SHORT';
  rsi: number;
  price: number;
  ma5: number;
  ma13: number;
  ma34: number;
  ma200: number;
  timestamp: number;
  strength: number;
}

export function analyzeSignal(
  candles: Candle[],
  symbol: string,
  exchange: 'binance' | 'mexc',
  timeframe: '1h' | '15m'
): SignalResult | null {
  if (candles.length < 200) return null;

  const closes = candles.map(c => c.close);
  
  const ma5 = calculateSMA(closes, 5);
  const ma13 = calculateSMA(closes, 13);
  const ma34 = calculateSMA(closes, 34);
  const ma200 = calculateSMA(closes, 200);
  const rsi = calculateRSI(closes, 14);

  const lastIdx = closes.length - 1;
  const currentPrice = closes[lastIdx];
  const currentRSI = rsi[lastIdx];
  const currentMA200 = ma200[lastIdx];

  const crossover = checkMACrossover(closes, ma5, ma13, ma34);

  const currentMA5 = ma5[lastIdx];
  const currentMA13 = ma13[lastIdx];
  const currentMA34 = ma34[lastIdx];

  // LONG Signal
  if (
    crossover.direction === 'up' &&
    currentRSI >= 50 &&
    currentPrice > currentMA200
  ) {
    return {
      symbol,
      exchange,
      timeframe,
      direction: 'LONG',
      rsi: Math.round(currentRSI * 100) / 100,
      price: currentPrice,
      ma5: currentMA5,
      ma13: currentMA13,
      ma34: currentMA34,
      ma200: currentMA200,
      timestamp: Date.now(),
      strength: crossover.strength,
    };
  }

  // SHORT Signal
  if (
    crossover.direction === 'down' &&
    currentRSI <= 50 &&
    currentPrice < currentMA200
  ) {
    return {
      symbol,
      exchange,
      timeframe,
      direction: 'SHORT',
      rsi: Math.round(currentRSI * 100) / 100,
      price: currentPrice,
      ma5: currentMA5,
      ma13: currentMA13,
      ma34: currentMA34,
      ma200: currentMA200,
      timestamp: Date.now(),
      strength: crossover.strength,
    };
  }

  return null;
}
