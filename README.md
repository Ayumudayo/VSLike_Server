# VSLike-Server

## 개요

이 프로젝트는 Node.js TCP 소켓을 통해 게임서버를 구현한 프로젝트입니다.

## 기술 스택

- **Node.js**: 서버 사이드 자바스크립트 실행 환경
- **AWS EC2**: 배포 플랫폼
- **AWS RDS**: 데이터 저장 (MySQL)

## 프로젝트 설치 및 실행

### 요구 사항

- Node.js
- npm

### 설치

1. **레포지토리 클론**

    ```bash
    git clone https://github.com/Ayumudayo/VSLike_Server.git
    cd VSLike_Server
    ```

2. **의존성 설치**

    ```bash
    npm install
    ```

3. **환경 변수 설정**

   `.env` 파일을 생성하고, 아래와 같은 환경 변수를 설정합니다.

    ```plaintext
    PORT="YOUR PORT"
    HOST="YOUR HOST"
    CLIENT_VERSION="YOUR GAME VERSION"
    
    DB1_NAME="YOUR DB NAME"
    DB1_USER="YOUR DB USER NAME"
    DB1_PASSWORD="YOUR DB PASSWORD"
    DB1_HOST="YOUR DB HOST"
    DB1_PORT="YOUR DB PORT"
    ```

4. **서버 실행**

    ```bash
    npm run start
    ```

## 클라이언트

클라이언트는 [여기](https://github.com/Ayumudayo/VSLike_Client)서 받을 수 있다.


