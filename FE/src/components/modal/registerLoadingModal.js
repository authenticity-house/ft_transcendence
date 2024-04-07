const html = String.raw;

export function registerLoadingModal() {
	return html`
		<div
			class="modal"
			id="registerLoadingModal"
			data-bs-backdrop="static"
			data-bs-keyboard="false"
			tabindex="-1"
			style="display:none"
		>
			<div class="modal-dialog modal-dialog-centered" style="height: 100%;">
				<div class="modal-content modal-content-style head_white_neon_15">
					<div class="modal-body">
						<div
							class="display-light28 modal-content-body-text"
							style="line-height:180%"
						>
							로딩중
						</div>
					</div>
				</div>
			</div>
		</div>
	`;
}
