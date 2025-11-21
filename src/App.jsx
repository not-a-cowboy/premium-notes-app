import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { NoteEditor } from './pages/NoteEditor';
import { SplashScreen } from './components/SplashScreen';
import { AnimatePresence } from 'framer-motion';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      {!showSplash && (
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new" element={<NoteEditor />} />
            <Route path="/note/:id" element={<NoteEditor />} />
          </Routes>
        </Router>
      )}
    </>
  );
}

export default App;
