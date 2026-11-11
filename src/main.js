// src/main.js — Application Entry Point for Dhaka Streets: Open World
import { DhakaGame } from './game.js';

window.addEventListener('load', () => {
  window.dhakaGame = new DhakaGame();
});
