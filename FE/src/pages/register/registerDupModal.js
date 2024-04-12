const html = String.raw;

export function registerDupModal() {
	return html`
		<div
			class="modal fade"
			id="registerDupModal"
			data-bs-backdrop="static"
			data-bs-keyboard="false"
			tabindex="-1"
			style="display:none"
		>
			<div class="modal-dialog modal-dialog-centered" style="height: 100%;">
				<div class="modal-content modal-content-style head_white_neon_15">
					<div class="modal-body">
						<div
							class="display-light24 modal-content-body-text"
							style="line-height:180%"
							id="add-modal-text"
						></div>
						<div class="horizontal-button-container" style="gap:4rem">
							<button
								type="button"
								class="button-x-small-flex"
								data-bs-dismiss="modal"
							>
								확인
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	`;
}
