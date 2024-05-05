const html = String.raw;

function helpButton() {
	return html`
		<div class="help-button-container">
			<button
				type="button"
				class="help-button"
				data-bs-toggle="modal"
				data-bs-target="#help-modal"
			>
				<div class="help-button-img-container">
					<img src="image/question-mark.png" alt="help" class="help-img" />
				</div>
				<span class="help-button-title display-light18">게임 방법</span>
			</button>
		</div>
	`;
}

export default helpButton;
