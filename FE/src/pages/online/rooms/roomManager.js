import createRoomAPI from './createRoomAPI.js';
import joinRoomAPI from './joinRoomAPI.js';
import { getWebsocketUrl } from '../../../utils/getWebsocketUrl.js';
import { changeUrlData } from '../../../index.js';

export async function createAndJoinRoom(data) {
	const roomNumber = await createRoomAPI(data);

	console.log('방번호', roomNumber);

	if (!roomNumber)
		// 방 만들기 실패
		// ?? 방을 만들지 못할 경우?
		return false;
	// 방 참가
	await joinRoomAPI(roomNumber);
	console.log('방참가완료');
	changeUrlData('waitingRoom', roomNumber);

	return true;
}

export class RoomWebsocket {
	joinRoomWebsocket(roomNumber) {
		try {
			const url = getWebsocketUrl(`room/${roomNumber}`);
			this.ws = new WebSocket(url);

			this.ws.onopen = () => {
				console.log('connected');

				this.ws.onmessage = (e) => {
					const message = JSON.parse(e.data);
					console.log(message);
				};
			};
		} catch (error) {
			console.error('웹소켓 연결 실패', error);
			return false;
		}
		return true;
	}

	exitRoom() {
		const message = {
			type: 'room.exit'
		};
		this.ws.send(JSON.stringify(message));
		this.ws.close();
		console.log('방 나가기');
	}
}
