
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Users, Plus, X } from 'lucide-react';
import { GameSetup } from '@/types/game';

interface NewGameFormProps {
  onStartGame: (setup: GameSetup) => void;
  onCancel: () => void;
}

export const NewGameForm = ({ onStartGame, onCancel }: NewGameFormProps) => {
  const [setup, setSetup] = useState<GameSetup>({
    teamA: { name: '', players: [''] },
    teamB: { name: '', players: [''] }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!setup.teamA.name.trim() || !setup.teamB.name.trim()) {
      alert('Please enter team names');
      return;
    }
    
    const finalSetup: GameSetup = {
      teamA: {
        name: setup.teamA.name.trim(),
        players: setup.teamA.players.filter(p => p.trim())
      },
      teamB: {
        name: setup.teamB.name.trim(),
        players: setup.teamB.players.filter(p => p.trim())
      }
    };
    
    onStartGame(finalSetup);
  };

  const updateTeamName = (team: 'teamA' | 'teamB', name: string) => {
    setSetup(prev => ({
      ...prev,
      [team]: { ...prev[team], name }
    }));
  };

  const updatePlayerName = (team: 'teamA' | 'teamB', index: number, name: string) => {
    setSetup(prev => ({
      ...prev,
      [team]: {
        ...prev[team],
        players: prev[team].players.map((p, i) => i === index ? name : p)
      }
    }));
  };

  const addPlayer = (team: 'teamA' | 'teamB') => {
    if (setup[team].players.length < 10) {
      setSetup(prev => ({
        ...prev,
        [team]: {
          ...prev[team],
          players: [...prev[team].players, '']
        }
      }));
    }
  };

  const removePlayer = (team: 'teamA' | 'teamB', index: number) => {
    if (setup[team].players.length > 1) {
      setSetup(prev => ({
        ...prev,
        [team]: {
          ...prev[team],
          players: prev[team].players.filter((_, i) => i !== index)
        }
      }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Button
          onClick={onCancel}
          variant="ghost"
          size="sm"
          className="text-slate-400 hover:text-white mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <h2 className="text-2xl font-bold text-white">Setup New Game</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Team A */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-blue-400 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Team A
              </CardTitle>
              <CardDescription className="text-slate-400">
                Enter team name and player names (up to 10 players)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="teamA-name" className="text-slate-300">Team Name *</Label>
                <Input
                  id="teamA-name"
                  value={setup.teamA.name}
                  onChange={(e) => updateTeamName('teamA', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter team name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Players</Label>
                {setup.teamA.players.map((player, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={player}
                      onChange={(e) => updatePlayerName('teamA', index, e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white flex-1"
                      placeholder={`Player ${index + 1}`}
                    />
                    {setup.teamA.players.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removePlayer('teamA', index)}
                        variant="outline"
                        size="sm"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {setup.teamA.players.length < 10 && (
                  <Button
                    type="button"
                    onClick={() => addPlayer('teamA')}
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Player
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Team B */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-green-400 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Team B
              </CardTitle>
              <CardDescription className="text-slate-400">
                Enter team name and player names (up to 10 players)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="teamB-name" className="text-slate-300">Team Name *</Label>
                <Input
                  id="teamB-name"
                  value={setup.teamB.name}
                  onChange={(e) => updateTeamName('teamB', e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white"
                  placeholder="Enter team name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-300">Players</Label>
                {setup.teamB.players.map((player, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input
                      value={player}
                      onChange={(e) => updatePlayerName('teamB', index, e.target.value)}
                      className="bg-slate-700 border-slate-600 text-white flex-1"
                      placeholder={`Player ${index + 1}`}
                    />
                    {setup.teamB.players.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removePlayer('teamB', index)}
                        variant="outline"
                        size="sm"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {setup.teamB.players.length < 10 && (
                  <Button
                    type="button"
                    onClick={() => addPlayer('teamB')}
                    variant="outline"
                    size="sm"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Player
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex space-x-4 justify-center">
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="border-slate-600 text-slate-300 hover:bg-slate-700"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700 px-8"
          >
            Start Game
          </Button>
        </div>
      </form>
    </div>
  );
};
