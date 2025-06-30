
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { Game } from '@/types/game';

type Theme = {
  id: string;
  name: string;
  background: string;
  text: string;
  accent: string;
};

const themeCategories: { [key: string]: Theme[] } = {
  beautiful: [
    { id: 'sunset', name: 'Sunset', background: 'bg-gradient-to-br from-orange-300 to-pink-300', text: 'text-gray-800', accent: 'text-orange-600' },
    { id: 'ocean', name: 'Ocean', background: 'bg-gradient-to-br from-blue-300 to-cyan-300', text: 'text-gray-800', accent: 'text-blue-600' },
    { id: 'forest', name: 'Forest', background: 'bg-gradient-to-br from-green-300 to-emerald-300', text: 'text-gray-800', accent: 'text-green-600' },
    { id: 'lavender', name: 'Lavender', background: 'bg-gradient-to-br from-purple-200 to-indigo-200', text: 'text-gray-800', accent: 'text-purple-600' },
    { id: 'spring', name: 'Spring', background: 'bg-gradient-to-br from-lime-200 to-green-200', text: 'text-gray-800', accent: 'text-lime-600' },
    { id: 'rose', name: 'Rose', background: 'bg-gradient-to-br from-rose-200 to-pink-200', text: 'text-gray-800', accent: 'text-rose-600' },
    { id: 'sky', name: 'Sky', background: 'bg-gradient-to-br from-sky-200 to-blue-200', text: 'text-gray-800', accent: 'text-sky-600' },
    { id: 'pearl', name: 'Pearl', background: 'bg-gradient-to-br from-slate-100 to-gray-200', text: 'text-gray-800', accent: 'text-slate-600' },
    { id: 'coral', name: 'Coral', background: 'bg-gradient-to-br from-coral-200 to-orange-200', text: 'text-gray-800', accent: 'text-coral-600' },
    { id: 'mint', name: 'Fresh Mint', background: 'bg-gradient-to-br from-mint-200 to-teal-200', text: 'text-gray-800', accent: 'text-teal-600' }
  ],
  fierce: [
    { id: 'fire', name: 'Fire', background: 'bg-gradient-to-br from-red-600 to-orange-600', text: 'text-white', accent: 'text-yellow-300' },
    { id: 'thunder', name: 'Thunder', background: 'bg-gradient-to-br from-purple-600 to-indigo-600', text: 'text-white', accent: 'text-purple-300' },
    { id: 'steel', name: 'Steel', background: 'bg-gradient-to-br from-gray-600 to-slate-600', text: 'text-white', accent: 'text-gray-300' },
    { id: 'storm', name: 'Storm', background: 'bg-gradient-to-br from-gray-800 to-slate-800', text: 'text-white', accent: 'text-blue-300' },
    { id: 'magma', name: 'Magma', background: 'bg-gradient-to-br from-red-800 to-black', text: 'text-white', accent: 'text-red-300' },
    { id: 'venom', name: 'Venom', background: 'bg-gradient-to-br from-green-800 to-black', text: 'text-white', accent: 'text-green-300' },
    { id: 'shadow', name: 'Shadow', background: 'bg-gradient-to-br from-black to-gray-900', text: 'text-white', accent: 'text-gray-400' },
    { id: 'crimson', name: 'Crimson', background: 'bg-gradient-to-br from-red-900 to-red-700', text: 'text-white', accent: 'text-red-200' },
    { id: 'midnight', name: 'Midnight', background: 'bg-gradient-to-br from-indigo-900 to-black', text: 'text-white', accent: 'text-indigo-300' },
    { id: 'ember', name: 'Ember', background: 'bg-gradient-to-br from-orange-800 to-red-800', text: 'text-white', accent: 'text-orange-200' }
  ],
  cute: [
    { id: 'bubblegum', name: 'Bubblegum', background: 'bg-gradient-to-br from-pink-200 to-purple-200', text: 'text-gray-700', accent: 'text-pink-600' },
    { id: 'cotton', name: 'Cotton Candy', background: 'bg-gradient-to-br from-pink-100 to-blue-100', text: 'text-gray-700', accent: 'text-pink-500' },
    { id: 'peach', name: 'Peach', background: 'bg-gradient-to-br from-peach-200 to-orange-200', text: 'text-gray-700', accent: 'text-peach-600' },
    { id: 'lemon', name: 'Lemon', background: 'bg-gradient-to-br from-yellow-200 to-lime-200', text: 'text-gray-700', accent: 'text-yellow-600' },
    { id: 'unicorn', name: 'Unicorn', background: 'bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200', text: 'text-gray-700', accent: 'text-purple-600' },
    { id: 'strawberry', name: 'Strawberry', background: 'bg-gradient-to-br from-red-200 to-pink-200', text: 'text-gray-700', accent: 'text-red-500' },
    { id: 'vanilla', name: 'Vanilla', background: 'bg-gradient-to-br from-yellow-100 to-orange-100', text: 'text-gray-700', accent: 'text-yellow-600' },
    { id: 'blueberry', name: 'Blueberry', background: 'bg-gradient-to-br from-blue-200 to-purple-200', text: 'text-gray-700', accent: 'text-blue-600' },
    { id: 'mint-cream', name: 'Mint Cream', background: 'bg-gradient-to-br from-green-100 to-blue-100', text: 'text-gray-700', accent: 'text-green-600' },
    { id: 'cherry', name: 'Cherry Blossom', background: 'bg-gradient-to-br from-pink-100 to-rose-100', text: 'text-gray-700', accent: 'text-pink-500' }
  ]
};

interface ThemeSelectorProps {
  team: 'teamA' | 'teamB';
  themes: Theme[];
  onSelect: (theme: Theme) => void;
  onClose: () => void;
  currentGame: Game;
  previewTeam: 'teamA' | 'teamB';
}

export const ThemeSelector = ({ team, onSelect, onClose, currentGame, previewTeam }: ThemeSelectorProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('beautiful');
  const [previewTheme, setPreviewTheme] = useState<Theme | null>(null);

  const teamName = team === 'teamA' ? currentGame.teamA.name : currentGame.teamB.name;
  const teamPlayers = team === 'teamA' ? currentGame.teamA.players : currentGame.teamB.players;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-slate-800 border-slate-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">Choose Theme for {teamName}</CardTitle>
          <Button onClick={onClose} variant="ghost" size="sm">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Preview */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-white mb-2">Preview</h3>
              <Card className={`${previewTheme?.background || 'bg-slate-800/50'} border-slate-700`}>
                <CardHeader>
                  <CardTitle className={`${previewTheme?.text || 'text-blue-400'} text-xl font-bold`}>
                    {teamName}
                  </CardTitle>
                  {teamPlayers.length > 0 && (
                    <div className={`text-sm ${previewTheme?.text || 'text-slate-400'} mt-2`}>
                      {teamPlayers.filter(p => p).map((player, i) => (
                        <div key={i}>{player}</div>
                      ))}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className={`text-3xl font-bold ${previewTheme?.accent || 'text-white'} mb-4`}>
                    150
                  </div>
                  <div className="text-sm space-y-1">
                    <div className={`flex justify-between ${previewTheme?.text || 'text-white'}`}>
                      <span>Round 1:</span>
                      <span className="text-green-400">40</span>
                    </div>
                    <div className={`flex justify-between ${previewTheme?.text || 'text-white'}`}>
                      <span>Round 2:</span>
                      <span className="text-green-400">60</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Category Selection */}
            <div>
              <h3 className="text-white mb-2">Theme Categories</h3>
              <div className="space-y-2">
                {Object.keys(themeCategories).map((category) => (
                  <Button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className="w-full capitalize"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Theme Grid */}
          <div>
            <h3 className="text-white mb-4">
              {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Themes
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {themeCategories[selectedCategory].map((theme) => (
                <div
                  key={theme.id}
                  className={`${theme.background} p-4 rounded-lg cursor-pointer border-2 border-transparent hover:border-white transition-all`}
                  onMouseEnter={() => setPreviewTheme(theme)}
                  onMouseLeave={() => setPreviewTheme(null)}
                  onClick={() => onSelect(theme)}
                >
                  <div className={`${theme.text} font-medium text-center`}>
                    {theme.name}
                  </div>
                  <div className={`${theme.accent} text-sm text-center mt-1`}>
                    Preview
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
