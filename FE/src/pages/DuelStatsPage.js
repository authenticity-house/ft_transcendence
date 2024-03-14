import { changeUrl } from '../index.js';
import BoldTitle from '../components/BoldTitle.js';
import ButtonSmall from '../components/ButtonSmall.js';

const html = String.raw;

class DuelStatsPage {
	template() {
		/* Mock Data - api 가져오기 */
		const leftPlayer = '종식';
		const rightPlayer = '원식';
		const leftScore = 9;
		const rightScore = 4;
		const matchDate = '2024년 3월 4일';
		const matchTime = '13분 40초';
		const winPlayer = `${leftPlayer} WIN!`;

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
										<td>32</td>
										<td></td>
										<td>45</td>
									</tr>
									<tr class="basic-table-tr-spacer"></tr>
									<tr>
										<td>평균</td>
										<td></td>
										<td>23</td>
										<td></td>
										<td>20</td>
									</tr>
									<tr class="basic-table-tr-spacer"></tr>
									<tr>
										<td>최소</td>
										<td></td>
										<td>1</td>
										<td></td>
										<td>10</td>
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
									<td>종식종식종식</td>
									<td></td>
									<td>.</td>
									<td></td>
									<td>원식</td>
								</tr>
								<tr class="special-table-tr-spacer"></tr>
								<tr>
									<td>공격형</td>
									<td></td>
									<td>공격성향</td>
									<td></td>
									<td>방어형</td>
								</tr>
								<tr class="special-table-tr-spacer"></tr>
								<tr>
									<td>7</td>
									<td></td>
									<td>파워업 공격 횟수</td>
									<td></td>
									<td>5</td>
								</tr>
								<tr class="special-table-tr-spacer"></tr>
								<tr>
									<td>155</td>
									<td></td>
									<td>평균 키 입력 횟수</td>
									<td></td>
									<td>100</td>
								</tr>
								<tr class="special-table-tr-spacer"></tr>
								<tr>
									<td>하단</td>
									<td></td>
									<td>주요 공격 위치</td>
									<td></td>
									<td>상단</td>
								</tr>
							</tbody>
						</table>
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
}

export default new DuelStatsPage();
