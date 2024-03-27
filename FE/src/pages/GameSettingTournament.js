import { changeUrlData } from '../index.js';
import HorizontalButton from '../components/HorizontalButton.js';
import VerticalButton from '../components/VerticalButton.js';
import InputNickname from '../components/InputNickname.js';
import Gamewebsocket from '../websocket/Gamewebsocket.js';

const html = String.raw;

class GameSettingTournament {
	constructor() {
		this.initialData = {
			battle_mode: 2,
			total_score: 2,
			level: 2,
			color: {
				paddle: '#5AD7FF',
				ball: '#FFD164'
			},
			headcount: 4,
			nickname: ['', '', '', '']
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
			{ text: '1vs1' },
			{ text: '토너먼트', classes: 'selected' }
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
		const initialIndex = this.data.headcount;
		const inputNickname1 = new InputNickname();
		return html`
			<div class="game-setting-window head_white_neon_15">
				<div class="game-setting-container">
					<div class="horizontalButton">${horizontalButton.template()}</div>
					<div class="game-setting-content-container">
						<!-- 인원수 선택 및 닉네임 설정 -->
						<div class="game-setting-tournament-container">
							<div class="game-setting-number-container">
								<!-- 게임 인원수 선택 -->
								<p class="text-subtitle-1 width-14">참여인원</p>
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
								<!-- 닉네임 입력 타이틀 + 입력 창 -->
								<div class="input-nickname-container">
									<div class="text-subtitle-1 width-14">닉네임 입력</div>
									<div class="input-nickname-two-col">
										${inputNickname1.containDiv(
											initialIndex,
											this.data.nickname
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="verticalButton">${verticalButton.template()}</div>
				</div>
			</div>
		`;
	}

	addEventListeners() {
		function addInputNickname(count) {
			const containerIdx = count > 4 ? 2 : 1; // 4명 초과시 두 번째 col 사용
			const container = document.querySelector(
				`.input-nickname-col-${containerIdx}`
			);
			if (!container) return;

			if (container.children.length < 4 || (containerIdx === 1 && count <= 4)) {
				const newInput = document.createElement('div');
				newInput.className = `input-nickname`;
				newInput.innerHTML = new InputNickname(count).template();
				container.appendChild(newInput);
			}
		}

		function removeInputNickname(count) {
			// 4명 이하면 1번째 Col, 초과면 2번째 Col
			const containerIdx = Math.ceil(count / 4);
			const container = document.querySelector(
				`.input-nickname-col-${containerIdx}`
			);
			if (!container || container.children.length === 0) return;
			container.removeChild(container.lastElementChild);
		}

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
					removeInputNickname(count);
					count -= 1;
				}
			} else if (this.classList.contains('plus')) {
				if (count < 8) {
					count += 1;
					addInputNickname(count);
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
			changeUrlData('gameSetting', null);
		});

		function updateNicknamesData(res) {
			const nicknameInputs = document.querySelectorAll(
				'.input-nickname input[type="text"]'
			);
			res.headcount = parseInt(
				document.querySelector('input.in-num').value,
				10
			);
			res.nickname = Array.from(nicknameInputs).map((input) => input.value);
		}

		// 세부 설정 버튼
		const detailedButton = document.querySelector(
			'.verticalButton button:nth-child(1)'
		);
		detailedButton.addEventListener('click', () => {
			// const newData = this.data;
			// this.resetData();
			updateNicknamesData(this.data);
			changeUrlData('gameSettingDetailed', this.data);
		});

		// 시작 버튼
		const startButton = document.querySelector(
			'.verticalButton button:nth-child(2)'
		);
		startButton.addEventListener('click', () => {
			const newData = this.data;
			this.resetData();
			updateNicknamesData(newData);
			newData.total_score *= 5;
			const gamewebsocket = new Gamewebsocket(newData);
			console.log(gamewebsocket);
			// changeUrlData('game', newData);
		});
	}
}

export default new GameSettingTournament();
