import { changeUrl, changeUrlData } from '../../index.js';
import HorizontalButton from '../../components/HorizontalButton.js';
import VerticalButton from '../../components/VerticalButton.js';
import ButtonBackArrow from '../../components/ButtonBackArrow.js';
import { pongImage } from '../../components/pongImage.js';
import { createRoomAPI } from './createRoomAPI.js';

const html = String.raw;

class OnlineGameSettingTournament {
	constructor() {
		this.initialData = {
			battle_mode: 2,
			total_score: 2,
			level: 2,
			color: {
				paddle: '#5AD7FF',
				ball: '#FFD164'
			},
			max_headcount: 4,
			room_name: 'room'
		};
	}

	resetData() {
		this.data = JSON.parse(JSON.stringify(this.initialData));
	}

	template(data) {
		if (data == null) this.resetData();
		else this.data = data;
		this.data.battle_mode = 2;

		const horizonbuttonConfigs = [
			{ text: '1 vs 1' },
			{ text: '토너먼트', classes: 'selected' }
		];
		const horizontalButton = new HorizontalButton(
			horizonbuttonConfigs,
			'60rem'
		);

		const virticalbuttonConfigs = [
			{ text: '세부설정', classes: 'head_blue_neon_15 blue_neon_10' },
			{ text: '확인', classes: 'head_blue_neon_15 blue_neon_10' }
		];
		const verticalButton = new VerticalButton(virticalbuttonConfigs);
		const initialIndex = this.data.max_headcount;
		const backButton = new ButtonBackArrow();

		return html`
			<div class="game-setting-window head_white_neon_15">
				<div class="game-setting-container">
					<div class="game-setting-content-container">
						<div class="horizontalButton">${horizontalButton.template()}</div>
						<!-- 인원수 선택 및 닉네임 설정 -->
						<div class="game-setting-tournament-container">
							<div class="text-inputbox-room-container">
								<p class="text-subtitle-1-left" style="padding-left: 1rem;">
									방 제목
								</p>

								<input
									class="game-setting-room-container input-size-60"
									type="text"
									value="${this.data.room_name.replace(/"/g, '&quot;')}"
									maxlength="12"
								/>
							</div>
							<div class="game-setting-number-container">
								<!-- 게임 인원수 선택 -->
								<p class="text-subtitle-1-left">참여인원</p>
								<div class="num-block head-count">
									<div class="num-in">
										<span class="minus"></span>
										<input
											type="text"
											class="in-num"
											value=${initialIndex}
											readonly=""
										/>
										<span class="plus"></span>
									</div>
								</div>
							</div>

							<!-- 닉네임 입력 테두리 -->
							<div class="game-setting-nickname-container">
								${pongImage('onlineTournament')}
							</div>
						</div>
					</div>
					<div class="verticalButton">${verticalButton.template()}</div>
				</div>
				<div class="button-back-in-window">${backButton.template()}</div>
			</div>
		`;
	}

	addEventListeners() {
		// 1, 8이 되었을 때 -, + 버튼 비활성화
		function updateButtonsState(count) {
			const minusButton = document.querySelector('.minus');
			const plusButton = document.querySelectorAll('.plus');

			if (count <= 3) minusButton.classList.add('dis');
			else minusButton.classList.remove('dis');

			plusButton.forEach((button) => {
				if (count >= 8) button.classList.add('dis');
				else button.classList.remove('dis');
			});
		}

		// -, + 버튼 클릭되었을 때, minus, plus에 맞추어 로직 수행
		function handleClick() {
			const input = document.querySelector('input.in-num');
			let count = parseInt(input.value, 10);

			if (this.classList.contains('minus')) {
				if (count > 3) {
					count -= 1;
				}
			} else if (this.classList.contains('plus')) {
				if (count < 8) {
					count += 1;
				}
			}
			input.value = count;
			updateButtonsState(count);
		}

		document.querySelectorAll('.num-in span').forEach((span) => {
			span.addEventListener('click', handleClick);
		});

		// 게임 세부 설정 버튼
		const matchMode = document.querySelector(
			'.horizontalButton button:nth-child(1)'
		);
		matchMode.addEventListener('click', () => {
			changeUrlData('onlineSetting', null);
		});

		function updateRoomName(res) {
			res.max_headcount = parseInt(
				document.querySelector('input.in-num').value,
				10
			);
			res.room_name = document.querySelector(
				'.game-setting-room-container'
			).value;
		}

		// 세부 설정 버튼
		const detailedButton = document.querySelector(
			'.verticalButton button:nth-child(1)'
		);
		detailedButton.addEventListener('click', () => {
			// const newData = this.data;
			// this.resetData();
			updateRoomName(this.data);
			changeUrlData('onlineDetailed', this.data);
		});

		// 시작 버튼
		const startButton = document.querySelector(
			'.verticalButton button:nth-child(2)'
		);
		startButton.addEventListener('click', () => {
			const newData = this.data;
			this.resetData();
			updateRoomName(newData);
			newData.total_score *= 5;
			createRoomAPI(newData);
		});

		const backButton = document.querySelector('.button-back-in-window');
		backButton.addEventListener('click', () => {
			this.resetData();
			changeUrl('onlineMainScreen');
		});
	}
}

export default new OnlineGameSettingTournament();
