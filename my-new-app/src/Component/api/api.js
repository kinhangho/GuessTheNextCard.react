// api.js

import axios from 'axios';

async function fetchCardFromAPI() {
  try {
    const response = await axios.get('https://deckofcardsapi.com/api/deck/new/draw/?count=1');
    return response.data.cards[0];
  } catch (error) {
    console.error('Error fetching card data:', error);
    throw error; // You can choose to handle or propagate the error as needed.
  }
}

export { fetchCardFromAPI };
