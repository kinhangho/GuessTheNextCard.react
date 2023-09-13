import React, { useState, useEffect } from 'react';
import Card from '../../Component/Card/Card.js';
import { shuffle } from '../utils/utils.js';
import PlayerSelection from '../PlayerSelection/PlayerSelection.js';
import './Game.css';
import cardImages from '../cardImages/cardImages.js';
import { fetchCardFromAPI } from '../api/api.js'; // Import the API function

 

function Game() {
  const [gameState, setGameState] = useState('notStarted');
  const [deck, setDeck] = useState([]);
  const [currentCard, setCurrentCard] = useState({});
  const [guess, setGuess] = useState('');
  const [penalty, setPenalty] = useState(0);
  const [healthCards, setHealthCards] = useState(2);
  const [numPlayers, setNumPlayers] = useState(1);
  const [players, setPlayers] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [hasPassed, setHasPassed] = useState(false);
  const [hasCorrectGuess, setHasCorrectGuess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentPlayerCorrectGuess, setCurrentPlayerCorrectGuess] = useState(false);
  const [hasChosenToPass, setHasChosenToPass] = useState(Array(1).fill(false)); // Initialize as an array
  const [canPass, setCanPass] = useState(true);

  function initializeDeck() {
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const cards = [];
    for (const suit of suits) {
      for (const rank of ranks) {
        cards.push({ suit, rank });
      }
    }

    const jokers = [{ suit: 'Joker', rank: 'Red' }, { suit: 'Joker', rank: 'Black' }];
    const healthCards = [{ suit: 'Health', rank: 'Card' }, { suit: 'Health', rank: 'Card' }];
    const fullDeck = [...cards, ...jokers, ...healthCards];

    // Shuffle the deck (you can implement a shuffle function)
    shuffle(fullDeck);

    setDeck(fullDeck);
  }

  useEffect(() => {
    // Call the initializeDeck function within the useEffect
    initializeDeck();
  }, []);

  const startGame = (numPlayers) => {
    if (deck.length > 0) {
      setGameState('playing');
      fetchCardFromAPI(); // Call the function to fetch a card from the API
      setNumPlayers(numPlayers);
  
      const initialPlayers = [];
      for (let i = 0; i < numPlayers; i++) {
        initialPlayers.push({ name: `Player ${i + 1}`, healthCards: 0, score: 0 });
      }
      setPlayers(initialPlayers);
    }
  };
  
  

  const updatePlayerScore = (points) => {
    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIndex].score += points;
    setPlayers(updatedPlayers);
  };

  const handleNextPlayer = () => {
    setCurrentPlayerIndex((prevPlayer) => (prevPlayer + 1) % numPlayers);
    setGuess('');
    setPenalty(0);
    setHasPassed(false);
  };

  const handleGuess = (isHigher, color) => {
    const nextCard = deck.pop();
    setCurrentCard(nextCard);
  
    const currentRank = getNumericRank(currentCard.rank);
    const nextRank = getNumericRank(nextCard.rank);
  
    let points = 0;
  
    if (currentRank !== null && nextRank !== null) {
      // Numeric card guessing
      if ((isHigher && nextRank > currentRank) || (!isHigher && nextRank < currentRank)) {
        setGuess('');
        setPenalty(0);
        setHasCorrectGuess(true);
        setCurrentPlayerCorrectGuess(true);
        points = 1; // Normal correct guess earns 1 point
      } else {
        setPenalty(penalty + 1);
        setCurrentPlayerCorrectGuess(false);
        points = -1; // Normal incorrect guess deducts 1 point
      }
    } else if (
      currentRank === null &&
      (currentCard.rank === 'J' || currentCard.rank === 'Q' || currentCard.rank === 'K')
    ) {
      // Jack, Queen, King guessing
      if (
        (currentCard.rank === 'J' || currentCard.rank === 'Q') &&
        color === 'Red' &&
        nextCard.suit === 'Joker'
      ) {
        setGuess('');
        setPenalty(0);
        setHasCorrectGuess(true);
        setCurrentPlayerCorrectGuess(true);
        points = 1; // Correct guess with Joker earns 1 point
        setCanPass(true); // Enable the "Pass" button
      } else if (currentCard.rank === 'K' && color === 'Black' && nextCard.suit === 'Joker') {
        setGuess('');
        setPenalty(0);
        setHasCorrectGuess(true);
        setCurrentPlayerCorrectGuess(true);
        points = 1; // Correct guess with Joker earns 1 point
        setCanPass(true); // Enable the "Pass" button
      } else {
        setPenalty(penalty + 1);
        setCurrentPlayerCorrectGuess(false);
        points = -1; // Incorrect guess with Joker deducts 1 point
      }
    }
    // Check if the next drawn card is the same rank
    if (nextRank !== null && nextCard.rank === currentCard.rank) {
      points -= 2; // Deduct 2 points for the same rank
  
      // Check if the next drawn card is the same rank and color
      if (nextCard.suit === currentCard.suit) {
        points -= 2; // Deduct additional 2 points for the same rank and color
      }
    }
  
    // Check if the next drawn card is a Joker
    if (nextCard.rank === 'Joker') {
      points -= 5; // Deduct 5 points for a Joker
    }
    if (nextCard.suit === 'Health' && nextCard.rank === 'Card') {
      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIndex].healthCards++;
      setPlayers(updatedPlayers);
  
      // Award the current player 1 point for drawing a health card
      points += 1;
    }
    updatePlayerScore(points);
  };
  

  const getNumericRank = (rank) => {
    if (rank === 'A') return 1;
    if (!isNaN(rank)) return parseInt(rank);
    if (rank === 'J') return 11;
    if (rank === 'Q') return 12;
    if (rank === 'K') return 13;
    return null; // Return null for non-numeric ranks (J, Q, K)
  };

  const handleCorrectGuess = () => {
    setShowModal(true);
    if (currentPlayerCorrectGuess) {
      updatePlayerScore(10); // Correct guess earns 10 points
    }
  };

  const handlePass = () => {
    const updatedPassFlags = [...hasChosenToPass];
    updatedPassFlags[currentPlayerIndex] = true;
    setHasChosenToPass(updatedPassFlags); // Update the array
    setShowModal(false);
    // Proceed to the next player's turn
    handleNextPlayer();
  };

  const handleUseHealthCard = () => {
    const updatedPlayers = [...players];
    if (healthCards === 1) {
      updatedPlayers[currentPlayerIndex].healthCards = 0;
      setPlayers(updatedPlayers);
    } else if (healthCards === 2) {
      setShowModal(true);
    }
  };

  const handleSkip = () => {
    if (healthCards === 1) {
      handlePass();
    } else if (healthCards === 2) {
      setShowModal(false);
      setCurrentPlayerCorrectGuess(false);
      handleNextPlayer();
    }
  };

  const handleFlip = () => {
    if (healthCards === 2) {
      const nextCard = deck.pop();
      setCurrentCard(nextCard);
      setShowModal(false);
      setCurrentPlayerCorrectGuess(false);

      const updatedPlayers = [...players];
      updatedPlayers[currentPlayerIndex].healthCards = 0;
      setPlayers(updatedPlayers);
      setHasPassed(false);
    }
  };

  function canPassFunction() {
    return hasCorrectGuess;
  }
  const currentCardImage = cardImages[`${currentCard.rank}${currentCard.suit}`];

  return (
    <div className={`game-container ${gameState === 'playing' ? 'playing' : ''}`}>
      <h1>Guess the Next Card</h1>

      {gameState === 'notStarted' && (
        <div>
          <h2>Start a New Game</h2>
          <PlayerSelection onStartGame={startGame} />
        </div>
      )}

      {gameState === 'playing' && (
       <div>
       <div className="player-info">
         {players.map((player, index) => (
           <div key={index} className="player-container">
             <h2>Player {index + 1}</h2>
             <div className="player-details">
               <p>
                 Health Cards: <span>{player.healthCards}</span>
               </p>
               <p>
                 Score: <span>{player.score}</span>
               </p>
             </div>
           </div>
         ))}
       </div>

          <p>Current Player: {players[currentPlayerIndex].name}</p>
          <img src={cardImages[`${currentCard.rank}${currentCard.suit}`]} alt={currentCard.rank} />

          <div>
            <div
              className={`card ${
                currentCard.suit === 'Hearts' || currentCard.suit === 'Diamonds'
                  ? 'red'
                  : 'black'
              }`}
            >
              <Card card={currentCard} />
            </div>
          </div>

          {currentCard.rank === 'J' || currentCard.rank === 'Q' || currentCard.rank === 'K' ? (
            <>
              <p>Choose Color:</p>
              <button onClick={() => handleGuess(true, 'Red')}>Red</button>
              <button onClick={() => handleGuess(true, 'Black')}>Black</button>
            </>
          ) : (
            <>
              <p>Choose:</p>
              <button onClick={() => handleGuess(true)}>Higher</button>
              <button onClick={() => handleGuess(false)}>Lower</button>
            </>
          )}

          {healthCards === 1 && (
            <button onClick={handleUseHealthCard} disabled={players[currentPlayerIndex].healthCards === 0}>
              Use Health Card
            </button>
          )}

          {healthCards === 2 && (
            <button onClick={handleUseHealthCard} disabled={players[currentPlayerIndex].healthCards === 0}>
              Use Health Cards
            </button>
          )}

          {healthCards === 2 && showModal && (
            <div className="modal">
              <p>Choose an Option:</p>
              <button onClick={handleSkip}>Skip -1</button>
              <button onClick={handleFlip}>Flip -2</button>
            </div>
          )}

{canPass && (
  <button onClick={handlePass}>Pass</button>
)}

          {deck.length === 0 && (
            <button onClick={initializeDeck}>Reset Game</button>
          )}
        </div>
      )}
    </div>
  );
}

export default Game;