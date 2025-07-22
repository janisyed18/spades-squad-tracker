import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Home } from "lucide-react";
import { Game, Round } from "@/types/game";
import { RoundInput } from "./RoundInput";
import { ScoreDisplay } from "./ScoreDisplay";
import { GameCompleteModal } from "./GameCompleteModal";
import { ThemeSelector } from "./ThemeSelector";
import { calculateScore, calculateBags } from "@/utils/gameLogic";

interface FlexibleScorecardProps {
  game: Game;
  onGameComplete: (game: Game) => void;
  onBackToDashboard: () => void;
  onUpdateRound?: (
    gameId: string,
    roundNumber: number,
    teamId: string,
    bid: number,
    won: number,
    bags: number,
    score: number
  ) => void;
}

type Theme = {
  id: string;
  name: string;
  background: string;
  text: string;
  accent: string;
};

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

export const FlexibleScorecard = ({
  game,
  onGameComplete,
  onBackToDashboard,
  onUpdateRound,
}: FlexibleScorecardProps) => {
  const [currentGame, setCurrentGame] = useState<Game>(game);
  const [totalScores, setTotalScores] = useState<{ [teamId: string]: number }>({});
  const [totalBags, setTotalBags] = useState<{ [teamId: string]: number }>({});
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [selectedThemes, setSelectedThemes] = useState<{
    [teamId: string]: Theme;
  }>({});
  const [showThemeSelector, setShowThemeSelector] = useState<string | null>(null);
  const [roundErrors, setRoundErrors] = useState<{ [key: string]: boolean }>({});

  // Load saved themes from localStorage
  useEffect(() => {
    const savedThemes = localStorage.getItem(`game-themes-${currentGame.id}`);
    if (savedThemes) {
      setSelectedThemes(JSON.parse(savedThemes));
    }
  }, [currentGame.id]);

  // Save themes to localStorage whenever they change
  useEffect(() => {
    if (Object.keys(selectedThemes).length > 0) {
      localStorage.setItem(
        `game-themes-${currentGame.id}`,
        JSON.stringify(selectedThemes)
      );
    }
  }, [selectedThemes, currentGame.id]);

  // Calculate scores
  useEffect(() => {
    const scores: { [teamId: string]: number } = {};
    const bags: { [teamId: string]: number } = {};

    currentGame.teams.forEach(team => {
      let teamScore = 0;
      let teamBags = 0;

      currentGame.rounds.forEach(round => {
        const teamData = round.teams[team.id];
        if (teamData) {
          teamScore += teamData.score;
          teamBags += teamData.bags;
        }
      });

      // Apply bag penalties
      const bagPenalty = Math.floor(teamBags / 5) * 50;
      scores[team.id] = teamScore - bagPenalty;
      bags[team.id] = teamBags % 5;
    });

    setTotalScores(scores);
    setTotalBags(bags);
  }, [currentGame.rounds, currentGame.teams]);

  const validateRoundInputs = (
    roundNumber: number,
    bid: number,
    won: number
  ) => {
    return bid <= roundNumber && won <= roundNumber && bid >= 0 && won >= 0;
  };

  const updateRound = async (
    roundNumber: number,
    teamId: string,
    bid: number,
    won: number
  ) => {
    const currentRound = currentGame.rounds.find(r => r.round === roundNumber);
    if (!currentRound) return;

    // Validate total won tricks doesn't exceed round number
    const otherTeamsWon = Object.entries(currentRound.teams)
      .filter(([id]) => id !== teamId)
      .reduce((sum, [_, data]) => sum + data.won, 0);

    if (won + otherTeamsWon > roundNumber) {
      won = Math.max(0, roundNumber - otherTeamsWon);
    }

    if (won < 0) {
      won = 0;
    }

    const isValid = validateRoundInputs(roundNumber, bid, won);
    const errorKey = `${roundNumber}-${teamId}`;

    setRoundErrors(prev => ({
      ...prev,
      [errorKey]: !isValid,
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
            teams: {
              ...round.teams,
              [teamId]: { bid, won, bags, score }
            }
          };
        }
        return round;
      }),
    }));

    if (onUpdateRound) {
      await onUpdateRound(
        currentGame.id,
        roundNumber,
        teamId,
        bid,
        won,
        bags,
        score
      );
    }
  };

  const handleCompleteGame = () => {
    setShowCompleteModal(true);
  };

  const handleModalClose = () => {
    setShowCompleteModal(false);
    const winnerTeamId = Object.entries(totalScores).reduce((winner, [teamId, score]) => 
      score > (totalScores[winner] || -Infinity) ? teamId : winner
    , Object.keys(totalScores)[0]);
    
    const winnerTeam = currentGame.teams.find(t => t.id === winnerTeamId);

    const completedGame: Game = {
      ...currentGame,
      status: "completed",
      winner: winnerTeam?.name || "Unknown",
      finalScores: totalScores,
      finishedAt: new Date(),
    };

    onGameComplete(completedGame);
  };

  const handleThemeSelect = (theme: Theme, teamId: string) => {
    setSelectedThemes(prev => ({
      ...prev,
      [teamId]: theme,
    }));
    setShowThemeSelector(null);
  };

  const isGameComplete = currentGame.rounds.every(round =>
    currentGame.teams.every(team => {
      const teamData = round.teams[team.id];
      return teamData && 
        teamData.bid >= 0 &&
        teamData.won >= 0 &&
        validateRoundInputs(round.round, teamData.bid, teamData.won);
    })
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
            <Home className="h-4 w-4 mr-2" />
            Spades Scorecard
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {currentGame.teams.map(t => t.name).join(' vs ')}
            </h2>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span>Started: {currentGame.createdAt.toLocaleString()}</span>
              {currentGame.finishedAt && (
                <span>Finished: {currentGame.finishedAt.toLocaleString()}</span>
              )}
            </div>
          </div>
        </div>

        {isGameComplete && currentGame.status !== "completed" && (
          <Button
            onClick={handleCompleteGame}
            className="bg-green-600 hover:bg-green-700"
          >
            <Trophy className="h-4 w-4 mr-2" />
            Complete Game
          </Button>
        )}
      </div>

      {/* Team Scores */}
      <div className={`grid gap-6 ${
        currentGame.teams.length <= 2 ? 'md:grid-cols-2' :
        currentGame.teams.length <= 4 ? 'md:grid-cols-2 lg:grid-cols-4' :
        'md:grid-cols-3 lg:grid-cols-4'
      }`}>
        {currentGame.teams.map((team, index) => (
          <Card key={team.id} className={`${
            selectedThemes[team.id]?.background || "bg-slate-800/50"
          } border-slate-700`}>
            <CardHeader>
              <CardTitle className={`${
                selectedThemes[team.id]?.text || TEAM_COLORS[index % TEAM_COLORS.length]
              } text-xl font-bold flex items-center justify-between`}>
                <div>
                  <div>{team.name}</div>
                  <div className="text-sm font-normal space-y-1">
                    {team.players.map((player, idx) => (
                      <div key={idx} className="text-slate-300">{player}</div>
                    ))}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowThemeSelector(team.id)}
                  className="ml-2"
                >
                  🎨
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">
                  {totalScores[team.id] || 0}
                </div>
                <div className="text-sm text-slate-400">
                  🎒 {totalBags[team.id] || 0} bags
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Team Scorecards */}
      <div className={`grid gap-6 ${
        currentGame.teams.length <= 2 ? 'md:grid-cols-2' :
        currentGame.teams.length <= 4 ? 'md:grid-cols-2 lg:grid-cols-2' :
        'md:grid-cols-1 lg:grid-cols-2'
      }`}>
        {currentGame.teams.map((team, index) => (
          <Card
            key={team.id}
            className={`${
              selectedThemes[team.id]?.background || "bg-slate-800/50"
            } border-slate-700`}
          >
            <CardHeader>
              <CardTitle
                className={`${
                  selectedThemes[team.id]?.text || TEAM_COLORS[index % TEAM_COLORS.length]
                } text-xl font-bold`}
              >
                {team.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-600">
                      <th className={`text-left ${selectedThemes[team.id]?.text || "text-slate-300"} p-2`}>
                        Round
                      </th>
                      <th className={`text-center ${selectedThemes[team.id]?.text || "text-slate-400"} p-2`}>
                        Bid
                      </th>
                      <th className={`text-center ${selectedThemes[team.id]?.text || "text-slate-400"} p-2`}>
                        Won
                      </th>
                      <th className={`text-center ${selectedThemes[team.id]?.text || "text-slate-400"} p-2`}>
                        Bags
                      </th>
                      <th className={`text-center ${selectedThemes[team.id]?.text || "text-slate-400"} p-2`}>
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentGame.rounds.map((round) => {
                      const teamData = round.teams[team.id] || { bid: 0, won: 0, bags: 0, score: 0 };
                      return (
                        <tr key={round.round} className="border-b border-slate-700">
                          <td className={`p-2 ${selectedThemes[team.id]?.text || "text-slate-300"}`}>
                            <div className="flex items-center">
                              {round.round}
                              {roundErrors[`${round.round}-${team.id}`] && (
                                <span className="ml-2 text-red-500">⚠️</span>
                              )}
                            </div>
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min="0"
                              max={round.round}
                              value={teamData.bid}
                              onChange={(e) => updateRound(round.round, team.id, parseInt(e.target.value) || 0, teamData.won)}
                              disabled={currentGame.status === "completed"}
                              className="w-16 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-center text-white"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              min="0"
                              max={round.round}
                              value={teamData.won}
                              onChange={(e) => updateRound(round.round, team.id, teamData.bid, parseInt(e.target.value) || 0)}
                              disabled={currentGame.status === "completed"}
                              className="w-16 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-center text-white"
                            />
                          </td>
                          <td className={`p-2 text-center ${selectedThemes[team.id]?.text || "text-slate-300"}`}>
                            {teamData.bags}
                          </td>
                          <td className={`p-2 text-center ${selectedThemes[team.id]?.text || "text-slate-300"}`}>
                            {teamData.score}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Theme Selector Modal */}
      {showThemeSelector && (
        <ThemeSelector
          team={showThemeSelector}
          themes={[]}
          onSelect={(theme) => handleThemeSelect(theme, showThemeSelector)}
          onClose={() => setShowThemeSelector(null)}
          currentGame={currentGame}
          previewTeam={showThemeSelector}
        />
      )}

      {/* Game Complete Modal */}
      {showCompleteModal && (
        <GameCompleteModal
          winner={
            currentGame.teams.find(t => t.id === Object.entries(totalScores).reduce((winner, [teamId, score]) => 
              score > (totalScores[winner] || -Infinity) ? teamId : winner
            , Object.keys(totalScores)[0]))?.name || "Unknown"
          }
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};