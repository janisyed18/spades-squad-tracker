
/**
 * Calculate the score for a round based on Spades rules
 * @param bid - Number of tricks bid
 * @param won - Number of tricks actually won
 * @returns The score for this round (excluding bags)
 */
export const calculateScore = (bid: number, won: number): number => {
  if (won < bid) {
    // Failed to make bid: lose 10 points per bid
    return -bid * 10;
  } else if (bid === won) {
    // Made exact bid: 10 points per bid
    return bid * 10;
  } else {
    // Made more than bid: 10 points per bid (bags are counted separately)
    return bid * 10;
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

/**
 * Format date and time for display
 * @param date - Date to format
 * @returns Formatted date string in M/D/YYYY H:MM AM/PM format
 */
export const formatDateTime = (date: Date): string => {
  return date.toLocaleString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};
