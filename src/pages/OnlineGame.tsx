import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Chess } from 'chess.js';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import BoardWrapper from '../components/BoardWrapper';

export default function OnlineGame() {
  const { roomId } = useParams();
  const [game, setGame] = useState(new Chess());
  const [playerColor, setPlayerColor] = useState<'w' | 'b' | null>(null);
  const [status, setStatus] = useState('Waiting for opponent...');
  const [copied, setCopied] = useState(false);
  
  // To avoid circular updates
  const isInternalUpdate = useRef(false);

  useEffect(() => {
    if (!supabase || !roomId) return;

    const channel = supabase.channel(`room_${roomId}`, {
      config: {
        broadcast: { self: false },
      },
    });

    channel
      .on('broadcast', { event: 'game-state' }, (payload) => {
        if (payload.payload.fen) {
            const newGame = new Chess(payload.payload.fen);
            setGame(newGame);
            updateStatus(newGame);
        }
      })
      .on('broadcast', { event: 'player-join' }, (payload) => {
         // Simple logic: First to join (who creates?) is usually white, 
         // but here we just assign roles based on local storage or just random for MVP.
         // For this MVP: If I am here and someone joins, I am White, they are Black.
         if (!playerColor) {
             // This logic is tricky without a server authoritative state.
             // We will assume the creator (first loaded) takes White if unassigned,
             // but simpler: Just let users play both sides synced.
             // To enforce sides requires DB presence.
             // We will implement shared board mode (anyone can move for now to keep it simple and robust).
             setStatus('Opponent connected');
         }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
            // Announce we are here
            channel.send({
                type: 'broadcast',
                event: 'player-join',
                payload: { time: Date.now() }
            });
        }
      });

    return () => {
      supabase?.removeChannel(channel);
    };
  }, [roomId, playerColor]);

  const broadcastMove = async (fen: string) => {
    if (!supabase || !roomId) return;
    await supabase.channel(`room_${roomId}`).send({
        type: 'broadcast',
        event: 'game-state',
        payload: { fen }
    });
  };

  function makeMove(sourceSquare: string, targetSquare: string) {
    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: 'q',
      });

      if (move === null) return false;

      const newGame = new Chess(game.fen());
      setGame(newGame);
      updateStatus(newGame);
      broadcastMove(newGame.fen());
      return true;
    } catch (e) {
      return false;
    }
  }

  function updateStatus(g: Chess) {
    if (g.isCheckmate()) setStatus('Checkmate!');
    else if (g.isDraw()) setStatus('Draw');
    else if (g.inCheck()) setStatus('Check!');
    else setStatus(`Playing (${g.turn() === 'w' ? 'White' : 'Black'})`);
  }

  const copyRoomId = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-4 flex justify-between items-center">
        <Link to="/online" className="inline-flex items-center text-stone-400 hover:text-white transition-colors">
          <ArrowLeft className="mr-2" size={20} /> Leave Room
        </Link>
        
        <button 
          onClick={copyRoomId}
          className="flex items-center gap-2 bg-stone-800 px-4 py-2 rounded-lg border border-stone-700 hover:bg-stone-700 transition-colors"
        >
          <span className="text-stone-400">Room:</span> 
          <span className="font-mono font-bold text-white">{roomId}</span>
          {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
        </button>
      </div>

      <BoardWrapper 
        game={game} 
        onDrop={makeMove} 
        status={status}
        onReset={() => {
            const newGame = new Chess();
            setGame(newGame);
            broadcastMove(newGame.fen());
        }}
        players={{ top: 'Opponent', bottom: 'You' }}
      />
      
      <div className="text-center text-stone-500 text-sm p-4">
        <p>Note: This is a shared board. Share the Room ID with a friend.</p>
      </div>
    </div>
  );
}