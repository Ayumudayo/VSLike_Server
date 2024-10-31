// src/session/game.session.js

import Game from '../classes/models/game.class.js';
import { gameSessions } from './sessions.js';

export const addGameSession = (id) => {
    const game = new Game(id);
    return gameSessions.add(game);
};

export const removeGameSession = () => {
    delete gameSessions[0];
};

export const getGameSession = () => {
    return gameSessions.sessions[0];
};

export const getAllGameSessions = () => {
    return gameSessions.getAll();
};
