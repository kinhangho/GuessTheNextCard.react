// src/components/Home.js

import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to Guess the Next Card</h1>
      <p>Instructions: Guess the next card correctly to avoid penalties and win the game!</p>
      <Link to="/game">
        <button>Start Game</button>
      </Link>
    </div>
  );
}

export default Home;
