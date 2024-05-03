const html = String.raw;

function duelResultElement(data) {
	return html`
		<div class="duel-user-container justify-content-start">
			<div class="user-image-container">
				<img src="${data.leftPlayerImage}" alt="user" />
			</div>
			<div class="user-blank-container"></div>
			<div class="user-nickname-container">${data.leftPlayer}</div>
		</div>
		<div class="duel-score-container pink_neon_10">
			<div class="duel-score-wrapper">${data.leftScore}</div>
			<div class="duel-score-wrapper">:</div>
			<div class="duel-score-wrapper">${data.rightScore}</div>
		</div>
		<div class="duel-user-container justify-content-end">
			<div class="user-nickname-container justify-content-end">
				${data.rightPlayer}
			</div>
			<div class="user-blank-container"></div>
			<div class="user-image-container">
				<img src="${data.rightPlayerImage}" alt="user" />
			</div>
		</div>
	`;
}

function duelDateTimeElement(data) {
	return html`
		<div class="duel-date-time-wrapper">
			<div class="duel-date-time-title">경기 날짜</div>
			<div class="duel-date-time-data">${data.matchDate}</div>
		</div>
		<div class="duel-date-time-wrapper">
			<div class="duel-date-time-title">경기 시간</div>
			<div class="duel-date-time-data">${data.matchTime}</div>
		</div>
	`;
}

function duelCollapseElement(
	matchRallyHtml,
	specialStatsHtml,
	scoreTrendHtml,
	scorePositionHtml,
	unique
) {
	const uniqueText = unique ? 'unique-' : '';
	return html`
		<div class="divider"></div>
		<div class="basic-stats-container display-light18">${matchRallyHtml}</div>
		<div class="divider"></div>
		${specialStatsHtml}
		<div class="divider"></div>
		<div class="${uniqueText}graph-container">
			${scoreTrendHtml} ${scorePositionHtml}
		</div>
	`;
}

function duelReportWrapper(
	data,
	matchRallyHtml,
	specialStatsHtml,
	scoreTrendHtml,
	scorePositionHtml,
	unique
) {
	// data
	// {
	// 	"leftPlayer": "2",
	// 	"rightPlayer": "3",
	// 	"leftScore": 5,
	// 	"rightScore": 4,
	// 	"winPlayer": "2 WIN!",
	// 	"matchDate": "2024-05-03",
	// 	"matchTime": "00:00:24",
	// 	"maxRally": 1,
	// 	"maxMaxBallSpeed": 0.055,
	// 	"avgRally": 0.1111111111111111,
	// 	"avgMaxBallSpeed": 0.04166666666666666,
	// 	"minRally": 0,
	// 	"minMaxBallSpeed": 0.04,
	// 	"leftAttackType": "공격형",
	// 	"rightAttackType": "공격형",
	// 	"leftAttackPos": "전체",
	// 	"rightAttackPos": "상단",
	// 	"powerUpCnt1": 0,
	// 	"powerUpCnt2": 0,
	// 	"keyCnt1": 0,
	// 	"keyCnt2": 0
	// }
	const resultElement = duelResultElement(data);
	const dataTimeElement = duelDateTimeElement(data);
	const collapseElement = duelCollapseElement(
		matchRallyHtml,
		specialStatsHtml,
		scoreTrendHtml,
		scorePositionHtml,
		unique
	);

	return html`
		<div class="duel-report-wrapper">
			<div class="duel-result-container display-light28">${resultElement}</div>
			<div class="duel-date-time-container display-light18">
				${dataTimeElement}
			</div>
			<button class="duel-toggle-button">
				<img
					src="image/duel-detail-button.svg"
					alt="back"
					style="width: 4rem, color:white"
				/>
			</button>
			<div class="duel-toggle-container">${collapseElement}</div>
		</div>
	`;
}

export { duelReportWrapper };
