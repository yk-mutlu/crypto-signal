import { Star, Search, X, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

interface FavoritesListProps {
  favorites: string[];
  favoritesOnly: boolean;
  allPairs: string[];
  onToggleFavorite: (symbol: string) => void;
  onSetFavoritesOnly: (enabled: boolean) => void;
}

export function FavoritesList({
  favorites,
  favoritesOnly,
  allPairs,
  onToggleFavorite,
  onSetFavoritesOnly,
}: FavoritesListProps) {
  const [search, setSearch] = useState('');

  const filteredPairs = allPairs.filter((pair) =>
    pair.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500" />
          Favori Coinler
        </h2>
        <span className="text-sm text-muted-foreground">
          {favorites.length} seçili
        </span>
      </div>

      {/* Favorites Only Toggle */}
      <Card className="glass-card p-4 border-border/50">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="favorites-only" className="font-medium">
              Sadece Favorileri Tara
            </Label>
            <p className="text-xs text-muted-foreground">
              Açık olduğunda sadece favori coinler taranır
            </p>
          </div>
          <Switch
            id="favorites-only"
            checked={favoritesOnly}
            onCheckedChange={onSetFavoritesOnly}
            disabled={favorites.length === 0}
          />
        </div>
      </Card>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Coin ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-muted/30 border-border/50"
        />
        {search && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={() => setSearch('')}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Selected Favorites */}
      {favorites.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Seçili Favoriler
          </p>
          <div className="flex flex-wrap gap-2">
            {favorites.map((symbol) => (
              <Button
                key={symbol}
                variant="outline"
                size="sm"
                onClick={() => onToggleFavorite(symbol)}
                className="bg-yellow-500/10 border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/20 gap-1"
              >
                <Star className="w-3 h-3 fill-current" />
                {symbol.replace('USDT', '')}
                <X className="w-3 h-3 ml-1" />
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* All Pairs */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wider">
          Tüm Coinler ({filteredPairs.length})
        </p>
        <div className="grid grid-cols-3 gap-2 max-h-[40vh] overflow-y-auto pr-2">
          {filteredPairs.map((symbol) => {
            const isFav = favorites.includes(symbol);
            return (
              <Button
                key={symbol}
                variant="outline"
                size="sm"
                onClick={() => onToggleFavorite(symbol)}
                className={`justify-start gap-2 ${
                  isFav
                    ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500'
                    : 'bg-muted/30 border-border/50 text-muted-foreground hover:text-foreground'
                }`}
              >
                {isFav ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Star className="w-3 h-3" />
                )}
                <span className="truncate font-mono text-xs">
                  {symbol.replace('USDT', '')}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
