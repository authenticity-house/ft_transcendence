import { changeUrl } from '../index.js';
import {
	getUserSeatBox,
	getUserProfileBox
} from '../components/WaitingRoomUserBox.js';
import { getRoomContainer } from '../components/WaitingRoomInfo.js';

import ButtonExtraLarge from '../components/ButtonExtraLarge.js';
import ButtonBackArrow from '../components/ButtonBackArrow.js';

const html = String.raw;

class WaitingRoomPage {
	template() {
		// MOCK data
		const data = {
			roomInfo: {
				battle_mode: 2,
				level: 2,
				total_score: 2,
				color: {
					paddle: '#5AD7FF',
					ball: '#FFD164'
				},
				maxPlayer: 4,
				roomName: '토너먼트 고수만 오세요! 퐁퐁퐁퐁퐁퐁퐁퐁퐁퐁',
				rating: 1500
			},
			userInfo: [
				{
					image: '',
					nickName: 'jeongrol',
					rating: 1200,
					roomPosition: 0,
					host: true,
					readyState: false
				},
				{
					image: '',
					nickName: 'jooyoo',
					rating: 1500,
					roomPosition: 1,
					host: false,
					readyState: false
				},
				{
					image: '',
					nickName: 'wonyang',
					rating: 2000,
					roomPosition: 2,
					host: false,
					readyState: true
				}
			],
			myInfo: {
				roomPosition: 0,
				host: false,
				readyState: false
			}
		};

		const userSeatElement = getUserSeatBox(data.roomInfo.maxPlayer);
		getUserProfileBox(userSeatElement, data.userInfo);

		const roomInfoElement = getRoomContainer(data.roomInfo, data.myInfo.host);

		let readyButton;
		if (data.myInfo.host) {
			readyButton = new ButtonExtraLarge('시작', 'yellow');
		} else if (data.myInfo.readyState) {
			readyButton = new ButtonExtraLarge('대기', 'blue');
		} else {
			readyButton = new ButtonExtraLarge('준비', 'pink');
		}
		const backButton = new ButtonBackArrow();

		return html`
			<div class="large-window flex-direction-column head_white_neon_15">
				<div class="waiting-room-main">
					${userSeatElement.outerHTML} ${roomInfoElement.outerHTML}
				</div>
				<div class="waiting-room-footer">${readyButton.template()}</div>
				<div class="online-main-back-button">${backButton.template()}</div>
			</div>
		`;
	}

	addEventListeners() {
		const statusButton = document.querySelector('.button-extra-large');
		statusButton.addEventListener('click', () => {
			console.log('click!');
		});

		const backButton = document.querySelector('.online-main-back-button');
		backButton.addEventListener('click', () => {
			changeUrl('');
		});
	}
}

export default new WaitingRoomPage();
