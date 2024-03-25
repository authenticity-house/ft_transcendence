import { changeUrl } from '../index.js';
import BoldTitle from '../components/BoldTitle.js';
import ButtonSmall from '../components/ButtonSmall.js';
import DuelStatsData from '../components/DuelStatsData.js';
import DuelBasicStats from '../components/DuelBasicStats.js';
import DuelSpecialStats from '../components/DuelSpecialStats.js';
import DuelGraphStats from '../components/DuelGraphStats.js';
import DuelStatsData from '../components/DuelStatsData.js';
import DuelBasicStats from '../components/DuelBasicStats.js';
import DuelSpecialStats from '../components/DuelSpecialStats.js';
import DuelGraphStats from '../components/DuelGraphStats.js';

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
		const scoreTrendHtml = DuelGraphStats.getScoreTrendHTML(matchData);
		const scorePositionHtml = DuelGraphStats.getScorePositionHTML(matchData);
		const titleComponent = new BoldTitle(matchData.winPlayer, 'pink');
		const scoreBoardHtml = DuelBasicStats.getScoreBoardHTML(matchData);
		const matchDateTimeHtml = DuelBasicStats.getMatchDateTimeHTML(matchData);
		const matchRallyHtml = DuelBasicStats.getMatchRallyHTML(matchData);
		const specialStatsHtml = DuelSpecialStats.getSpecialStatsHTML(matchData);
		const scoreTrendHtml = DuelGraphStats.getScoreTrendHTML(matchData);
		const scorePositionHtml = DuelGraphStats.getScorePositionHTML(matchData);
		const nextButton = new ButtonSmall('다음');

		return html`
			<div class="medium-window head_white_neon_15">
				${titleComponent.template()} ${titleComponent.template()}
				<div class="medium-window-container">
					${scoreBoardHtml} ${scoreBoardHtml}
					<div class="divider"></div>
					<div class="basic-stats-container display-light18">
						${matchDateTimeHtml} ${matchRallyHtml} ${matchDateTimeHtml}
						${matchRallyHtml}
					</div>
					<div class="divider"></div>
					${specialStatsHtml} ${specialStatsHtml}
					<div class="divider"></div>
					<div class="graph-container">
						${scoreTrendHtml} ${scorePositionHtml} ${scoreTrendHtml}
						${scorePositionHtml}
					</div>
				</div>
				<div class="event-click-match" style="margin-top: 4rem">
					${nextButton.template()}
				</div>
			</div>
		`;
	}

	addEventListeners() {
		const back = document.querySelector('.event-click-match');
		back.addEventListener('click', () => {
			if (this.data.Gamewebsocket) {
				const nextMessage = {
					type: 'game',
					subtype: 'next_match',
					message: 'go!'
				};
				this.data.Gamewebsocket.send(JSON.stringify(nextMessage));
			} else {
				changeUrl('match');
			}
		});
	}

	mount(data) {
		const matchData = DuelStatsData.getMountDuelStatsData(data);
		const matchData = DuelStatsData.getMountDuelStatsData(data);
		// score-trend
		DuelGraphStats.appendScoresToYAxis(matchData.maxScore);
		DuelGraphStats.appendScoreTrendGraph(
			matchData.leftScoreTrend,
			matchData.rightScoreTrend
		);
		// score-position
		DuelGraphStats.appendScorePositionGraph(
			matchData.leftPosition,
			matchData.rightPosition
		);
		DuelGraphStats.appendScoresToYAxis(matchData.maxScore);
		DuelGraphStats.appendScoreTrendGraph(
			matchData.leftScoreTrend,
			matchData.rightScoreTrend
		);
		// score-position
		DuelGraphStats.appendScorePositionGraph(
			matchData.leftPosition,
			matchData.rightPosition
		);
	}
}

export default new DuelStatsPage();
