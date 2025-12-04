import { Candle } from './indicators';

// Binance API
export async function fetchBinanceKlines(
  symbol: string,
  interval: '1h' | '15m',
  limit: number = 200
): Promise<Candle[]> {
  const intervalMap = { '1h': '1h', '15m': '15m' };
  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${intervalMap[interval]}&limit=${limit}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Binance API error');
    
    const data = await response.json();
    return data.map((k: any[]) => ({
      time: k[0],
      open: parseFloat(k[1]),
      high: parseFloat(k[2]),
      low: parseFloat(k[3]),
      close: parseFloat(k[4]),
      volume: parseFloat(k[5]),
    }));
  } catch (error) {
    console.error(`Failed to fetch ${symbol} from Binance:`, error);
    return [];
  }
}

// MEXC API
export async function fetchMEXCKlines(
  symbol: string,
  interval: '1h' | '15m',
  limit: number = 200
): Promise<Candle[]> {
  const mexcSymbol = symbol.replace('USDT', '_USDT');
  const intervalMap = { '1h': '1h', '15m': '15m' };
  const url = `https://www.mexc.com/open/api/v2/market/kline?symbol=${mexcSymbol}&interval=${intervalMap[interval]}&limit=${limit}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('MEXC API error');
    
    const json = await response.json();
    if (!json.data) return [];
    
    return json.data.map((k: any) => ({
      time: k[0] * 1000,
      open: parseFloat(k[1]),
      high: parseFloat(k[3]),
      low: parseFloat(k[4]),
      close: parseFloat(k[2]),
      volume: parseFloat(k[5]),
    }));
  } catch (error) {
    console.error(`Failed to fetch ${symbol} from MEXC:`, error);
    return [];
  }
}

// Popular trading pairs
export const BINANCE_PAIRS = [
  'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT',
  'ADAUSDT', 'DOGEUSDT', 'AVAXUSDT', 'DOTUSDT', 'MATICUSDT',
  'LINKUSDT', 'ATOMUSDT', 'LTCUSDT', 'UNIUSDT', 'NEARUSDT',
  'AAVEUSDT', 'FILUSDT', 'APTUSDT', 'ARBUSDT', 'OPUSDT'
];

export const MEXC_PAIRS = [
  'BTC_USDT', 'ETH_USDT', 'SOL_USDT', 'XRP_USDT', 'DOGE_USDT',
  'ADA_USDT', 'AVAX_USDT', 'DOT_USDT', 'MATIC_USDT', 'LINK_USDT'
];

export function formatSymbol(symbol: string, exchange: 'binance' | 'mexc'): string {
  if (exchange === 'mexc') {
    return symbol.replace('_', '');
  }
  return symbol;
}
