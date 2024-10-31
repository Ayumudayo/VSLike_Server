// src/classes/models/game.class.js

import IntervalManager from '../managers/interval.manager.js';
import { createLocationPacket } from '../../utils/inform/game.inform.js';
import { updateUserLocation } from '../../db/user/user.db.js';

class Game {
    constructor(id) {
        this.id = id;
        this.users = [];
        this.intervalManager = new IntervalManager();

        this.startLocationBroadcast();
        this.startLatencyCompensation();
        this.startUserStateSync();
    }

    addUser(user) {
        this.users.push(user);

        // 플레이어별 인터벌 추가
        const interval = 1000 / 60; // 60FPS
        const callback = () => {
            const newCoords = user.calculatePosition(this.getMaxLatency());
            user.updatePosition(newCoords.x, newCoords.y);
        };
        this.intervalManager.addPlayerInterval(user.id, callback, interval);
    }

    getUser(userId) {
        return this.users.find((user) => user.id === userId);
    }

    removeUser(socket) {
        const index = this.users.findIndex((user) => user.socket === socket);
        if (index !== -1) {
            const user = this.users.splice(index, 1)[0];

            // 플레이어별 인터벌 제거
            this.intervalManager.removePlayerIntervals(user.id);

            return user;
        }
    }

    getGameId() {
        return this.id;
    }

    getMaxLatency() {
        let maxLatency = 0;
        this.users.forEach((user) => {
            maxLatency = Math.max(maxLatency, user.getLatency());
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
        this.intervalManager.addGlobalInterval('broadcastLocation', callback, interval);
    }

    // 주기적으로 레이턴시 보정
    startLatencyCompensation() {
        const interval = 100; // 100ms마다
        const callback = () => {
            const maxLatency = this.getMaxLatency();
            this.users.forEach((user) => {
                const adjustedPosition = user.calculatePosition(maxLatency);
                user.updatePosition(adjustedPosition.x, adjustedPosition.y);
            });
        };
        this.intervalManager.addGlobalInterval('latencyCompensation', callback, interval);
    }

    // 지정 인터벌마다 DB에 위치 정보 동기화
    startUserStateSync() {
        const interval = 5000; // 5초마다
        const callback = () => {
            this.users.forEach(async (user) => {
                await updateUserLocation(user.x, user.y, user.id);
            });
        };
        this.intervalManager.addGlobalInterval('stateSync', callback, interval);
    }
}

export default Game;
