// src/classes/models/monster.class.js

import BaseEntity from './base.entity.js';

class Monster extends BaseEntity {
    constructor(id, type, coords = { x: 0, y: 0 }) {
        super(id, 'monster', coords);
        this.type = type; // 몬스터 종류
        // 추가적인 몬스터 고유 속성들
    }
    
    // 이런 식으로 모듈화 가능
    // 어차피 몬스터 좌표도 서버에서 업데이트 해야 하기 때문에
    // 베이스에서 끌어오기 가능
}

export default Monster;
