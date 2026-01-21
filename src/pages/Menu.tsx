import { Link } from 'react-router-dom';
import { Users, User, Globe, Trophy } from 'lucide-react';

export default function Menu() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone-800 via-stone-900 to-black">
      <div className="mb-12 text-center">
        <h1 className="text-6xl font-black text-amber-500 mb-4 tracking-tighter drop-shadow-lg">CHESS MASTER</h1>
        <p className="text-stone-400 text-lg">Select your game mode</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        <Link to="/local" className="group relative overflow-hidden bg-stone-800 hover:bg-stone-700 p-8 rounded-2xl border border-stone-700 transition-all hover:scale-105">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users size={120} />
          </div>
          <Users className="w-12 h-12 text-amber-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Local Multiplayer</h2>
          <p className="text-stone-400">Play against a friend on the same device.</p>
        </Link>

        <Link to="/ai" className="group relative overflow-hidden bg-stone-800 hover:bg-stone-700 p-8 rounded-2xl border border-stone-700 transition-all hover:scale-105">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Trophy size={120} />
          </div>
          <Trophy className="w-12 h-12 text-emerald-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Play vs AI</h2>
          <p className="text-stone-400">Challenge the engine. 4 Difficulty levels.</p>
        </Link>

        <Link to="/online" className="group relative overflow-hidden bg-stone-800 hover:bg-stone-700 p-8 rounded-2xl border border-stone-700 transition-all hover:scale-105">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Globe size={120} />
          </div>
          <Globe className="w-12 h-12 text-blue-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Online Multiplayer</h2>
          <p className="text-stone-400">Create a room and invite a friend remotely.</p>
        </Link>
      </div>
    </div>
  );
}