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

        const totalDistanceX = this.x - this.lastX;
        const totalDistanceY = this.y - this.lastY;

        const angle = Math.atan2(totalDistanceY, totalDistanceX);

        const movedX = this.lastX + Math.cos(angle) * distance;
        const movedY = this.lastY + Math.sin(angle) * distance;

        // 목표 위치를 초과하지 않도록 제한
        const newX = (totalDistanceX > 0)
            ? Math.min(movedX, this.x)
            : Math.max(movedX, this.x);

        const newY = (totalDistanceY > 0)
            ? Math.min(movedY, this.y)
            : Math.max(movedY, this.y);

        return {
            x: newX,
            y: newY,
        };
    }
}

export default BaseEntity;
