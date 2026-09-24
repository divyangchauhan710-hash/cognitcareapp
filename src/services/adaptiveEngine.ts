import { AdaptiveDifficultyState } from '../types';

export interface PerformanceInput {
  accuracy: number; // 0 - 100
  responseTimeMs: number;
  mistakes: number;
  currentDifficulty: number; // 1 - 4
  gameType: string;
}

export interface AdaptiveEngineResult {
  nextDifficulty: number;
  itemCount: number;
  timeLimitSeconds: number;
  hintAvailable: boolean;
  recommendedGame: string;
  feedbackMessage: string;
}

// Configurable constants for difficulty levels
export const DIFFICULTY_CONFIGS: Record<
  number,
  { itemCount: number; timeLimitSeconds: number; hintAvailable: boolean }
> = {
  1: { itemCount: 3, timeLimitSeconds: 10, hintAvailable: true },
  2: { itemCount: 5, timeLimitSeconds: 8, hintAvailable: true },
  3: { itemCount: 7, timeLimitSeconds: 6, hintAvailable: false },
  4: { itemCount: 9, timeLimitSeconds: 5, hintAvailable: false },
};

export class AdaptiveCognitivePersonalizationEngine {
  /**
   * Calculates the next difficulty level and parameters based on task performance
   * Strictly rule-based, non-diagnostic cognitive personalization logic.
   */
  public static calculateNextState(input: PerformanceInput): AdaptiveEngineResult {
    let nextDifficulty = input.currentDifficulty;
    let feedbackMessage = 'Next activity adjusted to your recent performance.';

    // High accuracy (>= 85%) & good response time -> Increase difficulty
    if (input.accuracy >= 85 && input.responseTimeMs < 12000) {
      if (input.currentDifficulty < 4) {
        nextDifficulty = input.currentDifficulty + 1;
        feedbackMessage = 'Excellent work! Next activity adjusted for a slightly higher challenge.';
      } else {
        feedbackMessage = 'Outstanding performance! You are mastering the highest level.';
      }
    }
    // Low accuracy (< 50%) -> Reduce difficulty to prevent cognitive fatigue
    else if (input.accuracy < 50) {
      if (input.currentDifficulty > 1) {
        nextDifficulty = input.currentDifficulty - 1;
        feedbackMessage = 'Next activity adjusted to a comfortable, relaxed pace.';
      } else {
        feedbackMessage = 'Great effort! Next activity will give you extra time.';
      }
    }
    // Moderate performance (50% - 84%) -> Maintain current difficulty
    else {
      feedbackMessage = 'Consistent effort! Next activity matched to your steady performance.';
    }

    const config = DIFFICULTY_CONFIGS[nextDifficulty] || DIFFICULTY_CONFIGS[2];

    // Recommend alternate game type to encourage balanced cognitive domain training
    const ALL_GAMES = ['memory_recall', 'pattern_sequence', 'category_sorting', 'math_puzzles'];
    const otherGames = ALL_GAMES.filter(g => g !== input.gameType);
    const recommendedGame = otherGames[Math.floor(Math.random() * otherGames.length)];

    return {
      nextDifficulty,
      itemCount: config.itemCount,
      timeLimitSeconds: config.timeLimitSeconds,
      hintAvailable: config.hintAvailable,
      recommendedGame,
      feedbackMessage,
    };
  }

  /**
   * Returns default initial difficulty state (Level 2: 5 items, 8 seconds)
   */
  public static getInitialState(): AdaptiveDifficultyState {
    return {
      currentDifficulty: 2,
      consecutiveSuccesses: 0,
      consecutiveFailures: 0,
      itemCount: DIFFICULTY_CONFIGS[2].itemCount,
      timeLimitSeconds: DIFFICULTY_CONFIGS[2].timeLimitSeconds,
      hintAvailable: DIFFICULTY_CONFIGS[2].hintAvailable,
    };
  }
}
