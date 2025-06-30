import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, X } from "lucide-react";

interface GameCompleteModalProps {
  winner: string;
  onClose: () => void;
}

export const GameCompleteModal = ({
  winner,
  onClose,
}: GameCompleteModalProps) => {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 5000); // Let the confetti run for 5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="relative overflow-hidden max-w-lg w-full mx-4 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 border-4 border-yellow-300 shadow-2xl transform animate-scale-in">
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="absolute top-3 right-3 text-white hover:bg-white/20 z-10 shadow-lg rounded-full"
        >
          <X className="h-5 w-5" />
        </Button>

        <CardContent className="p-8 text-center relative">
          <div className="mb-6 relative">
            <div className="relative mx-auto w-24 h-24 mb-4">
              <Trophy className="h-24 w-24 text-yellow-200 mx-auto drop-shadow-2xl animate-trophy-shine" />
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-4 bg-black/20 rounded-full blur-md"></div>
            </div>

            <div className="space-y-3">
              <h2 className="text-5xl font-bold text-white drop-shadow-lg animate-fade-in">
                CHAMPIONS!
              </h2>
              <div className="text-3xl font-bold text-yellow-800 bg-white/90 rounded-lg px-6 py-2 mx-auto inline-block shadow-lg transform animate-fade-in animation-delay-300">
                {winner}
              </div>
              <p className="text-xl text-yellow-100 font-semibold drop-shadow-md animate-fade-in animation-delay-500">
                Congratulations on your victory!
              </p>
            </div>
          </div>

          <Button
            onClick={onClose}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold px-10 py-3 text-lg shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-yellow-300 rounded-full"
          >
            Continue the Journey!
          </Button>
        </CardContent>

        {/* Confetti Animation */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-4"
                style={{
                  backgroundColor: [
                    "#ff6b6b",
                    "#4ecdc4",
                    "#45b7d1",
                    "#f9ca24",
                    "#f0932b",
                    "#eb4d4b",
                    "#6c5ce7",
                    "#a29bfe",
                    "#fd79a8",
                    "#fdcb6e",
                  ][i % 10],
                  left: `${Math.random() * 100}%`,
                  animation: `confetti-fall ${2 + Math.random() * 3}s linear ${
                    Math.random() * 5
                  }s infinite`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
