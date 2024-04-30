const html = String.raw;

export function registerSimilarModal() {
	return html`
		<div
			class="modal fade"
			id="registerSimilarModal"
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
						>
							비밀번호가 아이디와 유사합니다.<br />다시 작성해주세요.
						</div>
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
