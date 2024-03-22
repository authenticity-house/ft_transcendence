import { changeUrl } from '../index.js';
import BoldTitle from '../components/BoldTitle.js';
import ButtonSmall from '../components/ButtonSmall.js';
import {
	graphScoreText,
	getScoreTextPosition,
	graphScoreTrend,
	graphScorePosition
} from '../components/GraphScore.js';

const html = String.raw;

class DuelStatsPage {
	template(data) {
		const attackTypeList = ['공격형', '방어형', '혼합형'];
		const attackPosList = ['상단', '중단', '하단', '전체'];
		/* Mock Data - api 가져오기 */
		const leftPlayer = data ? data.player1.nickname : '플레이어1';
		const rightPlayer = data ? data.player2.nickname : '플레이어2';
		const leftScore = data ? data.player1.score : 0;
		const rightScore = data ? data.player2.score : 0;
		const matchDate = data ? data.date : '2021-03-17';
		const matchTime = data ? data.play_time : '00:00:01';
		const winPlayer =
			leftScore > rightScore ? `${leftPlayer} WIN!` : `${rightPlayer} WIN!`;
		const maxRally = data ? data.rally[0] : 0;
		const maxMaxBallSpeed = data ? data.max_ball_speed[0] : 0;
		const avgRally = data ? data.rally[1] : 0;
		const avgMaxBallSpeed = data ? data.max_ball_speed[1] : 0;
		const minRally = data ? data.rally[2] : 0;
		const minMaxBallSpeed = data ? data.max_ball_speed[2] : 0;
		const attackType1 = data ? data.player1.attack_type : 0;
		const attackType2 = data ? data.player2.attack_type : 0;
		const powerUpCnt1 = data ? data.player1.power_up_cnt : 0;
		const powerUpCnt2 = data ? data.player2.power_up_cnt : 0;
		const keyCnt1 = data ? data.player1.key_cnt : 0;
		const keyCnt2 = data ? data.player2.key_cnt : 0;
		const attackPos1 = data ? data.player1.attack_pos : 0;
		const attackPos2 = data ? data.player2.attack_pos : 0;

		/* Components */
		const titlComponent = new BoldTitle(winPlayer, 'pink');
		const nextButton = new ButtonSmall('다음');

		return html`
			<div class="medium-window head_white_neon_15">
				${titlComponent.template()}
				<div class="medium-window-container">
					<div class="score-board-container display-light28">
						<div>${leftPlayer}</div>
						<ul class="score-board-wrapper pink_neon_10">
							<li>${leftScore}</li>
							<li>:</li>
							<li>${rightScore}</li>
						</ul>
						<div>${rightPlayer}</div>
					</div>
					<div class="divider"></div>
					<div class="basic-stats-container display-light18">
						<div class="match-date-time-container">
							<table>
								<tbody>
									<tr>
										<td>경기날짜</td>
										<td></td>
										<td>${matchDate}</td>
									</tr>
									<tr class="basic-table-tr-spacer"></tr>
									<tr>
										<td>경기시간</td>
										<td></td>
										<td>${matchTime}</td>
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
										<td>${maxRally}</td>
										<td></td>
										<td>${maxMaxBallSpeed.toFixed(2)}</td>
									</tr>
									<tr class="basic-table-tr-spacer"></tr>
									<tr>
										<td>평균</td>
										<td></td>
										<td>${avgRally.toFixed(2)}</td>
										<td></td>
										<td>${avgMaxBallSpeed.toFixed(2)}</td>
									</tr>
									<tr class="basic-table-tr-spacer"></tr>
									<tr>
										<td>최소</td>
										<td></td>
										<td>${minRally}</td>
										<td></td>
										<td>${minMaxBallSpeed.toFixed(2)}</td>
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
									<td>${leftPlayer}</td>
									<td></td>
									<td>.</td>
									<td></td>
									<td>${rightPlayer}</td>
								</tr>
								<tr class="special-table-tr-spacer"></tr>
								<tr>
									<td>${attackTypeList[attackType1]}</td>
									<td></td>
									<td>공격성향</td>
									<td></td>
									<td>${attackTypeList[attackType2]}</td>
								</tr>
								<tr class="special-table-tr-spacer"></tr>
								<tr>
									<td>${powerUpCnt1}</td>
									<td></td>
									<td>파워업 공격 횟수</td>
									<td></td>
									<td>${powerUpCnt2}</td>
								</tr>
								<tr class="special-table-tr-spacer"></tr>
								<tr>
									<td>${keyCnt1.toFixed(2)}</td>
									<td></td>
									<td>평균 키 입력 횟수</td>
									<td></td>
									<td>${keyCnt2.toFixed(2)}</td>
								</tr>
								<tr class="special-table-tr-spacer"></tr>
								<tr>
									<td>${attackPosList[attackPos1]}</td>
									<td></td>
									<td>주요 공격 위치</td>
									<td></td>
									<td>${attackPosList[attackPos2]}</td>
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
										${leftPlayer}
									</div>
									<div class="score-player-color-yellow"></div>
								</div>
								<div class="score-trend-player-name-wrapper">
									<div class="score-player-name-margin-right">
										${rightPlayer}
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
										${leftPlayer}
									</div>
									<div class="score-player-color-yellow"></div>
								</div>
								<div class="score-position-player-right-wrapper">
									<div class="score-player-color-blue"></div>
									<div class="score-player-name-margin-left">
										${rightPlayer}
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
		// score-trend
		const leftScoreTrend = data ? data.graph.player1.score_trend : [];
		const rightScoreTrend = data ? data.graph.player2.score_trend : [];
		const leftScore = data ? data.player1.score : 15;
		const rightScore = data ? data.player2.score : 15;
		const maxScore = leftScore >= rightScore ? leftScore : rightScore;
		const scoreText = document.querySelector(
			'.score-trend-canvas-text-container'
		);
		scoreText.appendChild(graphScoreText(maxScore));
		const position = getScoreTextPosition();
		graphScoreTrend(leftScoreTrend, rightScoreTrend, position);

		// score-position
		const leftPosition = data ? data.graph.player1.score_pos : [];
		const rightPosition = data ? data.graph.player2.score_pos : [];
		graphScorePosition(leftPosition, rightPosition);
	}
}

export default new DuelStatsPage();
