import { changeUrl, changeUrlData, gamewsmanager } from '../../index.js';
import HorizontalButton from '../../components/HorizontalButton.js';
import VerticalButton from '../../components/VerticalButton.js';
import { Gamewebsocket } from '../../websocket/Gamewebsocket.js';
import ButtonBackArrow from '../../components/ButtonBackArrow.js';
import { pongImage } from '../../components/pongImage.js';

const html = String.raw;

class GameSettingPage {
	constructor() {
		this.initialData = {
			battle_mode: 1,
			total_score: 2,
			level: 2,
			color: {
				paddle: '#5AD7FF',
				ball: '#FFD164'
			},
			headcount: 2,
			nickname: ['player1', 'player2']
		};
	}

	resetData() {
		this.data = JSON.parse(JSON.stringify(this.initialData));
	}

	template(data) {
		if (data == null) this.resetData();
		else this.data = data;
		this.data.battle_mode = 1;

		const horizonbuttonConfigs = [
			{ text: '1 vs 1', classes: 'selected' },
			{ text: '토너먼트' }
		];
		const horizontalButton = new HorizontalButton(
			horizonbuttonConfigs,
			'60rem'
		);

		const virticalbuttonConfigs = [
			{ text: '세부설정', classes: 'head_blue_neon_15 blue_neon_10' },
			{ text: '시작', classes: 'head_blue_neon_15 blue_neon_10' }
		];
		const verticalButton = new VerticalButton(virticalbuttonConfigs);
		const backButton = new ButtonBackArrow();

		return html`
			<div class="game-setting-window head_white_neon_15">
				<div class="game-setting-container">
					<div class="game-setting-content-container" style="gap:4rem">
						<div class="horizontalButton">${horizontalButton.template()}</div>
						<div class="text-inputbox-room-container">
							<div class="display-medium20">방 제목</div>
							<input
								class="game-setting-room-container"
								type="text"
								class="input-size-60"
							/>
						</div>
						<div class="game-setting-nickname-container height-27">
							${pongImage('online')}
						</div>
					</div>
					<div class="verticalButton">${verticalButton.template()}</div>
				</div>
				<div class="button-back-in-window">${backButton.template()}</div>
			</div>
		`;
	}

	addEventListeners() {
		// 게임 세부 설정 버튼
		const matchMode = document.querySelector(
			'.horizontalButton button:nth-child(2)'
		);
		matchMode.addEventListener('click', () => {
			changeUrlData('onlineSettingTournament', null);
		});

		const detailedButton = document.querySelector(
			'.verticalButton button:nth-child(1)'
		);
		detailedButton.addEventListener('click', () => {
			changeUrlData('onlineDetailed', this.data);
		});

		const startButton = document.querySelector(
			'.verticalButton button:nth-child(2)'
		);
		startButton.addEventListener('click', () => {
			const newData = this.data;
			this.resetData();
			newData.total_score *= 5;
			// 웹소켓 만들기
			const gamewebsocket = new Gamewebsocket(newData);
			gamewsmanager.register(gamewebsocket);
			// changeUrlData('game', newData);
		});
		const backButton = document.querySelector('.button-back-in-window');
		backButton.addEventListener('click', () => {
			this.resetData();
			changeUrl('onlineMainScreen');
		});
	}
}

export default new GameSettingPage();
