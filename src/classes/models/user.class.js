// src/classes/models/user.class.js

import BaseEntity from './base.entity.js';

class User extends BaseEntity {
  constructor(socket, id, playerId, latency, coords = { x: 0, y: 0 }) {
    super(id, 'user', coords);
    this.socket = socket;
    this.playerId = playerId;
    this.latency = latency;
    this.sequence = 1;
  }

  getNextSequence() {
    console.log(`getNextSequence(): ${this.sequence}`);
    this.sequence += 1;
    return this.sequence;
  }
}

export default User;
