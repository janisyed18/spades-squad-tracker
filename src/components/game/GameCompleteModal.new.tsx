import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, X, Star, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
        >
          <Card className="relative overflow-hidden max-w-lg w-full mx-4 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 border-4 border-yellow-300 shadow-2xl">
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="absolute top-3 right-3 text-white hover:bg-white/20 z-10 shadow-lg rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>

            <CardContent className="p-8 text-center relative">
              <motion.div
                className="mb-6 relative"
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
              >
                <div className="relative mx-auto w-32 h-32 mb-4">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Trophy className="h-32 w-32 text-yellow-200 mx-auto drop-shadow-2xl" />
                  </motion.div>
                  <motion.div
                    className="absolute -top-4 -right-4"
                    animate={{
                      scale: [1, 1.5, 1],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Sparkles className="h-8 w-8 text-yellow-200" />
                  </motion.div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-4 bg-black/20 rounded-full blur-md" />
                </div>

                <motion.div
                  className="space-y-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.h2
                    className="text-6xl font-bold text-white drop-shadow-lg"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    CHAMPIONS!
                  </motion.h2>
                  <motion.div
                    className="text-4xl font-bold text-yellow-800 bg-white/90 rounded-lg px-8 py-3 mx-auto inline-block shadow-lg"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    {winner}
                  </motion.div>
                  <motion.div
                    className="flex justify-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          scale: [1, 1.5, 1],
                          rotate: [0, 360],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.2,
                          ease: "easeInOut",
                        }}
                      >
                        <Star className="h-6 w-6 text-yellow-200 fill-yellow-200" />
                      </motion.div>
                    ))}
                  </motion.div>
                  <motion.p
                    className="text-2xl text-yellow-100 font-semibold drop-shadow-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                  >
                    Congratulations on your victory!
                  </motion.p>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <Button
                  onClick={onClose}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold px-10 py-3 text-lg shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-yellow-300 rounded-full"
                >
                  Continue the Journey!
                </Button>
              </motion.div>
            </CardContent>

            {/* Enhanced Confetti Animation */}
            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {Array.from({ length: 100 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    initial={{
                      top: "-10%",
                      left: `${Math.random() * 100}%`,
                      scale: 0,
                    }}
                    animate={{
                      top: "100%",
                      scale: 1,
                      rotate:
                        Math.random() * 360 * (Math.random() > 0.5 ? 1 : -1),
                    }}
                    transition={{
                      duration: 2 + Math.random() * 3,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                      ease: "linear",
                    }}
                    style={{
                      width: `${Math.random() * 10 + 5}px`,
                      height: `${Math.random() * 10 + 5}px`,
                      background: [
                        "#FFD700", // Gold
                        "#FFA500", // Orange
                        "#FF69B4", // Hot Pink
                        "#00CED1", // Turquoise
                        "#9370DB", // Purple
                        "#FF6B6B", // Coral
                        "#4ECDC4", // Mint
                        "#F9CA24", // Yellow
                        "#A3CB38", // Green
                        "#1289A7", // Blue
                      ][i % 10],
                      borderRadius: Math.random() > 0.5 ? "50%" : "0",
                    }}
                  />
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
