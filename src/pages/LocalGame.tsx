import { useState } from 'react';
import { Chess } from 'chess.js';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import BoardWrapper from '../components/BoardWrapper';

export default function LocalGame() {
  const [game, setGame] = useState(new Chess());
  const [status, setStatus] = useState('New Game');

  function makeMove(sourceSquare: string, targetSquare: string) {
    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q', // always promote to queen for simplicity
      });

      if (move === null) return false;

      setGame(new Chess(game.fen()));
      updateStatus();
      return true;
    } catch (e) {
      return false;
    }
  }

  function updateStatus() {
    if (game.isCheckmate()) setStatus('Checkmate!');
    else if (game.isDraw()) setStatus('Draw');
    else if (game.inCheck()) setStatus('Check!');
    else setStatus('Playing');
  }

  function resetGame() {
    const newGame = new Chess();
    setGame(newGame);
    setStatus('New Game');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-4">
        <Link to="/" className="inline-flex items-center text-stone-400 hover:text-white transition-colors">
          <ArrowLeft className="mr-2" size={20} /> Back to Menu
        </Link>
      </div>
      <BoardWrapper 
        game={game} 
        onDrop={makeMove} 
        onReset={resetGame}
        status={status}
        players={{ top: 'Player 2 (Black)', bottom: 'Player 1 (White)' }}
      />
    </div>
  );
}