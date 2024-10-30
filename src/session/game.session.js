// src/session/game.session.js

import Game from '../classes/models/game.class.js';
import { gameSessions } from './sessions.js';

export const addGameSession = (id) => {
  const game = new Game(id);
  return gameSessions.add(game);
};

export const removeGameSession = (id) => {
  return gameSessions.remove((game) => game.id === id);
};

export const getGameSession = (id) => {
  return gameSessions.find((game) => game.id === id);
};

export const getAllGameSessions = () => {
  return gameSessions.getAll();
};
