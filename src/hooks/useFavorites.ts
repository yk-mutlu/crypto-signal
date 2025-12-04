import { useState, useEffect, useCallback } from 'react';
import { BINANCE_PAIRS } from '@/lib/api';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('favorite-coins');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }

    const savedMode = localStorage.getItem('favorites-only');
    if (savedMode) {
      setFavoritesOnly(JSON.parse(savedMode));
    }
  }, []);

  const toggleFavorite = useCallback((symbol: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(symbol)
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol];
      localStorage.setItem('favorite-coins', JSON.stringify(newFavorites));
      return newFavorites;
    });
  }, []);

  const setFavoritesOnlyMode = useCallback((enabled: boolean) => {
    setFavoritesOnly(enabled);
    localStorage.setItem('favorites-only', JSON.stringify(enabled));
  }, []);

  const isFavorite = useCallback((symbol: string) => {
    return favorites.includes(symbol);
  }, [favorites]);

  const getPairsToScan = useCallback(() => {
    if (favoritesOnly && favorites.length > 0) {
      return favorites;
    }
    return BINANCE_PAIRS;
  }, [favorites, favoritesOnly]);

  return {
    favorites,
    favoritesOnly,
    toggleFavorite,
    setFavoritesOnlyMode,
    isFavorite,
    getPairsToScan,
    allPairs: BINANCE_PAIRS
  };
}
