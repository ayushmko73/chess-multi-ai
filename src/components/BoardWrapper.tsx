import { Chessboard } from 'react-chessboard';
import { Play, RotateCcw } from 'lucide-react';
import { Chess } from 'chess.js';

interface BoardWrapperProps {
  game: Chess;
  onDrop: (sourceSquare: string, targetSquare: string) => boolean;
  boardOrientation?: 'white' | 'black';
  onReset?: () => void;
  status: string;
  players?: { top: string; bottom: string };
}

export default function BoardWrapper({ game, onDrop, boardOrientation = 'white', onReset, status, players }: BoardWrapperProps) {
  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-4xl mx-auto p-4">
      {/* Status Bar */}
      <div className="w-full flex justify-between items-center bg-stone-800 p-4 rounded-lg shadow-xl border border-stone-700">
        <div>
          <h2 className="text-xl font-bold text-amber-400">{status}</h2>
          <p className="text-stone-400 text-sm">{game.turn() === 'w' ? "White's Turn" : "Black's Turn"}</p>
        </div>
        {onReset && (
          <button 
            onClick={onReset}
            className="flex items-center gap-2 px-4 py-2 bg-stone-700 hover:bg-stone-600 rounded transition-colors"
          >
            <RotateCcw size={18} />
            Reset
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start w-full justify-center">
        {/* Board Area */}
        <div className="relative w-full max-w-[600px] aspect-square shadow-2xl rounded-lg overflow-hidden border-4 border-stone-800">
          <Chessboard 
            position={game.fen()} 
            onPieceDrop={onDrop}
            boardOrientation={boardOrientation}
            customDarkSquareStyle={{ backgroundColor: '#779954' }}
            customLightSquareStyle={{ backgroundColor: '#e9edcc' }}
            animationDuration={200}
          />
        </div>

        {/* Info Panel */}
        <div className="w-full md:w-64 bg-stone-800 rounded-lg p-6 border border-stone-700 h-full">
          <div className="mb-6">
             <h3 className="text-stone-500 uppercase text-xs font-bold tracking-wider mb-2">Players</h3>
             <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-white border border-stone-400"></div>
                  <span className="font-medium">{players?.bottom || 'White'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-black border border-stone-600"></div>
                  <span className="font-medium">{players?.top || 'Black'}</span>
                </div>
             </div>
          </div>

          <div className="mb-6">
             <h3 className="text-stone-500 uppercase text-xs font-bold tracking-wider mb-2">Move History</h3>
             <div className="h-48 overflow-y-auto pr-2 space-y-1 scrollbar-thin scrollbar-thumb-stone-600">
               {game.history().map((move, i) => (
                 <div key={i} className="grid grid-cols-[30px_1fr] text-sm">
                    <span className="text-stone-500">{Math.floor(i/2) + 1}.</span>
                    <span className={i % 2 === 0 ? 'text-white' : 'text-stone-400'}>{move}</span>
                 </div>
               ))}
               {game.history().length === 0 && <span className="text-stone-600 italic text-sm">No moves yet</span>}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}