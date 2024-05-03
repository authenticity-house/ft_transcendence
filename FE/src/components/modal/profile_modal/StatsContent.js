import {
	appendRatingText,
	drawRatingChange,
	drawAttackTendency
} from '../../ModalGraphStats.js';

const html = String.raw;

class StatsContent {
	template() {
		// MOCK data - modal stats
		const mockData = {
			nickName: '닉네임',
			playTime: { local: '0h 0m 0s', online: '0h 0m 0s' },
			matchCount: { all: 0, win: 0, lose: 0, winRate: 0 },
			rating: 1500,
			top: {
				topRating: 1800,
				topBallSpeed: 100,
				topRallyCount: 55
			}
		};

		return html`
			<div class="modal-stats-container">
				<div class="play-time-container">
					<span id="stats-nickname" class="display-medium36 text_yellow_neon"
						>${mockData.nickName}</span
					>
					<div class="play-time-wrapper">
						<span class="display-light24">총 플레이 타임</span>
						<div class="modal-stats-divider"></div>
						<div class="play-time-input-container display-light20">
							<div class="play-time-input-wrapper">
								<span>로컬</span>
								<span id="stats-playtime-local"
									>${mockData.playTime.local}</span
								>
							</div>
							<div class="play-time-input-wrapper">
								<span>온라인</span>
								<span id="stats-playtime-online"
									>${mockData.playTime.online}</span
								>
							</div>
						</div>
					</div>
				</div>
				<div class="stats-text-container display-light20">
					<div class="play-count-container">
						<span id="stats-match-count"
							>${mockData.matchCount.all}전 ${mockData.matchCount.win}승
							${mockData.matchCount.lose}패</span
						>
						<span id="stats-win-rating"
							>승률: ${mockData.matchCount.winRate}%</span
						>
						<span id="stats-rating">레이팅: ${mockData.rating}점</span>
					</div>
					<div class="top-stats-container">
						<span class="display-light24">TOP</span>
						<div class="modal-stats-divider"></div>
						<div class="top-stats-wrapper">
							<span>최고 레이팅</span>
							<span id="stats-max-rating">${mockData.top.topRating}점</span>
						</div>
						<div class="top-stats-wrapper">
							<span>최고 공 속도</span>
							<span id="stats-max-ball-speed"
								>${mockData.top.topBallSpeed}km</span
							>
						</div>
						<div class="top-stats-wrapper">
							<span>최고 렐리 횟수</span>
							<span id="stats-max-rally-count"
								>${mockData.top.topRallyCount}번</span
							>
						</div>
					</div>
				</div>
				<div class="graph-stats-container display-medium20">
					<div class="rating-change-container">
						<div class="rating-change-title"><span>레이팅 변화율</span></div>
						<div class="rating-change-wrapper display-light20">
							<div class="rating-change-text-container display-light14"></div>
							<div class="rating-change-canvas-wrapper">
								<canvas class="rating-change-canvas"></canvas>
								<div id="rating-tooltip" class="display-light16"></div>
							</div>
						</div>
					</div>
					<div class="attack-tendency-container">
						<span>공격 성향</span>
						<div class="attack-tendency-wrapper">
							<canvas class="attack-tendency-canvas"></canvas>
						</div>
					</div>
				</div>
			</div>
		`;
	}

	displayApiTextData(id, textData) {
		if (textData) document.getElementById(id).textContent = textData;
	}

	mount(data) {
		this.displayApiTextData('stats-nickname', data.nickname);
		this.displayApiTextData('stats-playtime-local', data.local_play_time);
		this.displayApiTextData('stats-playtime-online', data.online_play_time);
		this.displayApiTextData(
			'stats-match-count',
			`${data.total_count}전 ${data.wins_count}승 ${data.losses_count}패`
		);
		this.displayApiTextData(
			'stats-win-rating',
			`승률 : ${data.winning_rate * 100}%`
		);
		this.displayApiTextData('stats-rating', `레이팅: ${data.rating}점`);
		this.displayApiTextData('stats-max-rating', `${data.max_rating}점`);
		this.displayApiTextData('stats-max-ball-speed', data.max_ball_speed);
		this.displayApiTextData('stats-max-rally-count', `${data.max_rally_cnt}번`);

		const ratingChangeTextContainer = document.querySelector(
			'.rating-change-text-container'
		);
		const ratingChangeText = appendRatingText(data.graph.rating_change);
		ratingChangeTextContainer.innerHTML = ratingChangeText;
		const toolTip = drawRatingChange(data.graph.rating_change);

		drawAttackTendency(data.graph.attack_type);
		return toolTip;
	}

	addEventListeners(toolTip) {
		const ratingCanvas = document.querySelector('.rating-change-canvas');
		ratingCanvas.addEventListener('mousemove', (event) => {
			const rect = ratingCanvas.getBoundingClientRect();
			const mouseX = event.clientX - rect.left;
			const mouseY = event.clientY - rect.top;

			// 마우스 위치와 각 원의 위치를 비교하여 레이팅 점수 확인
			for (const [x, y, rating] of toolTip) {
				// 현재 마우스 위치가 원의 범위 내에 있는지 확인
				const distance = Math.sqrt((mouseX - x) ** 2 + (mouseY - y) ** 2);
				if (distance <= 5) {
					// 마우스 위치가 원의 범위 내에 있으면 해당 원의 레이팅 점수를 표시
					this.showToolTip(mouseX, mouseY, rating);
					return;
				}
			}
			this.hideToolTip();
		});
	}

	showToolTip(x, y, rating) {
		const tooltipOffsetX = 10; // 툴팁을 오른쪽으로 이동할 거리
		const tooltipOffsetY = -15; // 툴팁을 위쪽으로 이동할 거리
		const tooltipElement = document.getElementById('rating-tooltip');
		tooltipElement.innerText = `레이팅 : ${rating}`;
		tooltipElement.style.left = `${tooltipOffsetX + x}px`;
		tooltipElement.style.top = `${tooltipOffsetY + y}px`;
		tooltipElement.style.display = 'block';
	}

	hideToolTip() {
		const tooltipElement = document.getElementById('rating-tooltip');
		tooltipElement.style.display = 'none';
	}
}

export const statsContent = new StatsContent();
