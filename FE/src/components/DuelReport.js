const html = String.raw;

function duelResultElement() {
	return html`
		<div class="duel-user-container justify-content-start">
			<div class="user-image-container"></div>
			<div class="user-blank-container"></div>
			<div class="user-nickname-container">hello</div>
		</div>
		<div class="duel-score-container pink_neon_10">
			<div class="duel-score-wrapper">2</div>
			<div class="duel-score-wrapper">:</div>
			<div class="duel-score-wrapper">2</div>
		</div>
		<div class="duel-user-container justify-content-end">
			<div class="user-nickname-container justify-content-end">hello</div>
			<div class="user-blank-container"></div>
			<div class="user-image-container"></div>
		</div>
	`;
}

function duelDateTimeElement() {
	return html`
		<div class="duel-date-time-wrapper">
			<div class="duel-date-time-title">경기 날짜</div>
			<div class="duel-date-time-data">2024.04.04</div>
		</div>
		<div class="duel-date-time-wrapper">
			<div class="duel-date-time-title">경기 시간</div>
			<div class="duel-date-time-data">00:00:00</div>
		</div>
	`;
}

function duelCollapseElement() {
	return html``;
}

function duelReportWrapper(data) {
	/* MOCK DATA */
	const resultElement = duelResultElement(data);
	const dataTimeElement = duelDateTimeElement(data);
	const collapseElement = duelCollapseElement(data);

	return html`
		<div class="duel-report-wrapper">
			<div class="duel-result-container display-light28">${resultElement}</div>
			<div class="duel-date-time-container display-light18">
				${dataTimeElement}
			</div>
			<button
				class="duel-detail-button"
				data-toggle="collapse"
				data-target=".duel-collapse-container"
			>
				<img
					src="image/duel-detail-button.svg"
					alt="back"
					style="width: 4rem, color:white"
				/>
			</button>
			<div class="duel-collapse-container">${collapseElement}</div>
		</div>
	`;
}

export { duelReportWrapper };
