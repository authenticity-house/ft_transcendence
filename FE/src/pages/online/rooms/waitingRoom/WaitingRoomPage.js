import { changeUrl } from '../../../../index.js';
import { getUserSeatBox, getUserProfileBox } from './WaitingRoomUserBox.js';
import { getRoomContainer } from './WaitingRoomInfo.js';

import ButtonExtraLarge from '../../../../components/ButtonExtraLarge.js';
import ButtonBackArrow from '../../../../components/ButtonBackArrow.js';

import { RoomWebsocket } from '../roomManager.js';

const html = String.raw;

class WaitingRoomPage {
	template() {
		this.readyState = false;
		const backButton = new ButtonBackArrow();
		return html`
			<div class="large-window flex-direction-column head_white_neon_15">
				<div class="waiting-room-main">
					<div id="userSeatElement"></div>
					<div id="roomInfoElement"></div>
				</div>
				<div class="waiting-room-footer" id="readyButtonContainer"></div>
				<div class="button-back-in-window">${backButton.template()}</div>
			</div>
		`;
	}

	async mount(roomNumber) {
		this.joinWebsocket(roomNumber);
		try {
			const msg = await this.roomWsManager.receiveMessages(this.render);

			this.buttonMount(msg);
			this.addAsyncEventListeners();
		} catch (error) {
			console.error('Error mounting the room:', error);
		}
	}

	joinWebsocket(roomNumber) {
		this.roomWsManager = new RoomWebsocket();
		this.roomWsManager.joinRoomWebsocket(roomNumber);
	}

	buttonMount(data) {
		const buttonText = data.my_info.host ? '시작' : '준비';
		const buttonColor = data.my_info.host ? 'yellow' : 'blue';
		this.readyButton = new ButtonExtraLarge(buttonText, buttonColor);
		const readyButtonContainer = document.getElementById(
			'readyButtonContainer'
		);
		if (readyButtonContainer)
			readyButtonContainer.innerHTML = this.readyButton.template();
		this.isHost = data.my_info.host;
	}

	render(data) {
		const userSeatElement = getUserSeatBox(data.room_info.max_headcount);
		getUserProfileBox(userSeatElement, data.user_info);

		const userSeatContainer = document.getElementById('userSeatElement');

		userSeatContainer.innerHTML = '';
		userSeatContainer.appendChild(userSeatElement);

		// room info
		const roomInfoElement = getRoomContainer(data.room_info, data.my_info.host);
		const roomInfoContainer = document.getElementById('roomInfoElement');

		roomInfoContainer.innerHTML = '';
		roomInfoContainer.appendChild(roomInfoElement);
	}

	addEventListeners() {}

	addAsyncEventListeners() {
		const statusButton = document.querySelector('.button-extra-large');
		statusButton.addEventListener('click', () => {
			if (!this.isHost) {
				const newText = !this.readyState ? '대기' : '준비';
				const newColor = !this.readyState ? 'pink' : 'blue';
				this.readyState = !this.readyState;
				this.readyButton.updateTextAndColor(newText, newColor);
			}
			// 웹소켓으로 state 정보 보내기
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
