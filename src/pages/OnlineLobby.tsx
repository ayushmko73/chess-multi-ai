import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Copy } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

export default function OnlineLobby() {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const createRoom = () => {
    // In a real app we might store this in DB, but for realtime broadcast 
    // we just need a unique string. 
    const newId = Math.random().toString(36).substring(2, 9);
    navigate(`/online/${newId}`);
  };

  const joinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId.trim()) {
      navigate(`/online/${roomId}`);
    }
  };

  if (!supabase) {
    return (
       <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
         <h2 className="text-2xl font-bold text-red-500 mb-4">Supabase Not Configured</h2>
         <p className="text-stone-400 mb-8">Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment to use Online Multiplayer.</p>
         <Link to="/" className="text-amber-400 hover:underline">Return to Menu</Link>
       </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 left-4">
        <Link to="/" className="inline-flex items-center text-stone-400 hover:text-white transition-colors">
          <ArrowLeft className="mr-2" size={20} /> Back to Menu
        </Link>
      </div>

      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-400 mb-2">Online Multiplayer</h1>
          <p className="text-stone-400">Create a room or join a friend's game.</p>
        </div>

        <div className="bg-stone-800 p-8 rounded-2xl border border-stone-700 space-y-6">
          <button 
            onClick={createRoom}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            Create New Room <ArrowRight size={20} />
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-stone-800 text-stone-400">Or join existing</span>
            </div>
          </div>

          <form onSubmit={joinRoom} className="space-y-4">
            <div>
              <label htmlFor="room" className="block text-sm font-medium text-stone-300 mb-1">Room Code</label>
              <input
                type="text"
                id="room"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter code..."
                className="w-full bg-stone-900 border border-stone-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <button 
              type="submit"
              disabled={!roomId.trim()}
              className="w-full bg-stone-700 hover:bg-stone-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Join Game
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}