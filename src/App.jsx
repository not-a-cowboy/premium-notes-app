import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { NoteEditor } from './pages/NoteEditor';
import { SplashScreen } from './components/SplashScreen';
import { ThemeProvider } from './context/ThemeContext';
import { AnimatePresence } from 'framer-motion';
import { CommandPalette } from './components/CommandPalette';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <ThemeProvider>

      <AnimatePresence>
        {showSplash && (
          <SplashScreen onComplete={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      {!showSplash && (
        <Router>
          <CommandPalette />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new" element={<NoteEditor />} />
            <Route path="/note/:id" element={<NoteEditor />} />
          </Routes>
        </Router>
      )}
    </ThemeProvider>
  );
}

export default App;
