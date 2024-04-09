const html = String.raw;

export function exitModal() {
	return html`
		<div
			class="modal fade"
			id="staticBackdrop"
			data-bs-backdrop="static"
			data-bs-keyboard="false"
			tabindex="-1"
			aria-labelledby="staticBackdropLabel"
			aria-hidden="true"
		>
			<div class="modal-dialog modal-dialog-centered">
				<div class="modal-content modal-content-style head_white_neon_15">
					<div class="modal-body">
						<div class="display-light28 modal-content-body-text">
							게임이 진행중입니다.<br />정말로 나가시겠습니까?
						</div>
						<div class="horizontal-button-container" style="gap:4rem">
							<button
								type="button"
								class="button-x-small-flex return-button"
								data-bs-dismiss="modal"
							>
								나가기
							</button>
							<button
								type="button"
								class="button-x-small-flex"
								data-bs-dismiss="modal"
							>
								취소
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	`;
}
