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
									class="user-profile-img"
									src="image/default-profile.png"
									alt="profile"
								/>
							</div>
							<div class="my-info-content-image-edit">
								<img class="edit-icon" src="image/edit.svg" alt="edit" />
							</div>
						</div>
						<div class="my-info-content-name">
							<span class="display-medium24">이름</span>
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
							<button type="button" class="display-light24">변경</button>
						</div>
					</div>
				</div>
				<div class="my-info-content-right">
					<div class="my-info-stats-container">
						<div class="my-info-content-win-lose-container">
							<span class="display-light24">N전</span>
							<span class="display-light24">N승</span>
							<span class="display-light24">N패</span>
						</div>
						<div class="my-info-content-win-rate-container">
							<span class="display-light24">승률</span>
							<span class="display-light24">NN%</span>
						</div>
						<div class="my-info-content-rating-container">
							<span class="display-light24">레이팅</span>
							<span class="display-light24">NNN점</span>
						</div>
					</div>
				</div>
			</div>
		`;
	}
}

export const myInfoContent = new MyInfoContent();
