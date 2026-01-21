import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Menu from './pages/Menu.tsx';
import LocalGame from './pages/LocalGame.tsx';
import AiGame from './pages/AiGame.tsx';
import OnlineLobby from './pages/OnlineLobby.tsx';
import OnlineGame from './pages/OnlineGame.tsx';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-stone-900 text-stone-100 font-sans selection:bg-amber-500/30">
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/local" element={<LocalGame />} />
          <Route path="/ai" element={<AiGame />} />
          <Route path="/online" element={<OnlineLobby />} />
          <Route path="/online/:roomId" element={<OnlineGame />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}