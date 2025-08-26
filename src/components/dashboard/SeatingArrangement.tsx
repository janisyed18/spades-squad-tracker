import { useState, useMemo } from "react";
import { GameSetup } from "@/types/game";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  ArrowRight,
  ArrowLeft,
  Play,
  Star,
  RefreshCw,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SeatingArrangementProps {
  setup: GameSetup;
  onStartGame: (setup: GameSetup) => void;
  onCancel: () => void;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const SeatingArrangement = ({
  setup,
  onStartGame,
  onCancel,
}: SeatingArrangementProps) => {
  const [shuffledPlayers, setShuffledPlayers] = useState(() =>
    shuffleArray(setup.teamA.players.concat(setup.teamB.players))
  );
  const [direction, setDirection] = useState<"cw" | "ccw">("cw");

  const arrangedPlayers = useMemo(() => {
    const teamAPlayers = new Set(setup.teamA.players);
    return shuffledPlayers.map((name) => ({
      name,
      team: teamAPlayers.has(name) ? ("A" as const) : ("B" as const),
    }));
  }, [shuffledPlayers, setup.teamA.players]);

  const [startingPlayerIndex, setStartingPlayerIndex] = useState(
    Math.floor(Math.random() * arrangedPlayers.length)
  );

  const handleShuffle = () => {
    const allPlayers = setup.teamA.players.concat(setup.teamB.players);
    let newShuffledPlayers = shuffleArray(allPlayers);

    // Ensure no two players from the same team are adjacent if possible
    if (setup.teamA.players.length === setup.teamB.players.length) {
      let interleaved = [];
      const shuffledA = shuffleArray(setup.teamA.players);
      const shuffledB = shuffleArray(setup.teamB.players);
      for (let i = 0; i < shuffledA.length; i++) {
        interleaved.push(shuffledA[i]);
        interleaved.push(shuffledB[i]);
      }
      newShuffledPlayers = interleaved;
    }

    setShuffledPlayers(newShuffledPlayers);
    setStartingPlayerIndex(
      Math.floor(Math.random() * newShuffledPlayers.length)
    );
  };

  const totalPlayers = arrangedPlayers.length;
  const angleStep = (2 * Math.PI) / totalPlayers;

  return (
    <div className="max-w-4xl mx-auto text-white">
      <h2 className="text-3xl font-bold text-center mb-4">
        Seating Arrangement
      </h2>
      <p className="text-center text-slate-400 mb-8">
        Randomly shuffled players. Click the shuffle button to rearrange.
      </p>

      <div className="flex justify-center items-center mb-8 space-x-8">
        <div className="flex items-center space-x-2">
          <Label htmlFor="direction-switch" className="text-slate-300">
            Counter-Clockwise
          </Label>
          <Switch
            id="direction-switch"
            checked={direction === "cw"}
            onCheckedChange={(checked) => setDirection(checked ? "cw" : "ccw")}
          />
          <Label htmlFor="direction-switch" className="text-slate-300">
            Clockwise
          </Label>
        </div>
        <Button
          onClick={handleShuffle}
          variant="outline"
          className="border-slate-600 text-slate-300 hover:bg-slate-700"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Shuffle Players
        </Button>
      </div>

      <div className="flex justify-center items-center mb-12">
        <div className="relative w-[400px] h-[400px] rounded-full border-2 border-dashed border-slate-600 flex items-center justify-center">
          <div
            className="absolute text-slate-400 flex items-center animate-spin-slow"
            style={{
              animationDirection: direction === "cw" ? "normal" : "reverse",
            }}
          >
            {direction === "cw" ? (
              <ArrowRight className="h-8 w-8" />
            ) : (
              <ArrowLeft className="h-8 w-8" />
            )}
          </div>
          {arrangedPlayers.map((player, index) => {
            const angle =
              (direction === "cw" ? index : -index) * angleStep - Math.PI / 2;
            const x = Math.cos(angle) * 180;
            const y = Math.sin(angle) * 180;
            const isStartingPlayer = index === startingPlayerIndex;

            return (
              <div
                key={player.name}
                className="absolute flex flex-col items-center transition-transform duration-500"
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                }}
              >
                <div
                  className={`w-28 h-28 rounded-full flex items-center justify-center text-center p-2 transition-all duration-300 ${
                    player.team === "A"
                      ? "bg-blue-600 hover:bg-blue-500"
                      : "bg-green-600 hover:bg-green-500"
                  } ${
                    isStartingPlayer
                      ? "ring-4 ring-yellow-400 shadow-lg shadow-yellow-400/50"
                      : "ring-2 ring-slate-700"
                  }`}
                >
                  <span className="font-bold text-lg">{player.name}</span>
                </div>
                {isStartingPlayer && (
                  <div className="absolute -top-7 flex items-center bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-semibold">
                    <Star className="h-4 w-4 mr-1.5" />
                    Starter
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-blue-400 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              {setup.teamA.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-slate-300">
              {setup.teamA.players.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              {setup.teamB.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside text-slate-300">
              {setup.teamB.players.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
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
          Back to Setup
        </Button>
        <Button
          onClick={() => onStartGame(setup)}
          className="bg-green-600 hover:bg-green-700 px-8 flex items-center"
        >
          <Play className="h-5 w-5 mr-2" />
          Start Game
        </Button>
      </div>
    </div>
  );
};
