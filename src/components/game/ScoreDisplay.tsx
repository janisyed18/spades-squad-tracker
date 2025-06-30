
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Target } from 'lucide-react';
import { Team } from '@/types/game';

interface ScoreDisplayProps {
  teamA: Team;
  teamB: Team;
  scores: { teamA: number; teamB: number };
  bags: { teamA: number; teamB: number };
  winner?: string;
}

export const ScoreDisplay = ({ teamA, teamB, scores, bags, winner }: ScoreDisplayProps) => {
  const isTeamAWinning = scores.teamA > scores.teamB;
  const isGameFinished = winner !== undefined;

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {/* Team A Score */}
      <Card className={`border-2 transition-colors ${
        isGameFinished && winner === teamA.name
          ? 'border-green-500 bg-green-900/20' 
          : !isGameFinished && isTeamAWinning
          ? 'border-blue-500 bg-blue-900/20'
          : 'border-slate-700 bg-slate-800/50'
      }`}>
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <h3 className="text-xl font-bold text-blue-400">{teamA.name}</h3>
            {isGameFinished && winner === teamA.name && (
              <Trophy className="h-5 w-5 text-yellow-400 ml-2" />
            )}
          </div>
          
          {teamA.players.length > 0 && (
            <p className="text-sm text-slate-400 mb-3">
              {teamA.players.filter(p => p).join(', ')}
            </p>
          )}
          
          <div className="text-4xl font-bold text-white mb-2">
            {scores.teamA}
          </div>
          
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className="flex items-center text-yellow-400">
              <Target className="h-4 w-4 mr-1" />
              {bags.teamA} bags
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team B Score */}
      <Card className={`border-2 transition-colors ${
        isGameFinished && winner === teamB.name
          ? 'border-green-500 bg-green-900/20' 
          : !isGameFinished && !isTeamAWinning
          ? 'border-green-500 bg-green-900/20'
          : 'border-slate-700 bg-slate-800/50'
      }`}>
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center mb-2">
            <h3 className="text-xl font-bold text-green-400">{teamB.name}</h3>
            {isGameFinished && winner === teamB.name && (
              <Trophy className="h-5 w-5 text-yellow-400 ml-2" />
            )}
          </div>
          
          {teamB.players.length > 0 && (
            <p className="text-sm text-slate-400 mb-3">
              {teamB.players.filter(p => p).join(', ')}
            </p>
          )}
          
          <div className="text-4xl font-bold text-white mb-2">
            {scores.teamB}
          </div>
          
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className="flex items-center text-yellow-400">
              <Target className="h-4 w-4 mr-1" />
              {bags.teamB} bags
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
