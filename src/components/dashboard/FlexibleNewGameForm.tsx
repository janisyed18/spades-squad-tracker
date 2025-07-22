import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Users, Plus, X, Minus } from 'lucide-react';
import { GameSetup } from '@/types/game';

interface FlexibleNewGameFormProps {
  onStartGame: (setup: GameSetup) => void;
  onCancel: () => void;
}

const TEAM_COLORS = [
  'text-blue-400',
  'text-green-400', 
  'text-red-400',
  'text-yellow-400',
  'text-purple-400',
  'text-pink-400',
  'text-indigo-400',
  'text-orange-400'
];

export const FlexibleNewGameForm = ({ onStartGame, onCancel }: FlexibleNewGameFormProps) => {
  const [teamCount, setTeamCount] = useState(2);
  const [teams, setTeams] = useState([
    { name: '', players: [''], teamNumber: 0 },
    { name: '', players: [''], teamNumber: 1 }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validTeams = teams.filter(team => team.name.trim());
    if (validTeams.length < 2) {
      alert('Please enter at least 2 team names');
      return;
    }

    const setup: GameSetup = {
      teamCount: validTeams.length,
      teams: validTeams.map((team, index) => ({
        name: team.name.trim(),
        players: team.players.filter(p => p.trim()),
        teamNumber: index
      }))
    };
    
    onStartGame(setup);
  };

  const updateTeamName = (index: number, name: string) => {
    setTeams(prev => prev.map((team, i) => 
      i === index ? { ...team, name } : team
    ));
  };

  const updatePlayerName = (teamIndex: number, playerIndex: number, name: string) => {
    setTeams(prev => prev.map((team, i) => 
      i === teamIndex ? {
        ...team,
        players: team.players.map((p, j) => j === playerIndex ? name : p)
      } : team
    ));
  };

  const addPlayer = (teamIndex: number) => {
    setTeams(prev => prev.map((team, i) => 
      i === teamIndex && team.players.length < 10 ? {
        ...team,
        players: [...team.players, '']
      } : team
    ));
  };

  const removePlayer = (teamIndex: number, playerIndex: number) => {
    setTeams(prev => prev.map((team, i) => 
      i === teamIndex && team.players.length > 1 ? {
        ...team,
        players: team.players.filter((_, j) => j !== playerIndex)
      } : team
    ));
  };

  const addTeam = () => {
    if (teamCount < 8) {
      setTeamCount(prev => prev + 1);
      setTeams(prev => [...prev, { 
        name: '', 
        players: [''], 
        teamNumber: prev.length 
      }]);
    }
  };

  const removeTeam = () => {
    if (teamCount > 2) {
      setTeamCount(prev => prev - 1);
      setTeams(prev => prev.slice(0, -1));
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
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

      {/* Team Count Selector */}
      <div className="mb-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Number of Teams
            </CardTitle>
            <CardDescription className="text-slate-400">
              Choose how many teams will play (2-8 teams)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Button
                type="button"
                onClick={removeTeam}
                disabled={teamCount <= 2}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-white text-lg font-semibold min-w-[2rem] text-center">
                {teamCount}
              </span>
              <Button
                type="button"
                onClick={addTeam}
                disabled={teamCount >= 8}
                variant="outline"
                size="sm"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {teams.slice(0, teamCount).map((team, index) => (
            <Card key={index} className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className={`${TEAM_COLORS[index % TEAM_COLORS.length]} flex items-center`}>
                  <Users className="h-5 w-5 mr-2" />
                  Team {index + 1}
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Enter team name and player names (up to 10 players)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor={`team-${index}-name`} className="text-slate-300">
                    Team Name *
                  </Label>
                  <Input
                    id={`team-${index}-name`}
                    value={team.name}
                    onChange={(e) => updateTeamName(index, e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                    placeholder="Enter team name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-slate-300">Players</Label>
                  {team.players.map((player, playerIndex) => (
                    <div key={playerIndex} className="flex items-center space-x-2">
                      <Input
                        value={player}
                        onChange={(e) => updatePlayerName(index, playerIndex, e.target.value)}
                        className="bg-slate-700 border-slate-600 text-white flex-1"
                        placeholder={`Player ${playerIndex + 1}`}
                      />
                      {team.players.length > 1 && (
                        <Button
                          type="button"
                          onClick={() => removePlayer(index, playerIndex)}
                          variant="outline"
                          size="sm"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {team.players.length < 10 && (
                    <Button
                      type="button"
                      onClick={() => addPlayer(index)}
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
          ))}
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