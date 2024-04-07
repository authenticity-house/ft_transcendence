const html = String.raw;

export function registerFailModal() {
	return html`
		<div
			class="modal"
			id="registerFailModal"
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
							회원가입 실패
						</div>
						<div class="horizontal-button-container" style="gap:4rem">
							<button
								type="button"
								class="button-x-small-flex"
								id="back-home-button"
								data-bs-dismiss="modal"
							>
								홈으로 돌아가기
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	`;
}
