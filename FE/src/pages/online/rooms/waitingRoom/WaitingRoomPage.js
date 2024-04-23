import { changeUrl } from '../../../../index.js';
import { getUserSeatBox, getUserProfileBox } from './WaitingRoomUserBox.js';
import { getRoomContainer } from './WaitingRoomInfo.js';

import ButtonExtraLarge from '../../../../components/ButtonExtraLarge.js';
import ButtonBackArrow from '../../../../components/ButtonBackArrow.js';

import { RoomWebsocket } from '../roomManager.js';

const html = String.raw;

class WaitingRoomPage {
	template() {
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
		const msg = await this.roomWsManager.receiveMessages(this.render);
		console.log(msg);

		this.buttonMount(msg);
		this.addAsyncEventListeners();
	}

	joinWebsocket(roomNumber) {
		this.roomWsManager = new RoomWebsocket();
		this.roomWsManager.joinRoomWebsocket(roomNumber);
	}

	buttonMount(data) {
		let readyButton;
		if (data.my_info.host) {
			readyButton = new ButtonExtraLarge('시작', 'yellow');
		} else if (data.my_info.ready_state) {
			readyButton = new ButtonExtraLarge('대기', 'pink');
		} else {
			readyButton = new ButtonExtraLarge('준비', 'blue');
		}
		const readyButtonContainer = document.getElementById(
			'readyButtonContainer'
		);
		if (readyButtonContainer)
			readyButtonContainer.innerHTML = readyButton.template();
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
