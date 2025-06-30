
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
  default: [
    { id: 'none', name: 'Default', background: '', text: 'text-white', accent: 'text-white' }
  ],
  beautiful: [
    { id: 'sunset', name: 'Sunset', background: 'bg-gradient-to-br from-orange-200/80 to-pink-200/80', text: 'text-gray-800', accent: 'text-orange-700' },
    { id: 'ocean', name: 'Ocean', background: 'bg-gradient-to-br from-blue-200/80 to-cyan-200/80', text: 'text-gray-800', accent: 'text-blue-700' },
    { id: 'forest', name: 'Forest', background: 'bg-gradient-to-br from-green-200/80 to-emerald-200/80', text: 'text-gray-800', accent: 'text-green-700' },
    { id: 'lavender', name: 'Lavender', background: 'bg-gradient-to-br from-purple-100/80 to-indigo-100/80', text: 'text-gray-800', accent: 'text-purple-700' },
    { id: 'spring', name: 'Spring', background: 'bg-gradient-to-br from-lime-100/80 to-green-100/80', text: 'text-gray-800', accent: 'text-lime-700' },
    { id: 'rose', name: 'Rose', background: 'bg-gradient-to-br from-rose-100/80 to-pink-100/80', text: 'text-gray-800', accent: 'text-rose-700' },
    { id: 'sky', name: 'Sky', background: 'bg-gradient-to-br from-sky-100/80 to-blue-100/80', text: 'text-gray-800', accent: 'text-sky-700' },
    { id: 'pearl', name: 'Pearl', background: 'bg-gradient-to-br from-slate-50/80 to-gray-100/80', text: 'text-gray-800', accent: 'text-slate-700' },
    { id: 'coral', name: 'Coral', background: 'bg-gradient-to-br from-orange-100/80 to-red-100/80', text: 'text-gray-800', accent: 'text-orange-700' },
    { id: 'mint', name: 'Fresh Mint', background: 'bg-gradient-to-br from-emerald-100/80 to-teal-100/80', text: 'text-gray-800', accent: 'text-teal-700' }
  ],
  animals: [
    { id: 'tiger', name: 'Tiger', background: 'bg-gradient-to-br from-orange-100/80 to-yellow-100/80 bg-[url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23f97316" fill-opacity="0.1"%3E%3Cpath d="M0 0h20v20H0z"/%3E%3C/g%3E%3C/svg%3E")]', text: 'text-gray-800', accent: 'text-orange-700' },
    { id: 'elephant', name: 'Elephant', background: 'bg-gradient-to-br from-gray-100/80 to-slate-100/80', text: 'text-gray-800', accent: 'text-gray-700' },
    { id: 'peacock', name: 'Peacock', background: 'bg-gradient-to-br from-blue-100/80 to-green-100/80', text: 'text-gray-800', accent: 'text-blue-700' },
    { id: 'butterfly', name: 'Butterfly', background: 'bg-gradient-to-br from-purple-100/80 to-pink-100/80', text: 'text-gray-800', accent: 'text-purple-700' },
    { id: 'dolphin', name: 'Dolphin', background: 'bg-gradient-to-br from-cyan-100/80 to-blue-100/80', text: 'text-gray-800', accent: 'text-cyan-700' },
    { id: 'flamingo', name: 'Flamingo', background: 'bg-gradient-to-br from-pink-100/80 to-rose-100/80', text: 'text-gray-800', accent: 'text-pink-700' },
    { id: 'panda', name: 'Panda', background: 'bg-gradient-to-br from-gray-50/80 to-slate-100/80', text: 'text-gray-800', accent: 'text-gray-700' },
    { id: 'lion', name: 'Lion', background: 'bg-gradient-to-br from-yellow-100/80 to-orange-100/80', text: 'text-gray-800', accent: 'text-yellow-700' },
    { id: 'whale', name: 'Whale', background: 'bg-gradient-to-br from-indigo-100/80 to-blue-100/80', text: 'text-gray-800', accent: 'text-indigo-700' },
    { id: 'fox', name: 'Fox', background: 'bg-gradient-to-br from-red-100/80 to-orange-100/80', text: 'text-gray-800', accent: 'text-red-700' }
  ],
  nature: [
    { id: 'mountain', name: 'Mountain', background: 'bg-gradient-to-br from-slate-100/80 to-gray-100/80', text: 'text-gray-800', accent: 'text-slate-700' },
    { id: 'river', name: 'River', background: 'bg-gradient-to-br from-blue-100/80 to-cyan-100/80', text: 'text-gray-800', accent: 'text-blue-700' },
    { id: 'flower', name: 'Garden', background: 'bg-gradient-to-br from-pink-100/80 to-green-100/80', text: 'text-gray-800', accent: 'text-pink-700' },
    { id: 'desert', name: 'Desert', background: 'bg-gradient-to-br from-yellow-100/80 to-orange-100/80', text: 'text-gray-800', accent: 'text-yellow-700' },
    { id: 'aurora', name: 'Aurora', background: 'bg-gradient-to-br from-green-100/80 to-purple-100/80', text: 'text-gray-800', accent: 'text-green-700' },
    { id: 'cherry', name: 'Cherry Blossom', background: 'bg-gradient-to-br from-pink-50/80 to-rose-100/80', text: 'text-gray-800', accent: 'text-pink-700' },
    { id: 'bamboo', name: 'Bamboo', background: 'bg-gradient-to-br from-green-100/80 to-lime-100/80', text: 'text-gray-800', accent: 'text-green-700' },
    { id: 'sunset-beach', name: 'Beach Sunset', background: 'bg-gradient-to-br from-orange-100/80 to-blue-100/80', text: 'text-gray-800', accent: 'text-orange-700' },
    { id: 'starry', name: 'Starry Night', background: 'bg-gradient-to-br from-indigo-100/80 to-purple-100/80', text: 'text-gray-800', accent: 'text-indigo-700' },
    { id: 'rainbow', name: 'Rainbow', background: 'bg-gradient-to-br from-red-100/80 via-yellow-100/80 to-blue-100/80', text: 'text-gray-800', accent: 'text-red-700' }
  ],
  vehicles: [
    { id: 'rocket', name: 'Rocket', background: 'bg-gradient-to-br from-red-100/80 to-orange-100/80', text: 'text-gray-800', accent: 'text-red-700' },
    { id: 'airplane', name: 'Airplane', background: 'bg-gradient-to-br from-sky-100/80 to-blue-100/80', text: 'text-gray-800', accent: 'text-sky-700' },
    { id: 'ship', name: 'Ship', background: 'bg-gradient-to-br from-blue-100/80 to-cyan-100/80', text: 'text-gray-800', accent: 'text-blue-700' },
    { id: 'train', name: 'Train', background: 'bg-gradient-to-br from-green-100/80 to-emerald-100/80', text: 'text-gray-800', accent: 'text-green-700' },
    { id: 'car', name: 'Racing Car', background: 'bg-gradient-to-br from-red-100/80 to-pink-100/80', text: 'text-gray-800', accent: 'text-red-700' },
    { id: 'balloon', name: 'Hot Air Balloon', background: 'bg-gradient-to-br from-yellow-100/80 to-red-100/80', text: 'text-gray-800', accent: 'text-yellow-700' },
    { id: 'bicycle', name: 'Bicycle', background: 'bg-gradient-to-br from-lime-100/80 to-green-100/80', text: 'text-gray-800', accent: 'text-lime-700' },
    { id: 'helicopter', name: 'Helicopter', background: 'bg-gradient-to-br from-orange-100/80 to-yellow-100/80', text: 'text-gray-800', accent: 'text-orange-700' },
    { id: 'submarine', name: 'Submarine', background: 'bg-gradient-to-br from-teal-100/80 to-blue-100/80', text: 'text-gray-800', accent: 'text-teal-700' },
    { id: 'motorcycle', name: 'Motorcycle', background: 'bg-gradient-to-br from-purple-100/80 to-indigo-100/80', text: 'text-gray-800', accent: 'text-purple-700' }
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
  const [selectedCategory, setSelectedCategory] = useState<string>('default');
  const [previewTheme, setPreviewTheme] = useState<Theme | null>(null);

  const teamName = team === 'teamA' ? currentGame.teamA.name : currentGame.teamB.name;
  const teamPlayers = team === 'teamA' ? currentGame.teamA.players : currentGame.teamB.players;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="bg-slate-800 border-slate-700 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
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
              <Card className={`${previewTheme?.background || 'bg-slate-800/50'} border-slate-700 min-h-[200px]`}>
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <h3 className={`text-xl font-bold ${previewTheme?.text || 'text-blue-400'}`}>
                      {teamName}
                    </h3>
                  </div>
                  {teamPlayers.length > 0 && (
                    <div className={`text-sm ${previewTheme?.text || 'text-slate-400'} mb-3`}>
                      {teamPlayers.filter(p => p).map((player, i) => (
                        <div key={i}>{player}</div>
                      ))}
                    </div>
                  )}
                  <div className={`text-3xl font-bold ${previewTheme?.accent || 'text-white'} mb-4`}>
                    150
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
                  className={`${theme.background || 'bg-slate-700'} p-4 rounded-lg cursor-pointer border-2 border-transparent hover:border-white transition-all min-h-[80px] flex flex-col justify-center`}
                  onMouseEnter={() => setPreviewTheme(theme)}
                  onMouseLeave={() => setPreviewTheme(null)}
                  onClick={() => onSelect(theme)}
                >
                  <div className={`${theme.text} font-medium text-center text-sm`}>
                    {theme.name}
                  </div>
                  <div className={`${theme.accent} text-xs text-center mt-1`}>
                    Click to apply
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
