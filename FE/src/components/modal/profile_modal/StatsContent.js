import { appendRatingText, drawRatingChange } from '../../ModalGraphStats.js';

const html = String.raw;

class StatsContent {
	template() {
		// MOCK data - modal stats
		const mockData = {
			nickName: '종식',
			playTime: { local: '36m 24s', online: '1h 36m 50s' },
			matchCount: { all: 1000, win: 500, lose: 500, winRate: 50 },
			rating: 1500,
			top: {
				topRating: 1800,
				topBallSpeed: 100,
				topRallyCount: 55
			},
			ratingChange: [
				1000, 1050, 1100, 1150, 1200, 1300, 1250, 1270, 1300, 1240, 1220, 1280
			]
		};

		const ratingChangeText = appendRatingText(mockData.ratingChange);

		return html`
			<div class="modal-stats-container">
				<div class="play-time-container">
					<span class="display-medium36 text_yellow_neon">
						${mockData.nickName}
					</span>
					<div class="play-time-wrapper">
						<span class="display-light24">총 플레이 타임</span>
						<div class="modal-stats-divider"></div>
						<div class="play-time-input-container display-light20">
							<div class="play-time-input-wrapper">
								<span>로컬</span>
								<span>${mockData.playTime.local}</span>
							</div>
							<div class="play-time-input-wrapper">
								<span>온라인</span>
								<span>${mockData.playTime.online}</span>
							</div>
						</div>
					</div>
				</div>
				<div class="stats-text-container display-light20">
					<div class="play-count-container">
						<span
							>${mockData.matchCount.all}전 ${mockData.matchCount.win}승
							${mockData.matchCount.lose}패</span
						>
						<span>승률: ${mockData.matchCount.winRate}%</span>
						<span>레이팅: ${mockData.rating}점</span>
					</div>
					<div class="top-stats-container">
						<span class="display-light24">TOP</span>
						<div class="modal-stats-divider"></div>
						<div class="top-stats-wrapper">
							<span>최고 레이팅</span>
							<span>${mockData.top.topRating}점</span>
						</div>
						<div class="top-stats-wrapper">
							<span>최고 공 속도</span>
							<span>${mockData.top.topBallSpeed}km</span>
						</div>
						<div class="top-stats-wrapper">
							<span>최고 렐리 횟수</span>
							<span>${mockData.top.topRallyCount}번</span>
						</div>
					</div>
				</div>
				<div class="graph-stats-container display-medium20">
					<div class="rating-change-container">
						<span>레이팅 변화율</span>
						<div class="rating-change-wrapper display-light20">
							<div class="rating-change-text-container display-light10">
								${ratingChangeText}
							</div>
							<canvas class="rating-change-canvas"></canvas>
							<div
								id="rating-tooltip"
								style="position: absolute; display: none;"
							></div>
						</div>
					</div>
					<div class="attack-tendency-container">
						<span>공격 성향</span>
						<div class="attack-tendency-wrapper display-light20"></div>
					</div>
				</div>
			</div>
		`;
	}

	mount(data) {
		drawRatingChange(data.ratingChange);
	}
}

export const statsContent = new StatsContent();
