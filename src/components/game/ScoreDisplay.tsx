
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, Palette, ShoppingBag } from 'lucide-react';
import { Team } from '@/types/game';

interface ScoreDisplayProps {
  teamA: Team;
  teamB: Team;
  scores: { teamA: number; teamB: number };
  bags: { teamA: number; teamB: number };
  winner?: string;
  createdAt?: Date;
  finishedAt?: Date;
  selectedThemes?: { teamA?: any; teamB?: any };
  onThemeSelect?: (team: 'teamA' | 'teamB') => void;
}

export const ScoreDisplay = ({ 
  teamA, 
  teamB, 
  scores, 
  bags, 
  winner, 
  createdAt, 
  finishedAt,
  selectedThemes,
  onThemeSelect
}: ScoreDisplayProps) => {
  const isTeamAWinning = scores.teamA > scores.teamB;
  const isGameFinished = winner !== undefined;

  const formatDateTime = (date: Date): string => {
    return date.toLocaleString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="space-y-4">
      {/* Game Times */}
      <div className="flex justify-between text-slate-400 text-sm">
        {createdAt && (
          <div className="text-left">Started: {formatDateTime(createdAt)}</div>
        )}
        {finishedAt && (
          <div className="text-right">Finished: {formatDateTime(finishedAt)}</div>
        )}
      </div>

      {/* Team Scores */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Team A Score */}
        <Card className={`border-2 transition-colors ${selectedThemes?.teamA?.background || ''} ${
          isGameFinished && winner === teamA.name
            ? 'border-green-500 bg-green-900/20' 
            : !isGameFinished && isTeamAWinning
            ? 'border-blue-500 bg-blue-900/20'
            : 'border-slate-700 bg-slate-800/50'
        }`}>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <h3 className={`text-xl font-bold ${selectedThemes?.teamA?.text || 'text-blue-400'}`}>
                {teamA.name}
              </h3>
              {isGameFinished && winner === teamA.name && (
                <Trophy className="h-5 w-5 text-yellow-400 ml-2" />
              )}
              {onThemeSelect && (
                <Button
                  onClick={() => onThemeSelect('teamA')}
                  variant="ghost"
                  size="sm"
                  className="ml-2"
                >
                  <Palette className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {teamA.players.length > 0 && (
              <div className={`text-sm ${selectedThemes?.teamA?.text || 'text-slate-400'} mb-3`}>
                {teamA.players.filter(p => p).map((player, i) => (
                  <div key={i}>{player}</div>
                ))}
              </div>
            )}
            
            <div className={`text-4xl font-bold ${selectedThemes?.teamA?.accent || 'text-white'} mb-2`}>
              {scores.teamA}
            </div>
            
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className={`flex items-center ${selectedThemes?.teamA?.accent || 'text-yellow-400'}`}>
                <ShoppingBag className="h-4 w-4 mr-1" />
                {bags.teamA} bags
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team B Score */}
        <Card className={`border-2 transition-colors ${selectedThemes?.teamB?.background || ''} ${
          isGameFinished && winner === teamB.name
            ? 'border-green-500 bg-green-900/20' 
            : !isGameFinished && !isTeamAWinning
            ? 'border-green-500 bg-green-900/20'
            : 'border-slate-700 bg-slate-800/50'
        }`}>
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-2">
              <h3 className={`text-xl font-bold ${selectedThemes?.teamB?.text || 'text-green-400'}`}>
                {teamB.name}
              </h3>
              {isGameFinished && winner === teamB.name && (
                <Trophy className="h-5 w-5 text-yellow-400 ml-2" />
              )}
              {onThemeSelect && (
                <Button
                  onClick={() => onThemeSelect('teamB')}
                  variant="ghost"
                  size="sm"
                  className="ml-2"
                >
                  <Palette className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {teamB.players.length > 0 && (
              <div className={`text-sm ${selectedThemes?.teamB?.text || 'text-slate-400'} mb-3`}>
                {teamB.players.filter(p => p).map((player, i) => (
                  <div key={i}>{player}</div>
                ))}
              </div>
            )}
            
            <div className={`text-4xl font-bold ${selectedThemes?.teamB?.accent || 'text-white'} mb-2`}>
              {scores.teamB}
            </div>
            
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className={`flex items-center ${selectedThemes?.teamB?.accent || 'text-yellow-400'}`}>
                <ShoppingBag className="h-4 w-4 mr-1" />
                {bags.teamB} bags
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
