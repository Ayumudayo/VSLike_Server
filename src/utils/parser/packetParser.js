// src/utils/parser/packetParser.js

import { getProtoMessages } from '../../init/loadProtos.js';
import { getProtoTypeNameByHandlerId } from '../../handlers/index.js';
import { config } from '../../config/config.js';
import CustomError from '../error/customError.js';
import { ErrorCodes } from '../error/errorCodes.js';

export const packetParser = (data) => {
    const protoMessages = getProtoMessages();
    // 공통 패킷 구조를 디코딩
    const Packet = protoMessages.common.Packet;
    let decodedPacket;
    try {
        decodedPacket = Packet.decode(data);
    } catch (e) {
        throw new CustomError(ErrorCodes.PACKET_DECODE_ERROR, '패킷 디코딩 중 오류가 발생했습니다.');
    }
    
    const handlerId = decodedPacket.handlerId;
    const userId = decodedPacket.userId;
    const clientVersion = decodedPacket.version;
    const sequence = decodedPacket.sequence;

    if (clientVersion !== config.client.version) {
        throw new CustomError(
            ErrorCodes.CLIENT_VERSION_MISMATCH,
            '클라이언트 버전이 일치하지 않습니다.',
        );
    }

    const protoTypeName = getProtoTypeNameByHandlerId(handlerId);
    if (!protoTypeName) {
        throw new CustomError(ErrorCodes.UNKNOWN_HANDLER_ID, `알 수 없는 핸들러 ID: ${handlerId}`);
    }

    const [namespace, typeName] = protoTypeName.split('.');
    const PayloadType = protoMessages[namespace][typeName];
    let decodedPayload;

    try {
        decodedPayload = PayloadType.decode(decodedPacket.payload);
    } catch (e) {
        throw new CustomError(ErrorCodes.PACKET_DECODE_ERROR, '패킷 디코딩 중 오류가 발생했습니다.');
    }

    const errorMessage = PayloadType.verify(decodedPayload);
    if (errorMessage) {
        throw new CustomError(
            ErrorCodes.INVALID_PACKET,
            `패킷 구조가 일치하지 않습니다: ${errorMessage}`,
        );
    }

    // 필드가 비어있는 경우 = 필수 필드가 누락된 경우
    const expectedFields = Object.keys(PayloadType.fields);
    const actualFields = Object.keys(decodedPayload);
    const missingFields = expectedFields.filter((field) => !actualFields.includes(field));

    if (missingFields.length > 0) {
        throw new CustomError(
            ErrorCodes.MISSING_FIELDS,
            `필수 필드가 누락되었습니다: ${missingFields.join(', ')}`,
        );
    }

    return { handlerId, userId, payload: decodedPayload, sequence };
};
