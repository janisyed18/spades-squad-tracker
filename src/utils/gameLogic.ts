
/**
 * Calculate the score for a round based on Spades rules
 * @param bid - Number of tricks bid
 * @param won - Number of tricks actually won
 * @returns The score for this round
 */
export const calculateScore = (bid: number, won: number): number => {
  if (bid === 0 || won === 0) return 0;
  
  if (bid === won) {
    // Made exact bid: 10 points per bid
    return bid * 10;
  } else if (bid > won) {
    // Failed to make bid: lose 10 points per bid
    return -bid * 10;
  } else {
    // Made more than bid: 10 points per bid + 1 point per extra trick (bag)
    return bid * 10 + (won - bid);
  }
};

/**
 * Calculate the number of bags (extra tricks)
 * @param bid - Number of tricks bid
 * @param won - Number of tricks actually won
 * @returns Number of bags (0 if no extra tricks)
 */
export const calculateBags = (bid: number, won: number): number => {
  if (won > bid) {
    return won - bid;
  }
  return 0;
};

/**
 * Calculate bag penalty
 * @param totalBags - Total number of bags accumulated
 * @returns Penalty points (negative number)
 */
export const calculateBagPenalty = (totalBags: number): number => {
  return Math.floor(totalBags / 5) * 50;
};
