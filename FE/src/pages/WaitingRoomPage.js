import { changeUrl } from '../index.js';
import {
	getUserSeatBox,
	getUserProfileBox
} from '../components/WaitingRoomUserBox.js';
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
				total_score: 5,
				color: {
					paddle: '#5AD7FF',
					ball: '#FFD164'
				},
				maxPlayer: 4,
				roomName: 'My Room'
			},
			userInfo: [
				{
					image: '',
					nickName: 'jeongrol',
					rating: 1200,
					host: true,
					roomPosition: 0,
					readyState: false
				},
				{
					image: '',
					nickName: 'jooyoo',
					rating: 1500,
					host: false,
					roomPosition: 1,
					readyState: false
				},
				{
					image: '',
					nickName: 'wonyang',
					rating: 2000,
					host: false,
					roomPosition: 2,
					readyState: true
				}
			],
			myInfo: {
				host: true,
				roomPosition: 0,
				readyState: false
			}
		};

		const userSeatElement = getUserSeatBox(data.roomInfo.maxPlayer);
		getUserProfileBox(userSeatElement, data.userInfo);

		const readyButton = data.myInfo.host
			? new ButtonExtraLarge('시작', 'yellow')
			: new ButtonExtraLarge('대기', 'blue');
		const backButton = new ButtonBackArrow();

		return html`
			<div class="large-window flex-direction-column head_white_neon_15">
				<div class="waiting-room-main">
					${userSeatElement.outerHTML}
					<div class="room-info-container"></div>
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
