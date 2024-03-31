const html = String.raw;

export function profileModal() {
	return html`
		<div
			class="modal fade"
			id="profileModal"
			tabindex="-1"
			aria-labelledby="profileModalLabel"
			aria-hidden="true"
		>
			<div class="modal-dialog modal-dialog-centered">
				<div
					class="modal-content"
					style="
                        background-color: #1c1c1c;
                        color: white;
                        border: 1px solid #1c1c1c;
                    "
				>
					<div class="modal-header">
						<h1 class="modal-title fs-5" id="profileModalLabel">Modal title</h1>
						<button
							type="button"
							class="btn-close"
							data-bs-dismiss="modal"
							aria-label="Close"
						></button>
					</div>
					<div class="modal-body">이게 나야!!!!!!!!</div>
					<div class="modal-footer">
						<button
							type="button"
							class="btn btn-secondary"
							data-bs-dismiss="modal"
						>
							Close
						</button>
						<button type="button" class="btn btn-primary">Save changes</button>
					</div>
				</div>
			</div>
		</div>
	`;
}
