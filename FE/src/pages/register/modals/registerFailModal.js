const html = String.raw;

export function registerFailModal() {
	return html`
		<div
			class="modal fade"
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
							class="display-light24"
							id="register-fail-modal"
							style="line-height:180%; text-align: center; margin: 2rem;"
						>
							회원가입에 실패했습니다.<br />다시 시도해주세요.
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
