import { changeUrl, gamewsmanager } from '../../../../index.js';
import { getUserSeatBox, getUserProfileBox } from './WaitingRoomUserBox.js';
import { getRoomContainer } from './WaitingRoomInfo.js';

import ButtonExtraLarge from '../../../../components/ButtonExtraLarge.js';
import ButtonBackArrow from '../../../../components/ButtonBackArrow.js';

import { RoomWebsocket } from '../roomManager.js';
import { roomModal } from '../roomModal.js';
import ModifyGameSetting from './ModifyGameSetting.js';

const html = String.raw;

function checkReadyStates(data) {
	const maxHeadcount = data.room_info.max_headcount;

	let readyCount = 0;

	data.user_info.forEach((user) => {
		if (user.ready_state === true) {
			readyCount += 1;
		}
	});
	return readyCount === maxHeadcount - 1;
}
class WaitingRoomPage {
	constructor() {
		this.modifyPage = ModifyGameSetting;
	}

	template() {
		this.readyState = false;
		this.isHost = false;

		const backButton = new ButtonBackArrow();
		this.readyButton = new ButtonExtraLarge('로딩 중', 'gray');

		this.page = html`
			<div class="large-window flex-direction-column head_white_neon_15">
				<div class="waiting-room-main">
					<div id="userSeatElement"></div>
					<div id="roomInfoElement"></div>
				</div>
				<div class="waiting-room-footer">${this.readyButton.template()}</div>
				<div class="button-back-in-window">${backButton.template()}</div>
			</div>
			${roomModal()}
		`;
		return this.page;
	}

	async mount(roomNumber) {
		this.joinWebsocket(roomNumber);

		try {
			this.msg = await this.roomWsManager.receiveMessages(this.render);

			this.updateReadyButton(this.msg);
			this.addModifyEventListener();
		} catch (error) {
			console.error('Error mounting the room:', error);
		}
	}
	// --------------------------------------------------------------------------------

	joinWebsocket(roomNumber) {
		this.roomWsManager = new RoomWebsocket();
		this.roomWsManager.joinRoomWebsocket(roomNumber);

		gamewsmanager.register(this.roomWsManager);
	}

	// --------------------------------------------------------------------------------

	render(data) {
		const userSeatElement = getUserSeatBox(data.room_info.max_headcount);
		getUserProfileBox(userSeatElement, data.user_info);

		document.getElementById('userSeatElement').innerHTML = '';
		document.getElementById('userSeatElement').appendChild(userSeatElement);

		const roomInfoElement = getRoomContainer(data.room_info, data.my_info.host);
		document.getElementById('roomInfoElement').innerHTML = '';
		document.getElementById('roomInfoElement').appendChild(roomInfoElement);

		// data.start_state === true
		if (data.my_info.host) {
			const readyButton = document.querySelector('.button-extra-large');
			if (checkReadyStates(data)) {
				readyButton.classList.remove('disabled');
			} else {
				readyButton.classList.add('disabled');
			}
		}
	}

	updateReadyButton(data) {
		this.isHost = data.my_info.host;
		const buttonText = this.isHost ? '시작' : '준비';
		const buttonColor = this.isHost ? 'yellow' : 'blue';

		this.readyButton.updateTextAndColor(buttonText, buttonColor);

		if (this.isHost) {
			const readyButton = document.querySelector('.button-extra-large');
			readyButton.classList.add('disabled');
		}
	}

	addModifyEventListener() {
		const roomInfoContainer = document.getElementById('roomInfoElement');
		roomInfoContainer.addEventListener('click', (event) => {
			const modifyButton = event.target.closest('.room-info-modify-button');

			if (modifyButton) {
				const root = document.querySelector('#root');
				root.innerHTML = this.modifyPage.template(
					this.roomWsManager.getRoomInfo()
				);
				this.modifyPage.addEventListeners();
				this.modifyPage.setOnConfirmCallback(this.backWaitingRoom.bind(this));
			}
		});
	}

	// --------------------------------------------------------------------------------

	async backWaitingRoom(data) {
		document.querySelector('#root').innerHTML = this.page;
		this.readyButton.updateTextAndColor('시작', 'yellow');

		this.roomWsManager.sendChangeInfo(data);

		this.addModifyEventListener();
		this.addEventListeners();
	}

	addEventListeners() {
		const statusButton = document.querySelector('.button-extra-large');
		statusButton.addEventListener('click', () => {
			if (!this.isHost) {
				const newText = !this.readyState ? '대기' : '준비';
				const newColor = !this.readyState ? 'pink' : 'blue';
				this.readyState = !this.readyState;
				this.readyButton.updateTextAndColor(newText, newColor);
				this.roomWsManager.sendReadyState();
			}
			// else {
			//	this.roomWsManager.close();
			//	// gamewsmanager.unregister();
			//	const gamewebsocket = new Gamewebsocket(this.msg.room_info);
			//	gamewsmanager.register(gamewebsocket);
			// }
		});

		const backButton = document.querySelector('.button-back-in-window');
		backButton.addEventListener('click', () => {
			this.roomWsManager.exitRoom();
			history.pushState(null, null, 'gameBlock');
			changeUrl('onlineMainScreen');
		});
	}
}

export default new WaitingRoomPage();
