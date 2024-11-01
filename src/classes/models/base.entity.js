// src/classes/models/base.entity.js

class BaseEntity {
    constructor(id, type, pos = { x: 0, y: 0 }) {
        if (new.target === BaseEntity) {
            throw new TypeError('Cannot instantiate BaseEntity directly');
        }
        this.id = id;
        this.type = type; // 엔티티 타입 추가
        this.x = pos.x;
        this.y = pos.y;
        this.lastX = pos.x;
        this.lastY = pos.y;
        this.speed = 6;
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

        // this.speed로 얼마나 가야하는지
        const timeDiff = (Date.now() - this.lastUpdateTime + latency) / 1000; // 초 단위로 변환
        const distance = this.speed * timeDiff;

        // 각 축별 이동거리
        const totalDistanceX = this.x - this.lastX;
        const totalDistanceY = this.y - this.lastY;

        // arctan을 이용한 이동 방향 구하기
        const angle = Math.atan2(totalDistanceY, totalDistanceX);

        // 해당 각도로 얼마나 움직여야 하는지 계산
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
