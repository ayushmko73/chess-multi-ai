import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { ArrowLeft, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';
import BoardWrapper from '../components/BoardWrapper';
import { getBestMove } from '../lib/engine';

const DIFFICULTIES = ['Beginner', 'Easy', 'Hard', 'Master'];

export default function AiGame() {
  const [game, setGame] = useState(new Chess());
  const [difficulty, setDifficulty] = useState('Easy');
  const [status, setStatus] = useState('Your Turn');
  const [isAiThinking, setIsAiThinking] = useState(false);

  function makeMove(sourceSquare: string, targetSquare: string) {
    if (isAiThinking) return false;

    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q',
      });

      if (move === null) return false;

      setGame(new Chess(game.fen()));
      
      if (game.isGameOver()) {
        setStatus(game.isCheckmate() ? 'You Win!' : 'Draw');
        return true;
      }

      setStatus('AI Thinking...');
      setIsAiThinking(true);
      
      // Small delay for realism and to let UI render
      setTimeout(() => {
        const aiMove = getBestMove(game, difficulty);
        if (aiMove) {
           game.move(aiMove);
           setGame(new Chess(game.fen()));
           if (game.isGameOver()) {
             setStatus(game.isCheckmate() ? 'AI Wins!' : 'Draw');
           } else {
             setStatus(game.inCheck() ? 'Check!' : 'Your Turn');
           }
        }
        setIsAiThinking(false);
      }, 300);

      return true;
    } catch (e) {
      return false;
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <Link to="/" className="inline-flex items-center text-stone-400 hover:text-white transition-colors">
          <ArrowLeft className="mr-2" size={20} /> Back to Menu
        </Link>
        
        <div className="flex items-center gap-4 bg-stone-800 p-2 rounded-lg border border-stone-700">
          <Cpu className="text-emerald-400" />
          <span className="text-sm font-bold text-stone-400 uppercase">AI Level:</span>
          <div className="flex gap-1">
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                onClick={() => {
                  setDifficulty(d);
                  const newGame = new Chess();
                  setGame(newGame);
                  setStatus('New Game');
                }}
                className={`px-3 py-1 text-xs rounded transition-colors ${difficulty === d ? 'bg-emerald-600 text-white' : 'bg-stone-700 text-stone-300 hover:bg-stone-600'}`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      <BoardWrapper 
        game={game} 
        onDrop={makeMove} 
        onReset={() => {
          setGame(new Chess());
          setStatus('New Game');
        }}
        status={status}
        players={{ top: `AI (${difficulty})`, bottom: 'You' }}
      />
    </div>
  );
}