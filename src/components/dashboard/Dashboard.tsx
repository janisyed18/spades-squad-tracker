
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GameHistory } from './GameHistory';
import { NewGameForm } from './NewGameForm';
import { Scorecard } from '../game/Scorecard';
import { LogOut, Plus, Spade } from 'lucide-react';
import { Game, GameSetup } from '@/types/game';

interface DashboardProps {
  user: string;
  onLogout: () => void;
}

export const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'newGame' | 'game'>('dashboard');
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [games, setGames] = useState<Game[]>([
    {
      id: '1',
      teamA: { name: 'Team Alpha', players: ['Alice', 'Bob'] },
      teamB: { name: 'Team Beta', players: ['Charlie', 'Diana'] },
      rounds: [],
      status: 'completed',
      winner: 'Team Alpha',
      finalScores: { teamA: 340, teamB: 280 },
      createdAt: new Date('2024-01-15')
    },
    {
      id: '2',
      teamA: { name: 'Spade Masters', players: ['John', 'Jane'] },
      teamB: { name: 'Card Sharks', players: ['Mike', 'Sarah'] },
      rounds: [],
      status: 'completed',
      winner: 'Card Sharks',
      finalScores: { teamA: 290, teamB: 360 },
      createdAt: new Date('2024-01-20')
    }
  ]);

  const handleNewGame = (setup: GameSetup) => {
    const newGame: Game = {
      id: Date.now().toString(),
      teamA: setup.teamA,
      teamB: setup.teamB,
      rounds: Array.from({ length: 13 }, (_, i) => ({
        round: i + 1,
        teamA: { bid: 0, won: 0, bags: 0, score: 0 },
        teamB: { bid: 0, won: 0, bags: 0, score: 0 }
      })),
      status: 'active',
      createdAt: new Date()
    };
    
    setCurrentGame(newGame);
    setCurrentView('game');
  };

  const handleGameComplete = (completedGame: Game) => {
    setGames(prev => [completedGame, ...prev]);
    setCurrentGame(null);
    setCurrentView('dashboard');
  };

  const handleViewGame = (game: Game) => {
    setCurrentGame(game);
    setCurrentView('game');
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Spade className="h-6 w-6 text-blue-400" />
            <h1 className="text-xl font-bold text-white">Spades Scorecard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-slate-300">Welcome, {user}</span>
            <Button
              onClick={onLogout}
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentView === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Your Games</h2>
              <Button
                onClick={() => setCurrentView('newGame')}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Game
              </Button>
            </div>
            <GameHistory games={games} onViewGame={handleViewGame} />
          </div>
        )}

        {currentView === 'newGame' && (
          <NewGameForm
            onStartGame={handleNewGame}
            onCancel={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'game' && currentGame && (
          <Scorecard
            game={currentGame}
            onGameComplete={handleGameComplete}
            onBackToDashboard={() => setCurrentView('dashboard')}
          />
        )}
      </main>
    </div>
  );
};
