const html = String.raw;

class HelpModal {
	template() {
		return html`
			<div
				class="modal fade"
				id="help-modal"
				tabindex="-1"
				aria-labelledby="help-modal"
				aria-hidden="true"
			>
				<div class="modal-dialog modal-dialog-centered">
					<div
						class="modal-content head_white_neon_15 display-light28 profile-modal-content"
					>
						<div class="modal-header help-modal-header">
							<h5 class="modal-title display-light24">도움말</h5>
							<button
								type="button"
								class="btn-close btn-close-white"
								data-bs-dismiss="modal"
								aria-label="Close"
							></button>
						</div>
						<div class="modal-body help-modal-body">
							<div class="help-modal-content">
								<img
									class="help-modal-image"
									src="image/in-game-screenshot.png"
									alt="in-game-screenshot"
								/>
								<div class="help-modal-text-container">
									<div class="help-modal-text">
										<span class="display-light28">player 1 조작법</span>
										<span class="display-light18">패들 이동: W, S</span>
										<span class="display-light18">파워 업: SPACE</span>
									</div>
									<div class="help-modal-text"></div>
									<div class="help-modal-text">
										<span class="display-light28">player 2 조작법</span>
										<span class="display-light18">패들 이동: ↑, ↓</span>
										<span class="display-light18">파워 업: ENTER</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		`;
	}
}

export const helpModal = new HelpModal();
