import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Game from './Component/Game/Game'; // Update the import path for Game
import Home from './Component/Home/Home'; // Update the import path for Home
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
      <Routes>
  <Route path="/game" element={<Game />} />
  <Route path="/" element={<Home />} />
</Routes>

      </div>
    </Router>
  );
}

export default App;
