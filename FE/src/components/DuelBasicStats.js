const html = String.raw;

class DuelBasicStats {
	static getScoreBoardHTML(matchData) {
		return html`
			<div class="score-board-container display-light28">
				<div>${matchData.leftPlayer}</div>
				<ul class="score-board-wrapper pink_neon_10">
					<li>${matchData.leftScore}</li>
					<li>:</li>
					<li>${matchData.rightScore}</li>
				</ul>
				<div>${matchData.rightPlayer}</div>
			</div>
		`;
	}

	static getMatchDateTimeHTML(matchData) {
		return html`
			<table class="match-date-time-table">
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
		`;
	}

	static getMatchRallyHTML(matchData) {
		return html`
			<table class="match-rally-table">
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
		`;
	}
}

export default DuelBasicStats;
