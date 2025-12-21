import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { NoteEditor } from './pages/NoteEditor';
import { KanbanBoard } from './components/KanbanBoard';
import { GraphView } from './components/GraphView';
import { useNotes } from './hooks/useNotes';
import { CommandPalette } from './components/CommandPalette';
import { ThemeProvider } from './context/ThemeContext';
import { AnimatePresence } from 'framer-motion';
import { Login } from './pages/Login';
import { SplashScreen } from './components/SplashScreen'; // Assuming SplashScreen is needed based on the edit

function App() {
  const [showSplash, setShowSplash] = useState(true); // Re-introducing showSplash state
  const { notes } = useNotes(); // Fetch notes using the hook

  return (
    <ThemeProvider> {/* Re-introducing ThemeProvider */}
      <AnimatePresence> {/* Re-introducing AnimatePresence */}
        {showSplash && (
          <SplashScreen onComplete={() => setShowSplash(false)} /> // Re-introducing SplashScreen
        )}
      </AnimatePresence>
      {!showSplash && ( // Conditional rendering based on showSplash
        <Router>
          <CommandPalette />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/new" element={<NoteEditor />} />
            <Route path="/note/:id" element={<NoteEditor />} />
            <Route path="/board" element={<KanbanBoard />} />
            <Route path="/graph" element={<GraphView notes={notes} />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      )}
    </ThemeProvider>
  );
}

export default App;
