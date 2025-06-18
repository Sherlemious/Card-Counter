import React, { useState, useEffect } from 'react';
import { Card, Suit } from '@/types/card';
import { generateDeck } from '@/utils/cardDeck';
import SuitSection from '@/components/SuitSection';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  RefreshCcw,
  BarChart3,
  RotateCcw,
  Shield,
  Zap,
  Timer,
  Download,
  History,
  Calculator,
  Github,
  Linkedin,
  Globe,
  Play,
  Pause,
  SquareX,
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Index = () => {
  const [deck, setDeck] = useState<Card[]>([]);
  const [remainingCards, setRemainingCards] = useState(52);
  const [runningCount, setRunningCount] = useState(0);
  const [trueCount, setTrueCount] = useState(0);
  const [gameStartTime, setGameStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [gameHistory, setGameHistory] = useState<
    Array<{ id: string; date: Date; cardsPlayed: number; duration: number; finalCount: number }>
  >([]);
  const [showStats, setShowStats] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    const newDeck = generateDeck();
    setDeck(newDeck);
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && gameStartTime) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - gameStartTime.getTime());
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, gameStartTime]);

  // Card counting logic
  const getCardValue = (rank: string): number => {
    if (['2', '3', '4', '5', '6'].includes(rank)) return 1;
    if (['7', '8', '9'].includes(rank)) return 0;
    if (['10', 'J', 'Q', 'K', 'A'].includes(rank)) return -1;
    return 0;
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return `${hours.toString().padStart(2, '0')}:${(minutes % 60).toString().padStart(2, '0')}:${(seconds % 60)
      .toString()
      .padStart(2, '0')}`;
  };

  const startTimer = () => {
    if (!gameStartTime) {
      setGameStartTime(new Date());
    }
    setIsTimerRunning(true);
  };

  const pauseTimer = () => {
    setIsTimerRunning(false);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    if (gameStartTime) {
      const finalTime = Date.now() - gameStartTime.getTime();
      const newGame = {
        id: Date.now().toString(),
        date: new Date(),
        cardsPlayed: 52 - remainingCards,
        duration: finalTime,
        finalCount: runningCount,
      };
      setGameHistory((prev) => [newGame, ...prev.slice(0, 9)]); // Keep last 10 games
    }
    setGameStartTime(null);
    setElapsedTime(0);
  };

  const toggleCardPlayed = (toggledCard: Card) => {
    setDeck((currentDeck) => {
      return currentDeck.map((card) => {
        if (card.suit === toggledCard.suit && card.rank === toggledCard.rank) {
          const newStatus = !card.played;
          const cardValue = getCardValue(card.rank);

          // Update counts
          setRemainingCards((prev) => (newStatus ? prev - 1 : prev + 1));
          setRunningCount((prev) => (newStatus ? prev + cardValue : prev - cardValue));

          // Calculate true count (running count divided by remaining decks)
          const remainingDecks = newStatus ? (remainingCards - 1) / 52 : (remainingCards + 1) / 52;
          setTrueCount(remainingDecks > 0 ? runningCount / remainingDecks : 0);

          // Start timer on first card
          if (newStatus && remainingCards === 52) {
            startTimer();
          }

          // Show toast with custom styling
          toast({
            title: newStatus ? 'Card played' : 'Card returned',
            description: `${card.rank} of ${card.suit} (Count: ${newStatus ? '+' : '-'}${Math.abs(cardValue)})`,
            duration: 1500,
            className: newStatus ? 'bg-dark-blue border-neon-blue' : 'bg-dark-blue border-neon-pink',
          });

          return { ...card, played: newStatus };
        }
        return card;
      });
    });
  };

  const resetDeck = () => {
    setDeck(generateDeck());
    setRemainingCards(52);
    setRunningCount(0);
    setTrueCount(0);
    stopTimer();
    toast({
      title: 'Deck reset',
      description: 'All cards are back in the deck',
      duration: 2000,
      className: 'bg-dark-blue border-neon-blue',
    });
  };

  const exportGameData = () => {
    const data = {
      currentGame: {
        cardsPlayed: 52 - remainingCards,
        runningCount,
        trueCount,
        elapsedTime: formatTime(elapsedTime),
      },
      history: gameHistory,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `card-counter-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Data exported',
      description: 'Your game data has been downloaded',
      className: 'bg-dark-blue border-neon-blue',
    });
  };

  // Group cards by suit
  const heartCards = deck.filter((card) => card.suit === 'hearts');
  const diamondCards = deck.filter((card) => card.suit === 'diamonds');
  const clubCards = deck.filter((card) => card.suit === 'clubs');
  const spadeCards = deck.filter((card) => card.suit === 'spades');

  // Calculate completion percentage
  const completionPercentage = ((52 - remainingCards) / 52) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-br from-dark-blue to-black p-4"
    >
      <div className="max-w-6xl mx-auto">
        <header className="mb-6">
          <div className="glass-card rounded-2xl p-5 shadow-lg border border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/10 to-neon-pink/10 opacity-50"></div>
            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div className="flex-1">
                  <h1 className="text-3xl sm:text-4xl font-bold neon-text tracking-tight mb-3">Card Counter</h1>

                  {/* Timer and Counts Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    <div className="glass-card p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Timer size={16} className="text-neon-blue" />
                        <span className="text-xs text-gray-400">Time</span>
                      </div>
                      <p className="text-lg font-mono font-bold text-white">{formatTime(elapsedTime)}</p>
                    </div>

                    <div className="glass-card p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Calculator size={16} className="text-neon-pink" />
                        <span className="text-xs text-gray-400">Running</span>
                      </div>
                      <p
                        className={`text-lg font-mono font-bold ${
                          runningCount > 0 ? 'text-green-400' : runningCount < 0 ? 'text-red-400' : 'text-white'
                        }`}
                      >
                        {runningCount > 0 ? '+' : ''}
                        {runningCount}
                      </p>
                    </div>

                    <div className="glass-card p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <BarChart3 size={16} className="text-neon-blue" />
                        <span className="text-xs text-gray-400">True Count</span>
                      </div>
                      <p
                        className={`text-lg font-mono font-bold ${
                          trueCount > 2 ? 'text-green-400' : trueCount < -2 ? 'text-red-400' : 'text-white'
                        }`}
                      >
                        {trueCount > 0 ? '+' : ''}
                        {trueCount.toFixed(1)}
                      </p>
                    </div>

                    <div className="glass-card p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Shield size={16} className="text-neon-pink" />
                        <span className="text-xs text-gray-400">Remaining</span>
                      </div>
                      <p className="text-lg font-mono font-bold text-white">{remainingCards}</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-400">Progress</span>
                      <span className="text-sm text-primary">{completionPercentage.toFixed(0)}%</span>
                    </div>
                    <Progress value={completionPercentage} className="h-2" />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0 sm:ml-4">
                  {/* Timer Controls Group */}
                  {(isTimerRunning || gameStartTime) && (
                    <div className="flex gap-2 order-1 sm:order-1">
                      {isTimerRunning ? (
                        <Button
                          onClick={pauseTimer}
                          variant="outline"
                          size={isMobile ? 'sm' : 'default'}
                          className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
                        >
                          <Pause size={isMobile ? 14 : 16} />
                          {!isMobile && <span className="ml-1">Pause</span>}
                        </Button>
                      ) : (
                        <Button
                          onClick={startTimer}
                          variant="outline"
                          size={isMobile ? 'sm' : 'default'}
                          className="border-green-500 text-green-500 hover:bg-green-500/10"
                        >
                          <Play size={isMobile ? 14 : 16} />
                          {!isMobile && <span className="ml-1">Resume</span>}
                        </Button>
                      )}

                      {gameStartTime && (
                        <Button
                          onClick={stopTimer}
                          variant="outline"
                          size={isMobile ? 'sm' : 'default'}
                          className="border-red-500 text-red-500 hover:bg-red-500/10"
                        >
                          <SquareX size={isMobile ? 14 : 16} />
                          {!isMobile && <span className="ml-1">Stop</span>}
                        </Button>
                      )}
                    </div>
                  )}

                  {/* Main Action Buttons */}
                  <div className="flex flex-wrap gap-2 order-2 sm:order-2">
                    <Button
                      onClick={resetDeck}
                      variant="outline"
                      size={isMobile ? 'sm' : 'default'}
                      className="border-neon-blue text-neon-blue hover:bg-neon-blue/10"
                    >
                      <RefreshCcw size={isMobile ? 14 : 16} />
                      {!isMobile && <span className="ml-1">Reset</span>}
                    </Button>

                    <Dialog open={showStats} onOpenChange={setShowStats}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size={isMobile ? 'sm' : 'default'}
                          className="border-neon-pink text-neon-pink hover:bg-neon-pink/10"
                        >
                          <History size={isMobile ? 14 : 16} />
                          {!isMobile && <span className="ml-1">History</span>}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="glass-card border-white/10 max-w-md">
                        <DialogHeader>
                          <DialogTitle className="neon-text">Game History</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {gameHistory.length === 0 ? (
                            <p className="text-gray-400 text-center py-4">No games completed yet</p>
                          ) : (
                            gameHistory.map((game) => (
                              <div key={game.id} className="glass-card p-3 rounded-lg">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p className="text-sm text-gray-400">{game.date.toLocaleDateString()}</p>
                                    <p className="text-white">Cards: {game.cardsPlayed}/52</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-gray-400">{formatTime(game.duration)}</p>
                                    <p
                                      className={`font-bold ${
                                        game.finalCount > 0
                                          ? 'text-green-400'
                                          : game.finalCount < 0
                                          ? 'text-red-400'
                                          : 'text-white'
                                      }`}
                                    >
                                      Count: {game.finalCount > 0 ? '+' : ''}
                                      {game.finalCount}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Button
                      onClick={exportGameData}
                      variant="outline"
                      size={isMobile ? 'sm' : 'default'}
                      className="border-purple-500 text-purple-500 hover:bg-purple-500/10"
                    >
                      <Download size={isMobile ? 14 : 16} />
                      {!isMobile && <span className="ml-1">Export</span>}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-neon-blue/5 opacity-30"></div>
          <div className="relative z-10 space-y-6">
            <SuitSection suit="hearts" cards={heartCards} onCardClick={toggleCardPlayed} />
            <SuitSection suit="diamonds" cards={diamondCards} onCardClick={toggleCardPlayed} />
            <SuitSection suit="clubs" cards={clubCards} onCardClick={toggleCardPlayed} />
            <SuitSection suit="spades" cards={spadeCards} onCardClick={toggleCardPlayed} />
          </div>
        </div>

        {/* Enhanced Footer with Social Links */}
        <footer className="mt-8 glass-card rounded-2xl p-6 border border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/5 to-neon-pink/5 opacity-50"></div>
          <div className="relative z-10">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold neon-text mb-2">Card Counter</h3>
              <p className="text-gray-400 text-sm mb-4">Professional card counting tool for blackjack enthusiasts</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-gray-500 text-sm">
                  Created by <span className="text-neon-blue font-semibold">Abdulrahman Mohammed</span>
                </p>
                <p className="text-gray-600 text-xs">© {new Date().getFullYear()} All rights reserved</p>
              </div>

              <div className="flex items-center gap-4">
                <a
                  href="https://www.sherlemious.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card p-2 rounded-lg hover:bg-neon-blue/10 transition-all duration-300 group"
                  title="Portfolio Website"
                >
                  <Globe size={20} className="text-neon-blue group-hover:scale-110 transition-transform" />
                </a>

                <a
                  href="https://github.com/sherlemious"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card p-2 rounded-lg hover:bg-gray-600/10 transition-all duration-300 group"
                  title="GitHub Profile"
                >
                  <Github size={20} className="text-white group-hover:scale-110 transition-transform" />
                </a>

                <a
                  href="https://linkedin.com/in/sherlemious"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card p-2 rounded-lg hover:bg-blue-600/10 transition-all duration-300 group"
                  title="LinkedIn Profile"
                >
                  <Linkedin size={20} className="text-blue-400 group-hover:scale-110 transition-transform" />
                </a>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10 text-center">
              <p className="text-gray-500 text-xs">
                Built with React, TypeScript, and Tailwind CSS • Open source on GitHub
              </p>
            </div>
          </div>
        </footer>
      </div>
    </motion.div>
  );
};

export default Index;
