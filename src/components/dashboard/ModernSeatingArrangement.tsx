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
  Home,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";

interface ModernSeatingArrangementProps {
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

export const ModernSeatingArrangement = ({
  setup,
  onStartGame,
  onCancel,
}: ModernSeatingArrangementProps) => {
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
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-foreground mb-2">
            Table Arrangement
          </h2>
          <p className="text-muted-foreground text-lg">
            Perfect seating for the perfect game
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mb-12">
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardContent className="flex items-center space-x-4 p-4">
              <Label htmlFor="direction-switch" className="text-sm font-medium">
                Counter-Clockwise
              </Label>
              <Switch
                id="direction-switch"
                checked={direction === "cw"}
                onCheckedChange={(checked) => setDirection(checked ? "cw" : "ccw")}
              />
              <Label htmlFor="direction-switch" className="text-sm font-medium">
                Clockwise
              </Label>
            </CardContent>
          </Card>

          <Button
            onClick={handleShuffle}
            variant="outline"
            className="bg-card/60 backdrop-blur-sm border-border/50 hover:bg-accent/10 h-12 px-6"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Shuffle Seats
          </Button>
        </div>

        {/* Seating Circle */}
        <div className="flex justify-center items-center mb-12">
          <div className="relative">
            {/* Table surface */}
            <div className="w-[500px] h-[500px] rounded-full bg-gradient-to-br from-card to-card/50 backdrop-blur-sm border-4 border-border/30 shadow-2xl flex items-center justify-center">
              {/* Table center with direction indicator */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-primary/10 backdrop-blur-sm border-2 border-primary/20 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: direction === "cw" ? 360 : -360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="text-primary/60"
                  >
                    {direction === "cw" ? (
                      <ArrowRight className="h-8 w-8" />
                    ) : (
                      <ArrowLeft className="h-8 w-8" />
                    )}
                  </motion.div>
                </div>
                
                {/* Center logo */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Home className="h-6 w-6 text-primary/40" />
                </div>
              </div>

              {/* Players around the table */}
              <AnimatePresence>
                {arrangedPlayers.map((player, index) => {
                  const angle =
                    (direction === "cw" ? index : -index) * angleStep - Math.PI / 2;
                  const x = Math.cos(angle) * 220;
                  const y = Math.sin(angle) * 220;
                  const isStartingPlayer = index === startingPlayerIndex;

                  return (
                    <motion.div
                      key={`${player.name}-${index}`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="absolute"
                      style={{
                        transform: `translate(${x}px, ${y}px)`,
                      }}
                    >
                      <div className="flex flex-col items-center">
                        {/* Player seat */}
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className={`w-24 h-24 rounded-full flex items-center justify-center text-center p-2 shadow-lg backdrop-blur-sm transition-all duration-300 ${
                            player.team === "A"
                              ? "bg-gradient-to-br from-info/80 to-info/60 border-2 border-info/30"
                              : "bg-gradient-to-br from-success/80 to-success/60 border-2 border-success/30"
                          } ${
                            isStartingPlayer
                              ? "ring-4 ring-accent shadow-accent/50"
                              : ""
                          }`}
                        >
                          <span className="font-bold text-sm text-white drop-shadow-sm">
                            {player.name}
                          </span>
                        </motion.div>
                        
                        {/* Starting player badge */}
                        {isStartingPlayer && (
                          <motion.div
                            initial={{ scale: 0, y: 10 }}
                            animate={{ scale: 1, y: 0 }}
                            className="absolute -top-8 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center"
                          >
                            <Star className="h-3 w-3 mr-1" />
                            Starter
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Team Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-info/10 to-info/5 backdrop-blur-sm border-info/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-info flex items-center text-xl">
                  <Users className="h-6 w-6 mr-3" />
                  {setup.teamA.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {setup.teamA.players.map((player, index) => (
                    <motion.div
                      key={player}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      className="flex items-center p-2 rounded-lg bg-info/5"
                    >
                      <div className="w-3 h-3 rounded-full bg-info mr-3"></div>
                      <span className="font-medium">{player}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-success/10 to-success/5 backdrop-blur-sm border-success/20 shadow-lg">
              <CardHeader>
                <CardTitle className="text-success flex items-center text-xl">
                  <Users className="h-6 w-6 mr-3" />
                  {setup.teamB.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {setup.teamB.players.map((player, index) => (
                    <motion.div
                      key={player}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                      className="flex items-center p-2 rounded-lg bg-success/5"
                    >
                      <div className="w-3 h-3 rounded-full bg-success mr-3"></div>
                      <span className="font-medium">{player}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            className="bg-card/60 backdrop-blur-sm border-border/50 hover:bg-muted/50 h-12 px-8"
          >
            Back to Setup
          </Button>
          <Button
            onClick={() => onStartGame(setup)}
            className="bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground h-12 px-8 shadow-lg font-medium"
          >
            <Play className="h-5 w-5 mr-2" />
            Start Game
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};