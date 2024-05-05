const html = String.raw;

class DuelSpecialStats {
	static getSpecialStatsHTML(matchData) {
		return html`
			<table class="special-stats-table display-light18">
				<tbody>
					<tr class="display-light24">
						<td class="score-board-leftPlayer">${matchData.leftPlayer}</td>
						<td></td>
						<td>.</td>
						<td></td>
						<td class="score-board-rightPlayer">${matchData.rightPlayer}</td>
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
		`;
	}
}

export default DuelSpecialStats;
