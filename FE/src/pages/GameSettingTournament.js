import { changeUrlData } from '../index.js';
import HorizontalButton from '../components/HorizontalButton.js';
import VerticalButton from '../components/VerticalButton.js';
import { activateButtons } from '../components/ActivateButtons.js';
import InputNickname from '../components/InputNickname.js';

const html = String.raw;

class GameSettingTournament {
	constructor() {
		this.initialData = {
			battle_mode: 1,
			total_score: 2,
			level: 2,
			color: {
				paddle: '#5AD7FF',
				ball: '#FFD164'
			}
		};
		this.data = { ...this.initialData };
	}

	resetData() {
		this.data = JSON.parse(JSON.stringify(this.initialData));
	}

	template(data = this.data) {
		this.data = data;
		if (data == null) this.resetData();
		else this.data = data;

		const horizonbuttonConfigs = [
			{ text: '1vs1', classes: 'selected' },
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

		const inputNickname1 = new InputNickname(1, 4);
		const inputNickname2 = new InputNickname(5, 8);
		return html`
			<div class="game-setting-window head_white_neon_15">
				<div class="game-setting-container">
					<div class="game-setting-content-container">
						<div class="horizontalButton">${horizontalButton.template()}</div>
						<!-- 인원수 선택 및 닉네임 설정 -->
						<div class="game-setting-tournament-container">
							<div class="game-setting-number-container">
								<!-- 게임 인원수 선택 -->
								<p class="text-subtitle-1 width-14">참여인원</p>
								<div class="num-block head-count">
									<div class="num-in">
										<span class="minus"></span>
										<input type="text" class="in-num" value="4" readonly="" />
										<span class="plus"></span>
									</div>
								</div>
							</div>
							<!-- 닉네임 입력 테두리 -->
							<div class="game-setting-nickname-container">
								<!-- 닉네임 입력 타이틀 + 입력 창 -->
								<div class="input-nickname-container">
									<div class="text-subtitle-1 width-14">닉네임 입력</div>
									<div class="input-nickname-2">
										<div class="input-nickname-1">
											${inputNickname1.template()}
										</div>
										<div class="input-nickname-1">
											${inputNickname2.template()}
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="verticalButton">${verticalButton.template()}</div>
					</div>
				</div>
			</div>
		`;
	}

	addEventListeners() {
		function updateButtonsState(numBlock, count) {
			const minusButton = numBlock.querySelector('.minus');
			const plusButtons = numBlock.querySelectorAll('.plus');

			if (count <= 1) minusButton.classList.add('dis');
			else minusButton.classList.remove('dis');

			plusButtons.forEach((plusButton) => {
				if (count >= 8) plusButton.classList.add('dis');
				else plusButton.classList.remove('dis');
			});
		}

		function handleSpanClick() {
			const input = this.closest('.num-block').querySelector('input.in-num');
			let count = parseInt(input.value, 10);

			if (this.classList.contains('minus')) {
				count = count - 1 < 1 ? 1 : count - 1;
			} else if (this.classList.contains('plus')) {
				count = count + 1 > 8 ? 8 : count + 1;
			}
			input.value = count;
			input.dispatchEvent(new Event('change'));

			updateButtonsState(this.closest('.num-block'), count);

			return false; // preventDefault 역할
		}

		document.querySelectorAll('.num-in span').forEach((span) => {
			span.addEventListener('click', handleSpanClick);
		});

		activateButtons('.horizontalButton');
		const detailedButton = document.querySelector(
			'.verticalButton button:nth-child(1)'
		);
		detailedButton.addEventListener('click', () => {
			changeUrlData('gameSettingDetailed', this.data);
		});

		const startButton = document.querySelector(
			'.verticalButton button:nth-child(2)'
		);
		startButton.addEventListener('click', () => {
			changeUrlData('tournament', this.data);
		});
	}
}

export default new GameSettingTournament();
