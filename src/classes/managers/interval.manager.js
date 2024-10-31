// src/classes/managers/interval.manager.js

import BaseManager from './base.manager.js';

class IntervalManager extends BaseManager {
  constructor() {
    super();
    this.playerIntervals = new Map();
    this.globalIntervals = new Map();
  }

  // 플레이어별 인터벌 추가
  addPlayerInterval(playerId, callback, interval, type = 'updatePosition') {
    if (!this.playerIntervals.has(playerId)) {
      this.playerIntervals.set(playerId, new Map());
    }
    const intervalId = setInterval(callback, interval);
    this.playerIntervals.get(playerId).set(type, intervalId);
  }

  // 플레이어별 인터벌 제거
  removePlayerIntervals(playerId) {
    if (this.playerIntervals.has(playerId)) {
      const intervals = this.playerIntervals.get(playerId);
      intervals.forEach((intervalId) => clearInterval(intervalId));
      this.playerIntervals.delete(playerId);
    }
  }

  // 글로벌 인터벌 추가
  addGlobalInterval(id, callback, interval) {
    const intervalId = setInterval(callback, interval);
    this.globalIntervals.set(id, intervalId);
  }

  // 글로벌 인터벌 제거
  removeGlobalInterval(id) {
    if (this.globalIntervals.has(id)) {
      clearInterval(this.globalIntervals.get(id));
      this.globalIntervals.delete(id);
    }
  }

  // 모든 인터벌 제거
  clearAllIntervals() {
    this.playerIntervals.forEach((intervals) => {
      intervals.forEach((intervalId) => clearInterval(intervalId));
    });
    this.playerIntervals.clear();

    this.globalIntervals.forEach((intervalId) => {
      clearInterval(intervalId);
    });
    this.globalIntervals.clear();
  }
}

export default IntervalManager;
