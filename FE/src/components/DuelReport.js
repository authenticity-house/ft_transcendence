const html = String.raw;

function duelResultElement(data) {
	return html`
		<div class="duel-user-container justify-content-start">
			<div class="user-image-container"></div>
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
			<div class="user-image-container"></div>
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
