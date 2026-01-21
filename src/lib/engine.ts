import { Chess } from 'chess.js';

// Piece values for evaluation
const PIECE_VALUES: Record<string, number> = {
  p: 10, n: 30, b: 30, r: 50, q: 90, k: 900
};

// Evaluate board position
const evaluateBoard = (game: Chess): number => {
  const board = game.board();
  let totalEvaluation = 0;

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const piece = board[i][j];
      if (piece) {
        const value = PIECE_VALUES[piece.type];
        totalEvaluation += piece.color === 'w' ? value : -value;
      }
    }
  }
  return totalEvaluation;
};

// Minimax algorithm with Alpha-Beta pruning
const minimax = (game: Chess, depth: number, alpha: number, beta: number, isMaximizingPlayer: boolean): number => {
  if (depth === 0 || game.isGameOver()) {
    return -evaluateBoard(game);
  }

  const moves = game.moves();

  if (isMaximizingPlayer) {
    let maxEval = -Infinity;
    for (const move of moves) {
      game.move(move);
      const evalVal = minimax(game, depth - 1, alpha, beta, false);
      game.undo();
      maxEval = Math.max(maxEval, evalVal);
      alpha = Math.max(alpha, evalVal);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of moves) {
      game.move(move);
      const evalVal = minimax(game, depth - 1, alpha, beta, true);
      game.undo();
      minEval = Math.min(minEval, evalVal);
      beta = Math.min(beta, evalVal);
      if (beta <= alpha) break;
    }
    return minEval;
  }
};

// Get best move based on difficulty
export const getBestMove = (game: Chess, difficulty: string): string => {
  const possibleMoves = game.moves();
  if (possibleMoves.length === 0) return '';

  // Beginner: Completely random
  if (difficulty === 'Beginner') {
    return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
  }

  let depth = 1;
  if (difficulty === 'Easy') depth = 1;
  if (difficulty === 'Hard') depth = 2;
  if (difficulty === 'Master') depth = 3;

  let bestMove = '';
  let bestValue = -Infinity;

  // Shuffle moves to add variety if evaluations are equal
  possibleMoves.sort(() => Math.random() - 0.5);

  for (const move of possibleMoves) {
    game.move(move);
    // We are the AI (Black usually), so we maximize our advantage (minimize white's score in typical eval, but here we flipped eval sign)
    // Actually, let's keep it simple: Standard minimax assumes maximizing score for current player logic usually.
    // Since we simplified eval to (White - Black), Black wants to Minimize the result.
    // However, our minimax function handles the alternating turns.
    // Let's assume the AI plays Black. The eval function returns (White - Black).
    // So Black wants to minimize this value.
    
    // To simplify: Minimax above returns a value from perspective of 'isMaximizingPlayer'.
    // If AI is Black, it wants to MINIMIZE the board evaluation (which is White positive).
    // However, usually engines maximize their OWN score. 
    
    // Let's use a simpler heuristic for the wrapper:
    // We just want the move that results in the best state for the AI.
    
    const boardValue = minimax(game, depth - 1, -Infinity, Infinity, false);
    game.undo();
    
    // Simple toggle: AI is usually black in this app
    // If eval returns (White - Black), Black wants smallest number.
    // But let's assume the Minimax function handles the "Best score for current player" abstraction.
    // Let's just rely on the fact that we want to Pick the move with the best returned value from Minimax.
    // Since we passed `false` (minimizing) to the first recursive call, the minimax returns the best outcome assuming opponent plays perfectly.
    
    // Wait, standard minimax: 
    // Root (Maximizer) -> calls children with Minimizer.
    // We want to find the move that leads to the MAX value returned by the Minimizer step.
    
    if (boardValue > bestValue) {
      bestValue = boardValue;
      bestMove = move;
    }
  }

  return bestMove || possibleMoves[0];
};