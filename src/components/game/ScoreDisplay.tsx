import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Palette, ShoppingBag } from "lucide-react";
import { Team } from "@/types/game";
import type { Theme } from "./ThemeSelector";

interface ScoreDisplayProps {
  teamA: Team;
  teamB: Team;
  scores: { teamA: number; teamB: number };
  bags: { teamA: number; teamB: number };
  winner?: string;
  createdAt?: Date;
  finishedAt?: Date;
  selectedThemes?: Partial<Record<"teamA" | "teamB", Theme>>;
  onThemeSelect?: (team: "teamA" | "teamB") => void;
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
  onThemeSelect,
}: ScoreDisplayProps) => {
  const formatDateTime = (date: Date): string => {
    return date.toLocaleString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
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
          <div className="text-right">
            Finished: {formatDateTime(finishedAt)}
          </div>
        )}
      </div>

      {/* Team Scores */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Team A Score */}
        <Card
          className={`relative border-2 transition-all duration-300 ${
            scores.teamA > scores.teamB
              ? "border-blue-500 bg-blue-900/30 shadow-lg shadow-blue-500/20"
              : "border-slate-700 bg-slate-800/50"
          }`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-5xl font-bold text-blue-400">{teamA.name}</h3>
              <div className="text-right">
                <div className="text-6xl font-bold text-blue-300">
                  {scores.teamA}
                </div>
                <div className="flex items-center justify-end text-sm text-blue-400">
                  <ShoppingBag className="h-4 w-4 mr-1" />
                  {bags.teamA} bags
                </div>
              </div>
            </div>
            {winner === teamA.name && (
              <div className="absolute top-2 right-2">
                <Trophy className="h-6 w-6 text-yellow-400 animate-pulse" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Team B Score */}
        <Card
          className={`relative border-2 transition-all duration-300 ${
            scores.teamB > scores.teamA
              ? "border-green-500 bg-green-900/30 shadow-lg shadow-green-500/20"
              : "border-slate-700 bg-slate-800/50"
          }`}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-5xl font-bold text-green-400">
                {teamB.name}
              </h3>
              <div className="text-right">
                <div className="text-6xl font-bold text-green-300">
                  {scores.teamB}
                </div>
                <div className="flex items-center justify-end text-sm text-green-400">
                  <ShoppingBag className="h-4 w-4 mr-1" />
                  {bags.teamB} bags
                </div>
              </div>
            </div>
            {winner === teamB.name && (
              <div className="absolute top-2 right-2">
                <Trophy className="h-6 w-6 text-yellow-400 animate-pulse" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
