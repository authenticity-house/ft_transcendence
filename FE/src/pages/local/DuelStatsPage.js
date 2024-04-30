import { changeUrl } from '../../index.js';
import BoldTitle from '../../components/BoldTitle.js';
import ButtonSmall from '../../components/ButtonSmall.js';
import DuelStatsData from '../../components/DuelStatsData.js';
import DuelBasicStats from '../../components/DuelBasicStats.js';
import DuelSpecialStats from '../../components/DuelSpecialStats.js';
import DuelGraphStats from '../../components/DuelGraphStats.js';

const html = String.raw;

class DuelStatsPage {
	template(data) {
		this.data = data;

		const matchData = DuelStatsData.getDuelStatsData(data);

		/* Components */
		const titleComponent = new BoldTitle(matchData.winPlayer, 'pink');
		const scoreBoardHtml = DuelBasicStats.getScoreBoardHTML(matchData);
		const matchDateTimeHtml = DuelBasicStats.getMatchDateTimeHTML(matchData);
		const matchRallyHtml = DuelBasicStats.getMatchRallyHTML(matchData);
		const specialStatsHtml = DuelSpecialStats.getSpecialStatsHTML(matchData);
		const scoreTrendHtml = DuelGraphStats.getScoreTrendHTML(matchData, true);
		const scorePositionHtml = DuelGraphStats.getScorePositionHTML(
			matchData,
			true
		);
		const nextButton = new ButtonSmall('다음');

		return html`
			<div class="medium-window head_white_neon_15">
				${titleComponent.template()}
				<div class="medium-window-container">
					${scoreBoardHtml}
					<div class="divider"></div>
					<div class="basic-stats-container display-light18">
						${matchDateTimeHtml} ${matchRallyHtml}
					</div>
					<div class="divider"></div>
					${specialStatsHtml}
					<div class="divider"></div>
					<div class="graph-container">
						${scoreTrendHtml} ${scorePositionHtml}
					</div>
				</div>
				<div class="event-click-match" style="margin-top: 4rem">
					${nextButton.template()}
				</div>
			</div>
		`;
	}

	mount(data) {
		const matchData = DuelStatsData.getMountDuelStatsData(data);
		// score-trend
		DuelGraphStats.appendScoresToYAxis(matchData.maxScore, false, true);
		DuelGraphStats.appendScoreTrendGraph(
			matchData.leftScoreTrend,
			matchData.rightScoreTrend,
			false,
			true
		);
		// score-position
		DuelGraphStats.appendScorePositionGraph(
			matchData.leftPosition,
			matchData.rightPosition,
			false,
			true
		);
	}

	addEventListeners() {
		const back = document.querySelector('.event-click-match');
		back.addEventListener('click', () => {
			this.data.sendMsg();
			if (this.data.sendMsg.name === 'bound sendGameDisconnect') {
				history.pushState(null, null, 'gameBlock');
				changeUrl('matchMode');
			}
		});
	}
}

export default new DuelStatsPage();
