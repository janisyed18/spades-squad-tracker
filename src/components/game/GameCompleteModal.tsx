
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
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="bg-gradient-to-br from-yellow-400 to-orange-500 border-4 border-yellow-300 max-w-md w-full mx-4 relative overflow-hidden">
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 text-white hover:bg-white/20"
        >
          <X className="h-4 w-4" />
        </Button>
        
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <Trophy className="h-16 w-16 text-yellow-900 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-yellow-900 mb-2">
              🎉 CHAMPIONS! 🎉
            </h2>
            <div className="text-2xl font-bold text-yellow-800 mb-4">
              {winner}
            </div>
            <p className="text-yellow-800 text-lg">
              Congratulations on your victory!
            </p>
          </div>

          <Button
            onClick={onClose}
            className="bg-yellow-800 hover:bg-yellow-900 text-white font-bold px-8 py-3 text-lg"
          >
            Continue
          </Button>
        </CardContent>

        {/* Fireworks Animation */}
        {showFireworks && (
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className={`absolute w-2 h-2 rounded-full animate-ping`}
                style={{
                  backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b'][i % 6],
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`star-${i}`}
                className="absolute text-2xl animate-bounce"
                style={{
                  left: `${Math.random() * 90}%`,
                  top: `${Math.random() * 90}%`,
                  animationDelay: `${Math.random() * 1.5}s`
                }}
              >
                ⭐
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
