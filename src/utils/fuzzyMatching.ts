
// Fuzzy matching utilities for neighborhood names
export const calculateSimilarity = (str1: string, str2: string): number => {
  const normalize = (str: string) => str.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');
  
  const s1 = normalize(str1);
  const s2 = normalize(str2);
  
  // Exact match
  if (s1 === s2) return 1.0;
  
  // Check if one contains the other
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;
  
  // Levenshtein distance
  const levenshteinSimilarity = 1 - (levenshteinDistance(s1, s2) / Math.max(s1.length, s2.length));
  
  // Word overlap similarity
  const wordSimilarity = calculateWordOverlap(s1, s2);
  
  // Return the higher of the two similarities
  return Math.max(levenshteinSimilarity, wordSimilarity);
};

const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) {
    matrix[0][i] = i;
  }
  
  for (let j = 0; j <= str2.length; j++) {
    matrix[j][0] = j;
  }
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  
  return matrix[str2.length][str1.length];
};

const calculateWordOverlap = (str1: string, str2: string): number => {
  const words1 = str1.split(/\s+/).filter(word => word.length > 2);
  const words2 = str2.split(/\s+/).filter(word => word.length > 2);
  
  if (words1.length === 0 || words2.length === 0) return 0;
  
  let matches = 0;
  for (const word1 of words1) {
    for (const word2 of words2) {
      if (word1 === word2 || word1.includes(word2) || word2.includes(word1)) {
        matches++;
        break;
      }
    }
  }
  
  return matches / Math.max(words1.length, words2.length);
};

export const findBestMatch = (
  target: string, 
  candidates: string[], 
  threshold: number = 0.6
): { match: string; similarity: number } | null => {
  let bestMatch = null;
  let bestSimilarity = 0;
  
  for (const candidate of candidates) {
    const similarity = calculateSimilarity(target, candidate);
    if (similarity > bestSimilarity && similarity >= threshold) {
      bestSimilarity = similarity;
      bestMatch = candidate;
    }
  }
  
  return bestMatch ? { match: bestMatch, similarity: bestSimilarity } : null;
};
