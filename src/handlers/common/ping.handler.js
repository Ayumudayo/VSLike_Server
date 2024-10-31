// src/handlers/common/ping.handler.js

import { getUserById } from '../../session/user.session.js';
import { HANDLER_IDS, RESPONSE_SUCCESS_CODE } from '../../constants/handlerIds.js';
import { createResponse } from '../../utils/response/createResponse.js';
import { handlerError } from '../../utils/error/errorHandler.js';

const pingHandler = async ({ socket, userId, payload }) => {
    try {
        const { timestamp } = payload;
        // 현재 시간
        const currentTime = Date.now();

        // 레이턴시 계산
        const rtt = currentTime - timestamp;
        const latency = Math.round(rtt / 2);

        // 유저 정보 업데이트
        const user = getUserById(userId);
        if (user) {
            user.setLatency(latency);
            console.log(`Updated latency for user ${user.id}: ${latency} ms`);
        }

        const pongResponse = createResponse(HANDLER_IDS.PING, RESPONSE_SUCCESS_CODE, {});

        socket.write(pongResponse);
    } catch (e) {
        handlerError(socket, e);
    }
};

export default pingHandler;
