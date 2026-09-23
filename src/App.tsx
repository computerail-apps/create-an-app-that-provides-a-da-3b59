import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Nav, NavLink, Container } from '@/lib/ui';
import { Activity, Newspaper, LineChart, TrendingUp } from 'lucide-react';
import Home from '@/pages/Home';
import Macro from '@/pages/Macro';
import Trends from '@/pages/Trends';

function TopNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Nav
      brand={
        <span className="inline-flex items-center gap-2">
          <Activity size={20} className="text-primary" />
          <span>Macro Pulse</span>
        </span>
      }
    >
      <NavLink href="/" active={location.pathname === '/'} onClick={(e: React.MouseEvent) => { e.preventDefault(); navigate('/'); }}>
        <Newspaper size={14} className="mr-2" />Daily Digest
      </NavLink>
      <NavLink href="/macro" active={location.pathname === '/macro'} onClick={(e: React.MouseEvent) => { e.preventDefault(); navigate('/macro'); }}>
        <LineChart size={14} className="mr-2" />Macro Dashboard
      </NavLink>
      <NavLink href="/trends" active={location.pathname === '/trends'} onClick={(e: React.MouseEvent) => { e.preventDefault(); navigate('/trends'); }}>
        <TrendingUp size={14} className="mr-2" />Weekly Trends
      </NavLink>
    </Nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <TopNav />
        <main className="py-8">
          <Container>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/macro" element={<Macro />} />
              <Route path="/trends" element={<Trends />} />
            </Routes>
          </Container>
        </main>
      </div>
    </BrowserRouter>
  );
}
