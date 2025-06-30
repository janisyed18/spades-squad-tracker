
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, X } from 'lucide-react';

interface GameCompleteModalProps {
  winner: string;
  onClose: () => void;
}

export const GameCompleteModal = ({ winner, onClose }: GameCompleteModalProps) => {
  const [showFireworks, setShowFireworks] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFireworks(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <Card className="relative overflow-hidden max-w-lg w-full mx-4 bg-gradient-to-br from-yellow-300 via-orange-400 to-red-400 border-4 border-yellow-200 shadow-2xl transform animate-scale-in">
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="absolute top-3 right-3 text-white hover:bg-white/20 z-10 shadow-lg"
        >
          <X className="h-5 w-5" />
        </Button>
        
        <CardContent className="p-8 text-center relative">
          {/* 3D Trophy */}
          <div className="mb-6 relative">
            <div className="relative mx-auto w-20 h-20 mb-4">
              <Trophy className="h-20 w-20 text-yellow-800 mx-auto drop-shadow-2xl transform rotate-12 animate-bounce" />
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-black/20 rounded-full blur-sm"></div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-4xl font-bold text-white drop-shadow-lg animate-pulse">
                🎉 CHAMPIONS! 🎉
              </h2>
              <div className="text-2xl font-bold text-yellow-900 bg-white/90 rounded-lg px-4 py-2 mx-auto inline-block shadow-lg transform animate-fade-in">
                {winner}
              </div>
              <p className="text-lg text-yellow-900 font-semibold drop-shadow-md">
                🏆 Congratulations on your victory! 🏆
              </p>
            </div>
          </div>

          <Button
            onClick={onClose}
            className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-bold px-8 py-3 text-lg shadow-2xl transform hover:scale-105 transition-all duration-200 border-2 border-yellow-400"
          >
            🚀 Continue the Journey!
          </Button>
        </CardContent>

        {/* Enhanced Fireworks Animation */}
        {showFireworks && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Colorful bursts */}
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className={`absolute w-3 h-3 rounded-full animate-ping`}
                style={{
                  backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7', '#a29bfe', '#fd79a8', '#fdcb6e'][i % 10],
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: '1.5s'
                }}
              />
            ))}
            
            {/* Floating stars */}
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={`star-${i}`}
                className="absolute text-3xl animate-bounce filter drop-shadow-lg"
                style={{
                  left: `${Math.random() * 90}%`,
                  top: `${Math.random() * 90}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: '2s'
                }}
              >
                {['⭐', '🌟', '✨', '💫', '🎊', '🎉'][i % 6]}
              </div>
            ))}
            
            {/* Confetti */}
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={`confetti-${i}`}
                className="absolute w-2 h-4 animate-pulse"
                style={{
                  backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b'][i % 6],
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  transform: `rotate(${Math.random() * 360}deg)`
                }}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
