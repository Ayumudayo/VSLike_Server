import initialHandler from './user/initial.handler.js';
import { HANDLER_IDS } from '../constants/handlerIds.js';
import CustomError from '../utils/error/customError.js';
import { ErrorCodes } from '../utils/error/errorCodes.js';
import updateLocationHandler from './game/updateLocation.handler.js';
import pingHandler from './common/ping.handler.js';

const handlers = {
    [HANDLER_IDS.INITIAL]: {
        handler: initialHandler,
        protoType: 'initial.InitialPacket',
    },
    [HANDLER_IDS.PING]: {
        handler: pingHandler,
        protoType: 'common.Ping',
    },
    [HANDLER_IDS.UPDATE_LOCATION]: {
        handler: updateLocationHandler,
        protoType: 'game.LocationUpdatePayload',
    },
};

export const getHandlerById = (handlerId) => {
    if (!handlers[handlerId]) {
        throw new CustomError(
            ErrorCodes.UNKNOWN_HANDLER_ID,
            `핸들러를 찾을 수 없습니다: ID ${handlerId}`,
        );
    }
    return handlers[handlerId].handler;
};

export const getProtoTypeNameByHandlerId = (handlerId) => {
    if (!handlers[handlerId]) {
        throw new CustomError(
            ErrorCodes.UNKNOWN_HANDLER_ID,
            `프로토타입를 찾을 수 없습니다: ID ${handlerId}`,
        );
    }
    return handlers[handlerId].protoType;
};
