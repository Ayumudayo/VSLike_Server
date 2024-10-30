import net from 'net';
import initServer from "./init/index.js";
import { config } from "./config/config.js";
import { onConnection } from "./events/onConnection.js";

const server = net.createServer(onConnection);

const startServer = async () => {
    try {
        // 서버 초기화
        await initServer();

        // 서버 리스닝 시작
        server.listen(config.server.port, config.server.host, () => {
            console.log(`서버가 ${config.server.host}:${config.server.port}에서 실행 중입니다.`);
            console.log(server.address());
        });
    } catch (error) {
        // 초기화 실패 시 에러 처리
        console.error(error);
        process.exit(1);
    }
};

// 서버 시작
startServer();