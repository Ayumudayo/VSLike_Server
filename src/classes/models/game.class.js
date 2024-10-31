// src/classes/models/game.class.js

import IntervalManager from '../managers/interval.manager.js';
import { createLocationPacket } from '../../utils/inform/game.inform.js';
import { updateUserLocation } from '../../db/user/user.db.js';

class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
    this.intervalManager = new IntervalManager();
    
    this.startLocationBroadcast()
    this.startLatencyCompensation();
    this.startUserStateSync();
  }

  addUser(user) {
    this.users.push(user);

    // 각 사용자에 대해 위치 업데이트 인터벌 설정
    const interval = 1000 / 30; // 초당 30회 > 30프레임으로 생각
    const callback = () => {
      // 사용자 위치 업데이트 로직
      const newCoords = user.calculatePosition(this.getMaxLatency());
      user.updatePosition(newCoords.x, newCoords.y);
    };
    this.intervalManager.addPlayer(user.id, callback, interval, 'updatePosition');
  }

  getUser(userId) {
    return this.users.find((user) => user.id === userId);
  }

  removeUser(socket) {
    const index = this.users.findIndex((user) => user.socket === socket);
    if (index !== -1) {
      return this.users.splice(index, 1)[0];
    }
  }
  
  getGameId() {
    return this.id;
  }

  getMaxLatency() {
    let maxLatency = 0;
    this.users.forEach((user) => {
      maxLatency = Math.max(maxLatency, user.latency);
    });
    return maxLatency;
  }

  getAllLocation(excludeUserId) {
    const maxLatency = this.getMaxLatency();

    const locationData = this.users
      // .filter((user) => user.id !== excludeUserId) // excludeUserId와 일치하는 유저 제외
      .map((user) => {
        const { x, y } = user.calculatePosition(maxLatency);
        return { id: user.id, playerId: user.playerId, x, y };
      });

    return createLocationPacket(locationData);
  }

  // 인터벌을 통한 위치 업데이트
  startLocationBroadcast() {
    const interval = 1000 / 30; // 초당 30회
    const callback = () => {
      const packet = this.getAllLocation();
      this.users.forEach((user) => {
        user.socket.write(packet);
      });
    };
    this.intervalManager.addPlayer('game', callback, interval, 'broadcastLocation');
  }
  
  // 주기적으로 레이턴시 보정
  startLatencyCompensation() {
    const interval = 100; // 100ms마다 지연 시간 보정
    const callback = () => {
      const maxLatency = this.getMaxLatency();
      this.users.forEach((user) => {
        console.log('위치 보정 인터벌 호출');
        // 지연 시간에 따른 위치 보정 로직
        const adjustedPosition = user.calculatePosition(maxLatency);
        user.updatePosition(adjustedPosition.x, adjustedPosition.y);
      });
    };
    this.intervalManager.addPlayer('latencyCompensation', callback, interval, 'latencyCompensation');
  }

  // 지정 인터벌마다 DB에 위치 정보 동기화
  startUserStateSync() {
    const interval = 5000; // 5초마다 동기화
    const callback = () => {
      this.users.forEach(async (user) => {
        console.log('DB 싱크 인터벌 호출');
        await updateUserLocation(user.x, user.y, user.id)
      });
    };
    this.intervalManager.addPlayer('stateSync', callback, interval, 'stateSync');
  }
}

export default Game;
