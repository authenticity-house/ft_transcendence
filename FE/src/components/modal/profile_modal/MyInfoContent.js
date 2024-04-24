const html = String.raw;

class MyInfoContent {
	template() {
		return html`
			<div class="my-info-content-container">
				<div class="my-info-content-left">
					<div class="my-info-content-image-name-container">
						<div class="my-info-content-image-container">
							<div class="my-info-content-image">
								<img
									class="my-info-user-profile-image"
									src="image/default-profile.png"
									alt="profile"
								/>
							</div>
							<div class="my-info-content-image-edit">
								<img class="edit-icon" src="image/edit.svg" alt="edit" />
							</div>
						</div>
						<div class="my-info-content-name">
							<span class="display-light28">이름</span>
							<img class="edit-icon" src="image/edit.svg" alt="edit" />
						</div>
					</div>
					<div class="my-info-content-id-password-container">
						<div class="my-info-content-id">
							<span class="display-light24">ID</span>
							<span class="display-light24">: ID</span>
						</div>
						<div class="my-info-content-password">
							<span class="display-light24">비밀번호</span>
							<button type="button" class="display-light24 head_blue_neon_15">
								변경
							</button>
						</div>
					</div>
				</div>
				<div class="my-info-content-right">
					<div class="my-info-stats-container display-light28">
						<div class="my-info-content-win-lose-container">
							<span>N전</span>
							<span>N승</span>
							<span>N패</span>
						</div>
						<div class="my-info-content-win-rate-container">
							<span>승률</span>
							<span>NN%</span>
						</div>
						<div class="my-info-content-rating-container">
							<span>레이팅</span>
							<span>NNN점</span>
						</div>
					</div>
				</div>
			</div>
		`;
	}
}

export const myInfoContent = new MyInfoContent();
