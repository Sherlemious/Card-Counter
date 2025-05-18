
import React from "react";
import { Card, Suit } from "../types/card";
import PlayingCard from "./PlayingCard";
import { getSuitSymbol } from "@/utils/cardDeck";
import { motion } from "framer-motion";

interface SuitSectionProps {
  suit: Suit;
  cards: Card[];
  onCardClick: (card: Card) => void;
}

const SuitSection: React.FC<SuitSectionProps> = ({ suit, cards, onCardClick }) => {
  const suitSymbol = getSuitSymbol(suit);
  const color = suit === "hearts" || suit === "diamonds" ? "text-card-red" : "text-white";
  const remainingCards = cards.filter(card => !card.played).length;
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };
  
  return (
    <motion.div 
      className="mb-8 backdrop-blur-sm bg-black/20 p-4 rounded-xl border border-white/10"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
        <h2 className={`text-xl font-bold flex items-center gap-2 ${color}`}>
          <span className="text-3xl">{suitSymbol}</span>
          <span className="capitalize neon-text">{suit}</span>
        </h2>
        <span className="text-sm font-medium text-gray-400 mt-1 sm:mt-0">
          <span className="text-primary font-bold">{remainingCards}</span>
          <span className="opacity-75">/{cards.length} remaining</span>
        </span>
      </div>
      <motion.div 
        className="flex flex-wrap gap-3 justify-center sm:justify-start"
        variants={containerVariants}
      >
        {cards.map((card) => (
          <motion.div key={`${card.suit}-${card.rank}`} variants={itemVariants}>
            <PlayingCard card={card} onClick={() => onCardClick(card)} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default SuitSection;
