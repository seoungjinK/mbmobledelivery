import io from 'socket.io-client';

// ⚠️ 주의: 본인의 PC IP 주소로 설정해야 합니다.
// Flask 서버 포트가 5000번인지 확인하세요.
// Socket.IO는 ws:// 대신 http:// 로 시작하는 주소를 사용합니다.
const SERVER_URL = 'http://192.168.1.108:5000'; 

const socket = io(SERVER_URL, {
  transports: ['websocket'], // React Native에서는 websocket 모드를 강제하는 것이 안정적입니다.
  autoConnect: true,         // 앱 실행 시 자동 연결
  reconnection: true,        // 연결 끊기면 자동 재연결 시도
});

// 디버깅을 위해 콘솔에 로그 출력
socket.on('connect', () => {
  console.log('✅ Socket.js: 서버에 연결되었습니다! (ID:', socket.id, ')');
});

socket.on('disconnect', () => {
  console.log('❌ Socket.js: 서버와 연결이 끊어졌습니다.');
});

socket.on('connect_error', (err) => {
  console.log('⚠️ Socket.js: 연결 에러 발생:', err.message);
});

export default socket;