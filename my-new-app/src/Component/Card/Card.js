import React from 'react';
import './Card.css';


function Card({ card }) {
  const cardColorClass = card.color === 'Red' ? 'red-card' : 'black-card';

  return (
    <div className={`card ${cardColorClass}`}>
      <p>{`${card.rank} of ${card.suit}`}</p>
    </div>
  );
}

export default Card;
