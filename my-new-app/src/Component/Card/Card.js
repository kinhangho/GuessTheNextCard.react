// card.js
import React from 'react';
import cardImages from '../cardImages/cardImages.js';

function Card({ currentCard }) {
  // Generate the image key using the format used in cardImages
  const imageKey = `${currentCard.rank}${currentCard.suit.charAt(0)}`;

  return (
    <div className="card">
      <img
        src={cardImages[imageKey]}
        alt={`${currentCard.rank} of ${currentCard.suit}`}
      />
    </div>
  );
}

export default Card;
