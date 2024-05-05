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

		const playerData = DuelStatsData.getDuelStatsData(this.data);
		const scoreboardLeftplayer = document.querySelectorAll(
			'.score-board-leftPlayer'
		);
		const scoreboardRightplayer = document.querySelectorAll(
			'.score-board-rightPlayer'
		);

		for (let i = 0; i < scoreboardLeftplayer.length; i += 1) {
			if (playerData.leftPlayer.length > 10) {
				scoreboardLeftplayer[i].classList.add('display-light18');
			} else if (playerData.leftPlayer.length > 7) {
				scoreboardLeftplayer[i].classList.add('display-light24');
			} else {
				scoreboardLeftplayer[i].classList.add('display-light32');
			}
		}

		for (let i = 0; i < scoreboardRightplayer.length; i += 1) {
			if (playerData.rightPlayer.length > 10) {
				scoreboardRightplayer[i].classList.add('display-light18');
			} else if (playerData.rightPlayer.length > 7) {
				scoreboardRightplayer[i].classList.add('display-light24');
			} else {
				scoreboardRightplayer[i].classList.add('display-light32');
			}
		}
	}

	addEventListeners() {
		const back = document.querySelector('.event-click-match');
		back.addEventListener('click', () => {
			this.data.sendMsg();
			if (this.data.sendMsg.name === 'bound sendGameDisconnect') {
				history.pushState(null, null, 'gameBlock');
				if (this.data.mode === 'online')
					changeUrl('onlineMainScreen'); // online
				else changeUrl('playMode'); // local
			}
		});
	}
}

export default new DuelStatsPage();
