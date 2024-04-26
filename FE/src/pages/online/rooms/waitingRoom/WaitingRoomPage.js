import { changeUrl, gamewsmanager } from '../../../../index.js';
import { getUserSeatBox, getUserProfileBox } from './WaitingRoomUserBox.js';
import { getRoomContainer } from './WaitingRoomInfo.js';

import ButtonExtraLarge from '../../../../components/ButtonExtraLarge.js';
import ButtonBackArrow from '../../../../components/ButtonBackArrow.js';

import { RoomWebsocket } from '../roomManager.js';
import { roomEndModal } from '../roomEndModal.js';
import ModifyGameSetting from '../ModifyGameSetting.js';

const html = String.raw;

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
			${roomEndModal()}
		`;
		return this.page;
	}

	async mount(roomNumber) {
		this.joinWebsocket(roomNumber);

		try {
			this.msg = await this.roomWsManager.receiveMessages(this.render);
			console.log(this.msg);

			this.updateReadyButton(this.msg);
			this.addModifyEventListener();
		} catch (error) {
			console.error('Error mounting the room:', error);
		}
	}

	joinWebsocket(roomNumber) {
		this.roomWsManager = new RoomWebsocket();
		this.roomWsManager.joinRoomWebsocket(roomNumber);
		gamewsmanager.register(this.roomWsManager);
	}

	updateReadyButton(data) {
		this.isHost = data.my_info.host;
		const buttonText = this.isHost ? '시작' : '준비';
		const buttonColor = this.isHost ? 'yellow' : 'blue';

		this.readyButton.updateTextAndColor(buttonText, buttonColor);
	}

	addModifyEventListener() {
		const roomInfoContainer = document.getElementById('roomInfoElement');
		roomInfoContainer.addEventListener('click', (event) => {
			console.log('클릭됨');
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

	render(data) {
		const userSeatElement = getUserSeatBox(data.room_info.max_headcount);
		getUserProfileBox(userSeatElement, data.user_info);

		document.getElementById('userSeatElement').innerHTML = '';
		document.getElementById('userSeatElement').appendChild(userSeatElement);

		const roomInfoElement = getRoomContainer(data.room_info, data.my_info.host);
		document.getElementById('roomInfoElement').innerHTML = '';
		document.getElementById('roomInfoElement').appendChild(roomInfoElement);
	}

	// ----------------------------------------------------------

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
			}
			// 웹소켓으로 state 정보 보내기
			this.roomWsManager.sendReadyState();
			console.log('click!');
		});

		const backButton = document.querySelector('.button-back-in-window');
		backButton.addEventListener('click', () => {
			this.roomWsManager.exitRoom();
			changeUrl('onlineMainScreen');
		});
	}
}

export default new WaitingRoomPage();
