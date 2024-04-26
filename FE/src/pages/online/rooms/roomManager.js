import createRoomAPI from './createRoomAPI.js';
import joinRoomAPI from './joinRoomAPI.js';
import { getWebsocketUrl } from '../../../utils/getWebsocketUrl.js';
import { changeUrlData } from '../../../index.js';
import { showModal } from '../../../components/modal/modalUtils.js';

export async function createAndJoinRoom(data) {
	const roomNumber = await createRoomAPI(data);

	console.log('방번호', roomNumber);

	if (!roomNumber)
		// 방 만들기 실패
		// ?? 방을 만들지 못할 경우?
		return false;
	// 방 참가
	await joinRoomAPI(roomNumber);
	changeUrlData('waitingRoom', roomNumber);

	return true;
}

export async function joinRoom(roomNumber) {
	// 방 참가
	const check = await joinRoomAPI(roomNumber);
	if (!check) {
		return false;
	}
	changeUrlData('waitingRoom', roomNumber);

	return true;
}

export class RoomWebsocket {
	send(message) {
		this.ws.send(JSON.stringify(message));
	}

	close() {
		this.ws.close();
	}

	joinRoomWebsocket(roomNumber) {
		try {
			const url = getWebsocketUrl(`room/${roomNumber}`);
			this.ws = new WebSocket(url);

			this.ws.onopen = () => {
				console.log('connected');
			};
		} catch (error) {
			console.error('웹소켓 연결 실패', error);
			return false;
		}
		return true;
	}

	isOpen() {
		return this.ws.readyState === this.ws.OPEN;
	}

	exitRoom() {
		const message = {
			type: 'room.exit'
		};
		this.send(message);
		this.close();

		console.log('방 나가기');
	}

	getRoomInfo() {
		return this.info.room_info;
	}

	async receiveMessages(render) {
		return new Promise((resolve) => {
			this.ws.onmessage = (e) => {
				const message = JSON.parse(e.data);

				switch (message.type) {
					case 'room.info':
						render(message);
						resolve(message);
						this.info = message;
						break;

					case 'room.end':
						showModal('roomEndModal');
						break;
					default:
						console.log('default');
						break;
				}
			};
		});
	}

	sendChangeInfo(change) {
		const message = {
			type: 'room.change.info',
			data: change
		};
		this.send(message);
	}

	sendReadyState() {
		const message = {
			type: 'room.change.state'
		};
		this.send(message);
	}
}
