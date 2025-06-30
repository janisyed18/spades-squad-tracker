import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trophy, Palette, AlertTriangle, X } from 'lucide-react';
import { Game, Round } from '@/types/game';
import { RoundInput } from './RoundInput';
import { ScoreDisplay } from './ScoreDisplay';
import { GameCompleteModal } from './GameCompleteModal';
import { ThemeSelector } from './ThemeSelector';
import { calculateScore, calculateBags } from '@/utils/gameLogic';

interface ScorecardProps {
  game: Game;
  onGameComplete: (game: Game) => void;
  onBackToDashboard: () => void;
  onUpdateRound?: (gameId: string, roundNumber: number, team: 'teamA' | 'teamB', bid: number, won: number, bags: number, score: number) => void;
}

type Theme = {
  id: string;
  name: string;
  background: string;
  text: string;
  accent: string;
};

const themes: { [key: string]: Theme[] } = {
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

export const Scorecard = ({ game, onGameComplete, onBackToDashboard, onUpdateRound }: ScorecardProps) => {
  const [currentGame, setCurrentGame] = useState<Game>(game);
  const [totalScores, setTotalScores] = useState({ teamA: 0, teamB: 0 });
  const [totalBags, setTotalBags] = useState({ teamA: 0, teamB: 0 });
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [selectedThemes, setSelectedThemes] = useState<{ teamA?: Theme; teamB?: Theme }>({});
  const [showThemeSelector, setShowThemeSelector] = useState<'teamA' | 'teamB' | null>(null);
  const [roundErrors, setRoundErrors] = useState<{ [key: string]: boolean }>({});

  // Fix scoring calculation - don't add bag points to score
  useEffect(() => {
    let scoreA = 0, scoreB = 0, bagsA = 0, bagsB = 0;

    currentGame.rounds.forEach(round => {
      scoreA += round.teamA.score; // Only round score, no bag points
      scoreB += round.teamB.score; // Only round score, no bag points
      bagsA += round.teamA.bags;
      bagsB += round.teamB.bags;
    });

    // Apply bag penalties (every 5 bags = -50 points)
    const bagPenaltyA = Math.floor(bagsA / 5) * 50;
    const bagPenaltyB = Math.floor(bagsB / 5) * 50;
    
    setTotalScores({ 
      teamA: scoreA - bagPenaltyA, // Only subtract penalties, don't add bag points
      teamB: scoreB - bagPenaltyB  // Only subtract penalties, don't add bag points
    });
    setTotalBags({ 
      teamA: bagsA % 5, 
      teamB: bagsB % 5 
    });
  }, [currentGame.rounds]);

  const validateRoundInputs = (roundNumber: number, bid: number, won: number) => {
    return bid <= roundNumber && won <= roundNumber && bid >= 0 && won >= 0;
  };

  const updateRound = async (roundNumber: number, team: 'teamA' | 'teamB', bid: number, won: number) => {
    const isValid = validateRoundInputs(roundNumber, bid, won);
    const errorKey = `${roundNumber}-${team}`;
    
    setRoundErrors(prev => ({
      ...prev,
      [errorKey]: !isValid
    }));

    if (!isValid) return;

    const bags = calculateBags(bid, won);
    const score = calculateScore(bid, won);
    
    setCurrentGame(prev => ({
      ...prev,
      rounds: prev.rounds.map(round => {
        if (round.round === roundNumber) {
          return {
            ...round,
            [team]: { bid, won, bags, score }
          };
        }
        return round;
      })
    }));

    if (onUpdateRound) {
      await onUpdateRound(currentGame.id, roundNumber, team, bid, won, bags, score);
    }
  };

  const handleCompleteGame = () => {
    setShowCompleteModal(true);
  };

  const handleModalClose = () => {
    setShowCompleteModal(false);
    const winner = totalScores.teamA > totalScores.teamB ? currentGame.teamA.name : currentGame.teamB.name;
    
    const completedGame: Game = {
      ...currentGame,
      status: 'completed',
      winner,
      finalScores: totalScores,
      finishedAt: new Date()
    };
    
    onGameComplete(completedGame);
  };

  const handleThemeSelect = (theme: Theme, team: 'teamA' | 'teamB') => {
    setSelectedThemes(prev => ({
      ...prev,
      [team]: theme
    }));
    setShowThemeSelector(null);
  };

  const availableThemes = (team: 'teamA' | 'teamB') => {
    const otherTeamTheme = team === 'teamA' ? selectedThemes.teamB : selectedThemes.teamA;
    const allThemes = Object.values(themes).flat();
    return allThemes.filter(theme => !otherTeamTheme || theme.id !== otherTeamTheme.id);
  };

  const isGameComplete = currentGame.rounds.every(round => 
    round.teamA.bid >= 0 && round.teamA.won >= 0 && 
    round.teamB.bid >= 0 && round.teamB.won >= 0 &&
    validateRoundInputs(round.round, round.teamA.bid, round.teamA.won) &&
    validateRoundInputs(round.round, round.teamB.bid, round.teamB.won)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            onClick={onBackToDashboard}
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-white mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {currentGame.teamA.name} vs {currentGame.teamB.name}
            </h2>
          </div>
        </div>
        
        {isGameComplete && currentGame.status !== 'completed' && (
          <Button
            onClick={handleCompleteGame}
            className="bg-green-600 hover:bg-green-700"
          >
            <Trophy className="h-4 w-4 mr-2" />
            Complete Game
          </Button>
        )}
      </div>

      {/* Score Display */}
      <ScoreDisplay
        teamA={currentGame.teamA}
        teamB={currentGame.teamB}
        scores={totalScores}
        bags={totalBags}
        winner={currentGame.winner}
        createdAt={currentGame.createdAt}
        finishedAt={currentGame.finishedAt}
      />

      {/* Team Scorecards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Team A Scorecard */}
        <Card className={`${selectedThemes.teamA?.background || 'bg-slate-800/50'} border-slate-700`}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className={`${selectedThemes.teamA?.text || 'text-blue-400'} text-xl font-bold flex items-center`}>
                {currentGame.teamA.name}
                <Button
                  onClick={() => setShowThemeSelector('teamA')}
                  variant="ghost"
                  size="sm"
                  className="ml-2"
                >
                  <Palette className="h-4 w-4" />
                </Button>
              </CardTitle>
              {currentGame.teamA.players.length > 0 && (
                <div className={`text-sm ${selectedThemes.teamA?.text || 'text-slate-400'} mt-2`}>
                  {currentGame.teamA.players.filter(p => p).map((player, i) => (
                    <div key={i}>{player}</div>
                  ))}
                </div>
              )}
            </div>
            <div className={`text-3xl font-bold ${selectedThemes.teamA?.accent || 'text-white'}`}>
              {totalScores.teamA}
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className={`text-left ${selectedThemes.teamA?.text || 'text-slate-300'} p-2`}>Round</th>
                    <th className={`text-center ${selectedThemes.teamA?.text || 'text-slate-400'} p-2`}>Bid</th>
                    <th className={`text-center ${selectedThemes.teamA?.text || 'text-slate-400'} p-2`}>Won</th>
                    <th className={`text-center ${selectedThemes.teamA?.text || 'text-slate-400'} p-2`}>Bags</th>
                    <th className={`text-center ${selectedThemes.teamA?.text || 'text-slate-400'} p-2`}>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {currentGame.rounds.map((round) => {
                    const hasError = roundErrors[`${round.round}-teamA`];
                    return (
                      <tr key={round.round} className="border-b border-slate-700">
                        <td className={`p-2 font-medium flex items-center ${selectedThemes.teamA?.text || 'text-white'}`}>
                          {round.round}
                          {hasError && <AlertTriangle className="h-4 w-4 text-red-400 ml-2" />}
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            min="0"
                            max={round.round}
                            value={round.teamA.bid || ''}
                            onChange={(e) => updateRound(round.round, 'teamA', parseInt(e.target.value) || 0, round.teamA.won)}
                            className="w-16 h-8 bg-slate-700 border-slate-600 text-white text-center rounded"
                            disabled={currentGame.status === 'completed'}
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            min="0"
                            max={round.round}
                            value={round.teamA.won || ''}
                            onChange={(e) => updateRound(round.round, 'teamA', round.teamA.bid, parseInt(e.target.value) || 0)}
                            className="w-16 h-8 bg-slate-700 border-slate-600 text-white text-center rounded"
                            disabled={currentGame.status === 'completed'}
                          />
                        </td>
                        <td className={`p-2 text-center ${selectedThemes.teamA?.accent || 'text-yellow-400'}`}>
                          {round.teamA.bags > 0 ? round.teamA.bags : '-'}
                        </td>
                        <td className="p-2 text-center">
                          <span className={round.teamA.score >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {round.teamA.score || 0}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Team B Scorecard */}
        <Card className={`${selectedThemes.teamB?.background || 'bg-slate-800/50'} border-slate-700`}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className={`${selectedThemes.teamB?.text || 'text-green-400'} text-xl font-bold flex items-center`}>
                {currentGame.teamB.name}
                <Button
                  onClick={() => setShowThemeSelector('teamB')}
                  variant="ghost"
                  size="sm"
                  className="ml-2"
                >
                  <Palette className="h-4 w-4" />
                </Button>
              </CardTitle>
              {currentGame.teamB.players.length > 0 && (
                <div className={`text-sm ${selectedThemes.teamB?.text || 'text-slate-400'} mt-2`}>
                  {currentGame.teamB.players.filter(p => p).map((player, i) => (
                    <div key={i}>{player}</div>
                  ))}
                </div>
              )}
            </div>
            <div className={`text-3xl font-bold ${selectedThemes.teamB?.accent || 'text-white'}`}>
              {totalScores.teamB}
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-600">
                    <th className={`text-left ${selectedThemes.teamB?.text || 'text-slate-300'} p-2`}>Round</th>
                    <th className={`text-center ${selectedThemes.teamB?.text || 'text-slate-400'} p-2`}>Bid</th>
                    <th className={`text-center ${selectedThemes.teamB?.text || 'text-slate-400'} p-2`}>Won</th>
                    <th className={`text-center ${selectedThemes.teamB?.text || 'text-slate-400'} p-2`}>Bags</th>
                    <th className={`text-center ${selectedThemes.teamB?.text || 'text-slate-400'} p-2`}>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {currentGame.rounds.map((round) => {
                    const hasError = roundErrors[`${round.round}-teamB`];
                    return (
                      <tr key={round.round} className="border-b border-slate-700">
                        <td className={`p-2 font-medium flex items-center ${selectedThemes.teamB?.text || 'text-white'}`}>
                          {round.round}
                          {hasError && <AlertTriangle className="h-4 w-4 text-red-400 ml-2" />}
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            min="0"
                            max={round.round}
                            value={round.teamB.bid || ''}
                            onChange={(e) => updateRound(round.round, 'teamB', parseInt(e.target.value) || 0, round.teamB.won)}
                            className="w-16 h-8 bg-slate-700 border-slate-600 text-white text-center rounded"
                            disabled={currentGame.status === 'completed'}
                          />
                        </td>
                        <td className="p-2">
                          <input
                            type="number"
                            min="0"
                            max={round.round}
                            value={round.teamB.won || ''}
                            onChange={(e) => updateRound(round.round, 'teamB', round.teamB.bid, parseInt(e.target.value) || 0)}
                            className="w-16 h-8 bg-slate-700 border-slate-600 text-white text-center rounded"
                            disabled={currentGame.status === 'completed'}
                          />
                        </td>
                        <td className={`p-2 text-center ${selectedThemes.teamB?.accent || 'text-yellow-400'}`}>
                          {round.teamB.bags > 0 ? round.teamB.bags : '-'}
                        </td>
                        <td className="p-2 text-center">
                          <span className={round.teamB.score >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {round.teamB.score || 0}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Theme Selector Modal */}
      {showThemeSelector && (
        <ThemeSelector
          team={showThemeSelector}
          themes={availableThemes(showThemeSelector)}
          onSelect={(theme) => handleThemeSelect(theme, showThemeSelector)}
          onClose={() => setShowThemeSelector(null)}
          currentGame={currentGame}
          previewTeam={showThemeSelector}
        />
      )}

      {/* Game Complete Modal */}
      {showCompleteModal && (
        <GameCompleteModal
          winner={totalScores.teamA > totalScores.teamB ? currentGame.teamA.name : currentGame.teamB.name}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};
