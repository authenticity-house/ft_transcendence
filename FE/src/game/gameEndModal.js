const html = String.raw;

export function gameEndModal() {
	return html`
		<div
			class="modal fade"
			id="gameEndModal"
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
							id="game-end-modal-text"
						>
							연결이 종료되었습니다.<br />다른 방에 참가해주세요.
						</div>
						<div class="horizontal-button-container" style="gap:4rem">
							<button
								type="button"
								class="button-x-small-flex"
								id="back-list-button"
								data-bs-dismiss="modal"
							>
								돌아가기
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	`;
}
