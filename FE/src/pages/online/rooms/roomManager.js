import createRoomAPI from './createRoomAPI.js';
import joinRoomAPI from './joinRoomAPI.js';
import { getWebsocketUrl } from '../../../utils/getWebsocketUrl.js';
import { changeUrlData } from '../../../index.js';

export function exitRoom(ws) {
	const message = {
		type: 'room.exit'
	};
	ws.send(JSON.stringify(message));
	ws.close();
	console.log('방 나가기');
}

async function joinRoomWebsocket(roomNumber) {
	try {
		const url = getWebsocketUrl(`room/${roomNumber}`);
		const ws = new WebSocket(url);

		ws.onopen = () => {
			console.log('connected');
		};
		ws.onmessage = (e) => {
			const message = JSON.parse(e.data);
			console.log('웹소켓 메시지', message);
			message.ws = ws;
			changeUrlData('waitingRoom', message);
		};
		// exitRoom(ws);
	} catch (error) {
		console.error('웹소켓 연결 실패', error);
	}
}

export function joinRoom(roomNumber) {
	// 방 참가 API

	joinRoomAPI(roomNumber);
	// - 방 참가 성공
	//   - 방 참가 웹소켓
	joinRoomWebsocket(roomNumber);
	// - 방 참가 실패
}

export async function createAndJoinRoom(data) {
	const roomNumber = await createRoomAPI(data);
	console.log('방번호', roomNumber);

	if (!roomNumber)
		// 방 만들기 실패
		// ?? 방을 만들지 못할 경우?
		return false;
	// 방 참가
	joinRoom(roomNumber);
	return true;
}
