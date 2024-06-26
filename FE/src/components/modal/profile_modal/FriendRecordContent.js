import DuelBasicStats from '../../DuelBasicStats.js';
import DuelGraphStats from '../../DuelGraphStats.js';
import { duelReportWrapper } from '../../DuelReport.js';
import DuelSpecialStats from '../../DuelSpecialStats.js';
import DuelStatsData from '../../DuelStatsData.js';

const html = String.raw;

class FriendRecordContent {
	template() {
		return html`
			<div class="friend-record-content-container">
				<span class="yellow_neon_10 display-medium48">경기 기록</span>
				<div class="friend-record-container"></div>
			</div>
		`;
	}

	mount(data) {
		this.data = data;
		const content = data;

		let duelReports = '';

		for (let i = 0; i < content.length; i += 1) {
			const playerData = {
				player1: content[i].player1,
				player2: content[i].player2
			};
			content[i].data.player1.nickname = playerData.player1.nickname;
			content[i].data.player2.nickname = playerData.player2.nickname;
			content[i].data.player1.image = playerData.player1.profile_url;
			content[i].data.player2.image = playerData.player2.profile_url;
			const resultData = DuelStatsData.getDuelStatsData(content[i].data);
			const matchRallyHtml = DuelBasicStats.getMatchRallyHTML(resultData);
			const specialStatsHtml = DuelSpecialStats.getSpecialStatsHTML(resultData);
			const scoreTrendHtml = DuelGraphStats.getScoreTrendHTML(resultData);
			const scorePositionHtml = DuelGraphStats.getScorePositionHTML(resultData);

			duelReports += duelReportWrapper(
				resultData,
				matchRallyHtml,
				specialStatsHtml,
				scoreTrendHtml,
				scorePositionHtml
			);
		}

		const friendRecordContainer = document.querySelector(
			'.friend-record-container'
		);
		friendRecordContainer.innerHTML = duelReports;

		let i = 0;

		const graphContainers =
			friendRecordContainer.querySelectorAll('.graph-container');

		graphContainers.forEach((container) => {
			const matchData = DuelStatsData.getMountDuelStatsData(content[i].data);

			DuelGraphStats.appendScoresToYAxis(matchData.maxScore, container);
			DuelGraphStats.appendScoreTrendGraph(
				matchData.leftScoreTrend,
				matchData.rightScoreTrend,
				container
			);

			DuelGraphStats.appendScorePositionGraph(
				matchData.leftPosition,
				matchData.rightPosition,
				container
			);
			i += 1;
		});

		const toggleContainers = friendRecordContainer.querySelectorAll(
			'.duel-toggle-container'
		);
		toggleContainers.forEach((container) => {
			container.classList.add('duel-toggle-hidden');
		});
	}

	addEventListeners() {
		const friendRecordContainer = document.querySelector(
			'.friend-record-container'
		);
		const toggleButtons = friendRecordContainer.querySelectorAll(
			'.duel-toggle-button'
		);
		toggleButtons.forEach((button) => {
			button.addEventListener('click', () => {
				const parentWrapper = button.closest('.duel-report-wrapper');
				const toggleContent = parentWrapper.querySelector(
					'.duel-toggle-container'
				);
				toggleContent.classList.toggle('duel-toggle-hidden');

				button.querySelector('img').classList.toggle('duel-button-roate');
			});
		});
	}
}

export const friendRecordContent = new FriendRecordContent();
