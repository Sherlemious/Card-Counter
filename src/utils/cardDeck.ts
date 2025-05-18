
import { Card, Suit, Rank } from "../types/card";

export const generateDeck = (): Card[] => {
  const suits: Suit[] = ["hearts", "diamonds", "clubs", "spades"];
  const ranks: Rank[] = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  const deck: Card[] = [];

  suits.forEach((suit) => {
    const color = suit === "hearts" || suit === "diamonds" ? "red" : "black";
    
    ranks.forEach((rank) => {
      deck.push({
        suit,
        rank,
        color,
        played: false
      });
    });
  });

  return deck;
};

export const getSuitSymbol = (suit: Suit): string => {
  switch (suit) {
    case "hearts": return "♥";
    case "diamonds": return "♦";
    case "clubs": return "♣";
    case "spades": return "♠";
  }
};
