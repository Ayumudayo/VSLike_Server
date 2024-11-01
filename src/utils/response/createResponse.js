// src/utils/response/createResponse.js

import { getProtoMessages } from '../../init/loadProtos.js';
import { config } from '../../config/config.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { getUserById } from '../../session/user.session.js';

export const createResponse = (handlerId, responseCode, data = null) => {
    const protoMessages = getProtoMessages();
    const Response = protoMessages.response.Response;

    const sequence = data && data.userId ? getUserSequence(data.userId) : 0;

    const responsePayload = {
        handlerId,
        responseCode,
        timestamp: Date.now(),
        data: data ? Buffer.from(JSON.stringify(data)) : null,
        sequence,
    };

    const buffer = Response.encode(responsePayload).finish();

    const packetLength = Buffer.alloc(config.packet.totalLength);
    packetLength.writeUInt32BE(
        buffer.length + config.packet.totalLength + config.packet.typeLength,
        0,
    );

    const packetType = Buffer.alloc(config.packet.typeLength);
    packetType.writeUInt8(PACKET_TYPE.NORMAL, 0);

    return Buffer.concat([packetLength, packetType, buffer]);
};

const getUserSequence = (id) => {
    const user = getUserById(id);
    return user ? user.sequence : null;
};
