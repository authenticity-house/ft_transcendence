import { changeUrl } from '../index.js';
import BoldTitle from '../components/BoldTitle.js';
import ButtonSmall from '../components/ButtonSmall.js';
import DuelStatsData from '../components/DuelStatsData.js';
import GraphScore from '../components/GraphScore.js';
// import

const html = String.raw;

class DuelStatsPage {
	template(data) {
		const matchData = DuelStatsData.getDuelStatsData(data);

		/* Components */
		const titlComponent = new BoldTitle(matchData.winPlayer, 'pink');
		const nextButton = new ButtonSmall('다음');

		return html`
			<div class="medium-window head_white_neon_15">
				${titlComponent.template()}
				<div class="medium-window-container">
					<div class="score-board-container display-light28">
						<div>${matchData.leftPlayer}</div>
						<ul class="score-board-wrapper pink_neon_10">
							<li>${matchData.leftScore}</li>
							<li>:</li>
							<li>${matchData.rightScore}</li>
						</ul>
						<div>${matchData.rightPlayer}</div>
					</div>
					<div class="divider"></div>
					<div class="basic-stats-container display-light18">
						<div class="match-date-time-container">
							<table>
								<tbody>
									<tr>
										<td>경기날짜</td>
										<td></td>
										<td>${matchData.matchDate}</td>
									</tr>
									<tr class="basic-table-tr-spacer"></tr>
									<tr>
										<td>경기시간</td>
										<td></td>
										<td>${matchData.matchTime}</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div class="match-rally-container">
							<table>
								<tbody>
									<tr>
										<td>.</td>
										<td></td>
										<td>랠리 횟수</td>
										<td></td>
										<td>최대 공속도</td>
									</tr>
									<tr class="basic-table-tr-spacer"></tr>
									<tr>
										<td>최대</td>
										<td></td>
										<td>${matchData.maxRally}</td>
										<td></td>
										<td>${matchData.maxMaxBallSpeed.toFixed(2)}</td>
									</tr>
									<tr class="basic-table-tr-spacer"></tr>
									<tr>
										<td>평균</td>
										<td></td>
										<td>${matchData.avgRally.toFixed(2)}</td>
										<td></td>
										<td>${matchData.avgMaxBallSpeed.toFixed(2)}</td>
									</tr>
									<tr class="basic-table-tr-spacer"></tr>
									<tr>
										<td>최소</td>
										<td></td>
										<td>${matchData.minRally}</td>
										<td></td>
										<td>${matchData.minMaxBallSpeed.toFixed(2)}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
					<div class="divider"></div>
					<div class="special-stats-container display-light18">
						<table>
							<tbody>
								<tr class="display-light24">
									<td>${matchData.leftPlayer}</td>
									<td></td>
									<td>.</td>
									<td></td>
									<td>${matchData.rightPlayer}</td>
								</tr>
								<tr class="special-table-tr-spacer"></tr>
								<tr>
									<td>${matchData.leftAttackType}</td>
									<td></td>
									<td>공격성향</td>
									<td></td>
									<td>${matchData.rightAttackType}</td>
								</tr>
								<tr class="special-table-tr-spacer"></tr>
								<tr>
									<td>${matchData.powerUpCnt1}</td>
									<td></td>
									<td>파워업 공격 횟수</td>
									<td></td>
									<td>${matchData.powerUpCnt2}</td>
								</tr>
								<tr class="special-table-tr-spacer"></tr>
								<tr>
									<td>${matchData.keyCnt1.toFixed(2)}</td>
									<td></td>
									<td>평균 키 입력 횟수</td>
									<td></td>
									<td>${matchData.keyCnt2.toFixed(2)}</td>
								</tr>
								<tr class="special-table-tr-spacer"></tr>
								<tr>
									<td>${matchData.leftAttackPos}</td>
									<td></td>
									<td>주요 공격 위치</td>
									<td></td>
									<td>${matchData.rightAttackPos}</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="divider"></div>
					<div class="graph-container">
						<div class="score-trend-container">
							<div class="score-trend-title display-light24">득점 추이</div>
							<div class="score-trend-canvas-container">
								<div
									class="score-trend-canvas-text-container display-light10"
								></div>
								<canvas
									class="score-trend-canvas-draw-container"
									width="335"
									height="360"
								></canvas>
							</div>
							<div class="score-trend-player-name-container display-light16">
								<div class="score-trend-player-name-wrapper">
									<div class="score-player-name-margin-right">
										${matchData.leftPlayer}
									</div>
									<div class="score-player-color-yellow"></div>
								</div>
								<div class="score-trend-player-name-wrapper">
									<div class="score-player-name-margin-right">
										${matchData.rightPlayer}
									</div>
									<div class="score-player-color-blue"></div>
								</div>
							</div>
						</div>
						<div class="score-position-container">
							<div class="score-position-title display-light24">득점 위치</div>
							<div class="score-position-player-name-container display-light16">
								<div class="score-position-player-left-wrapper">
									<div class="score-player-name-margin-right">
										${matchData.leftPlayer}
									</div>
									<div class="score-player-color-yellow"></div>
								</div>
								<div class="score-position-player-right-wrapper">
									<div class="score-player-color-blue"></div>
									<div class="score-player-name-margin-left">
										${matchData.rightPlayer}
									</div>
								</div>
							</div>
							<canvas class="score-position-canvas" width="280" height="360">
							</canvas>
						</div>
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
			changeUrl('match');
		});
	}

	mount(data) {
		const matchData = DuelStatsData.getMountDuelStatsData(data);
		// score-trend
		GraphScore.appendScoresToYAxis(matchData.maxScore);
		GraphScore.appendScoreTrendGraph(
			matchData.leftScoreTrend,
			matchData.rightScoreTrend
		);
		// score-position
		GraphScore.appendScorePositionGraph(
			matchData.leftPosition,
			matchData.rightPosition
		);
	}
}

export default new DuelStatsPage();
