// src/events/onData.js

import { config } from '../config/config.js';
import { PACKET_TYPE } from '../constants/header.js';
import { packetParser } from '../utils/parser/packetParser.js';
import { getHandlerById } from '../handlers/index.js';
import { getUserById } from '../session/user.session.js';
import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import { handlerError } from '../utils/error/errorHandler.js';

export const onData = (socket) => async (data) => {
    socket.buffer = Buffer.concat([socket.buffer, data]);

    const totalHeaderLength = config.packet.totalLength + config.packet.typeLength;

    while (socket.buffer.length >= totalHeaderLength) {
        const length = socket.buffer.readUInt32BE(0);
        const packetType = socket.buffer.readUInt8(config.packet.totalLength);

        if (socket.buffer.length >= length) {
            const packet = socket.buffer.subarray(totalHeaderLength, length);
            socket.buffer = socket.buffer.subarray(length);

            try {
                switch (packetType) {
                    case PACKET_TYPE.NORMAL:
                        const { handlerId, sequence, userId, payload } = packetParser(packet);

                        const user = getUserById(userId);

                        // 유저가 접속해 있는 상황에서 시퀀스 검증
                        if (user && user.sequence !== sequence) {
                            throw new CustomError(ErrorCodes.INVALID_SEQUENCE, '잘못된 시퀀스 값입니다. ');
                        }

                        const handler = getHandlerById(handlerId);

                        await handler({ socket, userId, payload });

                        if (user) {
                            user.getNextSequence();
                        }

                        break;
                }
            } catch (e) {
                handlerError(socket, e);
            }
        } else {
            // 아직 전체 패킷이 도착하지 않았음
            break;
        }
    }
};
