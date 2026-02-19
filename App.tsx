
import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import DrawView from './components/DrawView';
import AdminPanel from './components/AdminPanel';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <nav className="fixed top-0 left-0 right-0 p-4 z-50 flex justify-end">
           {/* Admin access button - hidden usually, but available for demo */}
           <Link to="/admin" className="p-2 opacity-20 hover:opacity-100 transition-opacity">
              <i className="fa-solid fa-gear text-white"></i>
           </Link>
        </nav>
        
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<DrawView />} />
            <Route path="/admin" element={<AdminPanel />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
