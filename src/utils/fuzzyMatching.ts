
// Enhanced fuzzy matching utilities for neighborhood names
interface NeighborhoodAlias {
  [key: string]: string[];
}

// Common neighborhood aliases and variations
const NEIGHBORHOOD_ALIASES: NeighborhoodAlias = {
  'downtown': ['city center', 'central', 'core', 'cbd', 'financial district'],
  'gaslamp quarter': ['gaslamp', 'historic district', 'downtown gaslamp'],
  'mission beach': ['mission bay', 'mission area', 'the mission'],
  'pacific beach': ['pb', 'pacific bay', 'pacific coast'],
  'la jolla': ['lajolla', 'la jolla village', 'la jolla shores'],
  'little italy': ['little italy district', 'italia', 'italian quarter'],
  'mission valley': ['mission val', 'mv', 'mission center'],
  'balboa park': ['balboa', 'park area', 'balboa district'],
  'hillcrest': ['hill crest', 'hillcrest district', 'uptown'],
  'sunset cliffs': ['sunset', 'cliffs', 'ob sunset'],
  'ocean beach': ['ob', 'ocean bay', 'beach'],
  'south beach': ['south bay', 'southern beach', 'sobe'],
  'brickell': ['brickell avenue', 'brickell district', 'downtown brickell'],
  'wynwood': ['wynwood arts', 'wynwood district', 'arts district'],
  'lodo': ['lower downtown', 'lo do', 'downtown denver'],
  'capitol hill': ['cap hill', 'capitol', 'capitol district'],
  'rino': ['river north', 'ri no', 'arts district'],
  'south austin': ['south atx', 'so austin', 'south side'],
  'east austin': ['east atx', 'easty', 'east side'],
  'third street': ['3rd street', 'third st', 'promenade'],
  'venice beach': ['venice', 'venice boardwalk', 'venice bay']
};

// Extract key terms from neighborhood names
const extractKeyTerms = (str: string): string[] => {
  const normalized = str.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');
  const words = normalized.split(/\s+/).filter(word => word.length > 2);
  
  // Remove common words that don't help with matching
  const stopWords = ['the', 'and', 'area', 'district', 'neighborhood', 'zone', 'region'];
  return words.filter(word => !stopWords.includes(word));
};

// Check if neighborhoods are aliases of each other
const areAliases = (str1: string, str2: string): boolean => {
  const normalized1 = str1.toLowerCase().trim();
  const normalized2 = str2.toLowerCase().trim();
  
  for (const [key, aliases] of Object.entries(NEIGHBORHOOD_ALIASES)) {
    const allVariants = [key, ...aliases];
    const hasFirst = allVariants.some(variant => 
      normalized1.includes(variant) || variant.includes(normalized1)
    );
    const hasSecond = allVariants.some(variant => 
      normalized2.includes(variant) || variant.includes(normalized2)
    );
    
    if (hasFirst && hasSecond) {
      return true;
    }
  }
  
  return false;
};

export const calculateSimilarity = (str1: string, str2: string): number => {
  const normalize = (str: string) => str.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');
  
  const s1 = normalize(str1);
  const s2 = normalize(str2);
  
  // Exact match
  if (s1 === s2) return 1.0;
  
  // Check for neighborhood aliases
  if (areAliases(s1, s2)) return 0.95;
  
  // Check if one contains the other
  if (s1.includes(s2) || s2.includes(s1)) return 0.9;
  
  // Key terms overlap (higher weight for neighborhood matching)
  const keyTermsSimilarity = calculateKeyTermsOverlap(s1, s2);
  if (keyTermsSimilarity > 0.8) return keyTermsSimilarity;
  
  // Levenshtein distance
  const levenshteinSimilarity = 1 - (levenshteinDistance(s1, s2) / Math.max(s1.length, s2.length));
  
  // Word overlap similarity
  const wordSimilarity = calculateWordOverlap(s1, s2);
  
  // Phonetic similarity (simplified soundex-like)
  const phoneticSimilarity = calculatePhoneticSimilarity(s1, s2);
  
  // Return the highest similarity score
  return Math.max(levenshteinSimilarity, wordSimilarity, phoneticSimilarity, keyTermsSimilarity);
};

const calculateKeyTermsOverlap = (str1: string, str2: string): number => {
  const terms1 = extractKeyTerms(str1);
  const terms2 = extractKeyTerms(str2);
  
  if (terms1.length === 0 || terms2.length === 0) return 0;
  
  let matches = 0;
  for (const term1 of terms1) {
    for (const term2 of terms2) {
      // Exact match
      if (term1 === term2) {
        matches++;
        break;
      }
      // Partial match (one contains the other)
      if (term1.includes(term2) || term2.includes(term1)) {
        matches += 0.8;
        break;
      }
      // Similar terms (3+ chars and 80% similarity)
      if (term1.length >= 3 && term2.length >= 3) {
        const similarity = 1 - (levenshteinDistance(term1, term2) / Math.max(term1.length, term2.length));
        if (similarity >= 0.8) {
          matches += similarity;
          break;
        }
      }
    }
  }
  
  return matches / Math.max(terms1.length, terms2.length);
};

const calculatePhoneticSimilarity = (str1: string, str2: string): number => {
  const phoneticCode = (str: string): string => {
    // Simplified phonetic algorithm
    return str
      .replace(/[aeiou]/g, '') // Remove vowels
      .replace(/[bp]/g, '1')    // Similar sounds
      .replace(/[ck]/g, '2')
      .replace(/[dt]/g, '3')
      .replace(/[fv]/g, '4')
      .replace(/[gj]/g, '5')
      .replace(/[mn]/g, '6')
      .replace(/[lr]/g, '7')
      .replace(/[sz]/g, '8')
      .slice(0, 4); // Take first 4 characters
  };
  
  const code1 = phoneticCode(str1);
  const code2 = phoneticCode(str2);
  
  if (code1 === code2) return 0.7; // Good phonetic match
  
  const similarity = 1 - (levenshteinDistance(code1, code2) / Math.max(code1.length, code2.length));
  return similarity * 0.6; // Lower weight than exact matches
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
  threshold: number = 0.3 // Lowered from 0.6 to 0.3 for more matches
): { match: string; similarity: number } | null => {
  let bestMatch = null;
  let bestSimilarity = 0;
  
  console.log(`🔍 Finding best match for "${target}" among ${candidates.length} candidates with threshold ${threshold}`);
  
  for (const candidate of candidates) {
    const similarity = calculateSimilarity(target, candidate);
    console.log(`   "${target}" vs "${candidate}" = ${similarity.toFixed(3)}`);
    
    if (similarity > bestSimilarity && similarity >= threshold) {
      bestSimilarity = similarity;
      bestMatch = candidate;
    }
  }
  
  const result = bestMatch ? { match: bestMatch, similarity: bestSimilarity } : null;
  console.log(`   🎯 Best match: ${result ? `"${result.match}" (${result.similarity.toFixed(3)})` : 'None found'}`);
  
  return result;
};

// Advanced matching with multiple strategies
export const findBestMatchAdvanced = (
  target: string,
  candidates: string[],
  options: {
    exactThreshold?: number;
    aliasThreshold?: number;
    fuzzyThreshold?: number;
    allowPartialMatches?: boolean;
  } = {}
): { match: string; similarity: number; matchType: string } | null => {
  const {
    exactThreshold = 0.9,
    aliasThreshold = 0.8,
    fuzzyThreshold = 0.3,
    allowPartialMatches = true
  } = options;
  
  let bestMatch = null;
  let bestSimilarity = 0;
  let matchType = 'none';
  
  for (const candidate of candidates) {
    const similarity = calculateSimilarity(target, candidate);
    
    if (similarity >= exactThreshold) {
      matchType = 'exact';
    } else if (similarity >= aliasThreshold && areAliases(target, candidate)) {
      matchType = 'alias';
    } else if (similarity >= fuzzyThreshold) {
      matchType = 'fuzzy';
    } else if (allowPartialMatches && similarity > bestSimilarity) {
      matchType = 'partial';
    }
    
    if (similarity > bestSimilarity && similarity >= fuzzyThreshold) {
      bestSimilarity = similarity;
      bestMatch = candidate;
    }
  }
  
  return bestMatch ? { match: bestMatch, similarity: bestSimilarity, matchType } : null;
};
