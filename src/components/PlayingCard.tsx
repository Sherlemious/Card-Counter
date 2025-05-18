
import React from "react";
import { Card as CardType } from "../types/card";
import { getSuitSymbol } from "../utils/cardDeck";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PlayingCardProps {
  card: CardType;
  onClick: () => void;
}

const PlayingCard: React.FC<PlayingCardProps> = ({ card, onClick }) => {
  const suitSymbol = getSuitSymbol(card.suit);
  
  return (
    <motion.div 
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "w-14 h-20 sm:w-16 sm:h-24 md:w-20 md:h-28 rounded-xl shadow-lg border transition-all duration-300",
        "hover:shadow-xl transform cursor-pointer relative overflow-hidden",
        card.played ? 
          "opacity-40 bg-gray-800 border-gray-700" : 
          "glass-card card-glow",
        !card.played && "bg-gradient-to-br from-dark-blue to-black"
      )}
    >
      <div className="absolute inset-0 flex flex-col p-2">
        <div className="flex justify-between items-center">
          <span className={`text-${card.color === 'red' ? 'card-red' : 'white'} text-sm sm:text-base md:text-lg font-bold`}>{card.rank}</span>
          <span className={`text-${card.color === 'red' ? 'card-red' : 'white'} text-sm sm:text-base md:text-lg`}>{suitSymbol}</span>
        </div>
        <div className="flex-grow flex items-center justify-center">
          <span className={`text-${card.color === 'red' ? 'card-red' : 'white'} text-2xl sm:text-3xl md:text-4xl`}>{suitSymbol}</span>
        </div>
        <div className="flex justify-between items-center rotate-180">
          <span className={`text-${card.color === 'red' ? 'card-red' : 'white'} text-sm sm:text-base md:text-lg font-bold`}>{card.rank}</span>
          <span className={`text-${card.color === 'red' ? 'card-red' : 'white'} text-sm sm:text-base md:text-lg`}>{suitSymbol}</span>
        </div>
      </div>

      {card.played && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-1 bg-card-red transform rotate-45"></div>
          <div className="w-full h-1 bg-card-red transform -rotate-45"></div>
        </div>
      )}
    </motion.div>
  );
};

export default PlayingCard;
