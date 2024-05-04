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
								<div class="help-modal-content-title">
									<span class="display-light20">게임 방법</span>
								</div>
								<div class="help-modal-content-description">
									<span class="display-light18">1. 게임 시작</span>
									<span class="display-light18">2. 게임 진행</span>
									<span class="display-light18">3. 게임 종료</span>
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
