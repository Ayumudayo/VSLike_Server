// src/classes/models/base.entity.js

class BaseEntity {
    constructor(id, type, coords = { x: 0, y: 0 }) {
        if (new.target === BaseEntity) {
            throw new TypeError('Cannot instantiate BaseEntity directly');
        }
        this.id = id;
        this.type = type; // 엔티티 타입 추가
        this.x = coords.x;
        this.y = coords.y;
        this.lastX = coords.x;
        this.lastY = coords.y;
        this.speed = 6; // 기본 속도, 필요에 따라 조정 가능
        this.currentGameId = null;
        this.lastUpdateTime = Date.now();
    }
    
    setGameId(id) {
        this.currentGameId = id;
    }
    
    getGameId() {
        return this.currentGameId;
    }

    updatePosition(x, y) {
        this.lastX = this.x;
        this.lastY = this.y;
        this.x = x;
        this.y = y;
        this.lastUpdateTime = Date.now();
    }

    calculatePosition(latency) {
        if (this.x === this.lastX && this.y === this.lastY) {
            return { x: this.x, y: this.y };
        }

        const timeDiff = (Date.now() - this.lastUpdateTime + latency) / 1000; // 초 단위로 변환
        const distance = this.speed * timeDiff;

        const directionX = this.x !== this.lastX ? Math.sign(this.x - this.lastX) : 0;
        const directionY = this.y !== this.lastY ? Math.sign(this.y - this.lastY) : 0;

        return {
            x: this.x + directionX * distance,
            y: this.y + directionY * distance,
        };
    }
}

export default BaseEntity;
