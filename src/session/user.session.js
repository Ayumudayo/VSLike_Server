// src/session/user.session.js

import { userSessions } from './sessions.js';
import { updateUserLocation } from '../db/user/user.db.js';

export const addUser = (user) => {
    return userSessions.add(user);
};

export const removeUser = async (socket) => {
    const user = userSessions.remove((user) => user.socket === socket);
    if (user) {
        await updateUserLocation(user.x, user.y, user.id);
    }
    return user;
};

export const getNextSequence = (id) => {
    const user = getUserById(id);
    return user ? user.getNextSequence() : null;
};

export const getUserById = (id) => {
    return userSessions.find((user) => user.id === id);
};

export const getUserBySocket = (socket) => {
    return userSessions.find((user) => user.socket === socket);
};

export const getAllUsers = () => {
    return userSessions.getAll();
};
