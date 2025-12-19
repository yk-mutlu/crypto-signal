import { fetchBinanceKlines, fetchMEXCKlines, BINANCE_PAIRS } from './api';
import { analyzeSignal, SignalResult } from './indicators';
import { LocalNotifications } from "@capacitor/local-notifications"; // <-- EKLENDİ

export interface ScannerConfig {
  enableLong: boolean;
  enableShort: boolean;
  exchanges: ('binance' | 'mexc')[];
  timeframes: ('1h' | '15m')[];
  scanInterval: number;
  customPairs?: string[];
}

export const defaultConfig: ScannerConfig = {
  enableLong: true,
  enableShort: true,
  exchanges: ['binance'],
  timeframes: ['1h', '15m'],
  scanInterval: 30,
};

export type ScanCallback = (signal: SignalResult) => void;
export type StatusCallback = (status: ScanStatus) => void;

export interface ScanStatus {
  isScanning: boolean;
  currentPair: string;
  scannedCount: number;
  totalPairs: number;
  lastScanTime: number;
  signalsFound: number;
}

class Scanner {
  private config: ScannerConfig = defaultConfig;
  private intervalId: number | null = null;
  private onSignal: ScanCallback | null = null;
  private onStatusChange: StatusCallback | null = null;
  private status: ScanStatus = {
    isScanning: false,
    currentPair: "",
    scannedCount: 0,
    totalPairs: 0,
    lastScanTime: 0,
    signalsFound: 0,
  };
  private recentSignals: Set<string> = new Set();

  setConfig(config: Partial<ScannerConfig>) {
    this.config = { ...this.config, ...config };
  }

  getConfig(): ScannerConfig {
    return this.config;
  }

  subscribe(onSignal: ScanCallback, onStatusChange: StatusCallback) {
    this.onSignal = onSignal;
    this.onStatusChange = onStatusChange;
  }

  private updateStatus(partial: Partial<ScanStatus>) {
    this.status = { ...this.status, ...partial };
    this.onStatusChange?.(this.status);
  }

  private getSignalKey(signal: SignalResult): string {
    return `${signal.symbol}-${signal.exchange}-${signal.timeframe}-${signal.direction}`;
  }

  private async scanPair(symbol: string, exchange: 'binance' | 'mexc', timeframe: '1h' | '15m'): Promise<SignalResult | null> {
    try {
      const candles = exchange === 'binance'
        ? await fetchBinanceKlines(symbol, timeframe)
        : await fetchMEXCKlines(symbol, timeframe);

      if (candles.length < 200) return null;

      return analyzeSignal(candles, symbol, exchange, timeframe);
    } catch (err) {
      console.error(`Error scanning ${symbol}:`, err);
      return null;
    }
  }

  async runScan(): Promise<SignalResult[]> {
    const { exchanges, timeframes, enableLong, enableShort, customPairs } = this.config;

    const signals: SignalResult[] = [];
    const pairs = customPairs && customPairs.length > 0 ? customPairs : BINANCE_PAIRS;

    const totalScans = pairs.length * exchanges.length * timeframes.length;

    this.updateStatus({
      isScanning: true,
      scannedCount: 0,
      totalPairs: totalScans,
    });

    let scannedCount = 0;

    for (const exchange of exchanges) {
      for (const timeframe of timeframes) {
        for (const symbol of pairs) {

          this.updateStatus({ currentPair: symbol, scannedCount });

          const signal = await this.scanPair(symbol, exchange, timeframe);

          if (signal) {
            const key = this.getSignalKey(signal);

            const shouldEmit =
              (signal.direction === "LONG" && enableLong) ||
              (signal.direction === "SHORT" && enableShort);

            // DUPLICATE SİNYAL ÖNLEME
            if (shouldEmit && !this.recentSignals.has(key)) {
              this.recentSignals.add(key);

              signals.push(signal);
              this.onSignal?.(signal);

              // ⬇️⬇️ *** BURASI ÖNEMLİ — BİLDİRİM ATMAYI BURAYA KOYDUK *** ⬇️⬇️
              await LocalNotifications.schedule({
                notifications: [
                  {
                    id: Date.now(),
                    title: signal.direction === "LONG" ? "📈 LONG Sinyali!" : "📉 SHORT Sinyali!",
                    body: `${signal.symbol} — ${signal.timeframe} — ${signal.direction}`,
                    sound: "default",
                    smallIcon: "ic_stat_icon",
                  }
                ]
              });

              this.updateStatus({ signalsFound: this.status.signalsFound + 1 });

              setTimeout(() => this.recentSignals.delete(key), 5 * 60 * 1000); // 5 dk duplicate engeli
            }
          }

          scannedCount++;

          await new Promise(r => setTimeout(r, 100));
        }
      }
    }

    this.updateStatus({
      isScanning: false,
      currentPair: "",
      lastScanTime: Date.now(),
    });

    return signals;
  }

  start() {
    if (this.intervalId) return;
    this.runScan();
    this.intervalId = window.setInterval(() => this.runScan(), this.config.scanInterval * 1000);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.updateStatus({ isScanning: false });
  }

  isRunning(): boolean {
    return this.intervalId !== null;
  }

  getStatus(): ScanStatus {
    return this.status;
  }
}

export const scanner = new Scanner();
