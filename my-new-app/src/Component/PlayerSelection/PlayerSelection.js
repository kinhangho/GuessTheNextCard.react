import React, { useState } from 'react';

function PlayerSelection({ onStartGame }) {
  const [numPlayers, setNumPlayers] = useState(1);
  const [playerNames, setPlayerNames] = useState([]);

  const handleNumPlayersChange = (e) => {
    const selectedPlayers = parseInt(e.target.value, 10);
    setNumPlayers(selectedPlayers);
  };

  const handleStartGame = () => {
    // Pass the selected number of players and player names to the parent component
    onStartGame(numPlayers, playerNames);
  };

  const handlePlayerNameChange = (e, index) => {
    const updatedPlayerNames = [...playerNames];
    updatedPlayerNames[index] = e.target.value;
    setPlayerNames(updatedPlayerNames);
  };

  return (
    <div className="player-selection">
      <h2>Select the Number of Players</h2>
      <div className="player-selection-form">
        <label htmlFor="numPlayers">Number of Players:</label>
        <select
          id="numPlayers"
          name="numPlayers"
          value={numPlayers}
          onChange={handleNumPlayersChange}
        >
          {[...Array(10).keys()].map((num) => (
            <option key={num} value={num + 1}>
              {num + 1}
            </option>
          ))}
        </select>
        <div className="player-names">
          {Array.from({ length: numPlayers }).map((_, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Player ${index + 1} Name`}
              value={playerNames[index] || ''}
              onChange={(e) => handlePlayerNameChange(e, index)}
            />
          ))}
        </div>
        <button onClick={handleStartGame}>Start Game</button>
      </div>
    </div>
  );
}

export default PlayerSelection;
