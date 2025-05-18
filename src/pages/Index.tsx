
import React, { useState, useEffect } from "react";
import { Card, Suit } from "@/types/card";
import { generateDeck } from "@/utils/cardDeck";
import SuitSection from "@/components/SuitSection";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  RefreshCcw, 
  BarChart3, 
  RotateCcw, 
  Shield, 
  Zap
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

const Index = () => {
  const [deck, setDeck] = useState<Card[]>([]);
  const [remainingCards, setRemainingCards] = useState(52);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    const newDeck = generateDeck();
    setDeck(newDeck);
  }, []);

  const toggleCardPlayed = (toggledCard: Card) => {
    setDeck(currentDeck => {
      return currentDeck.map(card => {
        if (card.suit === toggledCard.suit && card.rank === toggledCard.rank) {
          const newStatus = !card.played;
          // Update remaining cards count
          setRemainingCards(prev => newStatus ? prev - 1 : prev + 1);
          
          // Show toast with custom styling
          toast({
            title: newStatus ? "Card played" : "Card returned",
            description: `${card.rank} of ${card.suit}`,
            duration: 1500,
            className: newStatus ? "bg-dark-blue border-neon-blue" : "bg-dark-blue border-neon-pink",
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
    toast({
      title: "Deck reset",
      description: "All cards are back in the deck",
      duration: 2000,
      className: "bg-dark-blue border-neon-blue",
    });
  };

  // Group cards by suit
  const heartCards = deck.filter(card => card.suit === "hearts");
  const diamondCards = deck.filter(card => card.suit === "diamonds");
  const clubCards = deck.filter(card => card.suit === "clubs");
  const spadeCards = deck.filter(card => card.suit === "spades");

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
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold neon-text tracking-tight mb-1">Card Counter</h1>
                  <div className="mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-400">Progress</span>
                      <span className="text-sm text-primary">{completionPercentage.toFixed(0)}%</span>
                    </div>
                    <Progress value={completionPercentage} className="h-2" />
                  </div>
                  <p className="text-gray-400 text-sm sm:text-base">
                    Cards remaining: <span className="text-primary font-bold text-lg">{remainingCards}</span>
                    <span className="opacity-75">/52</span>
                  </p>
                </div>
                <div className="flex gap-2 mt-4 sm:mt-0">
                  <Button 
                    onClick={resetDeck}
                    variant="outline"
                    className="border-neon-blue text-neon-blue hover:bg-neon-blue/10"
                  >
                    <RefreshCcw className="mr-1" size={isMobile ? 16 : 18} />
                    Reset Deck
                  </Button>
                  <Button
                    variant="outline"
                    className="border-neon-pink text-neon-pink hover:bg-neon-pink/10"
                  >
                    <BarChart3 className="mr-1" size={isMobile ? 16 : 18} />
                    Stats
                  </Button>
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

        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>Card Counter — Keep track of your game</p>
        </footer>
      </div>
    </motion.div>
  );
};

export default Index;
