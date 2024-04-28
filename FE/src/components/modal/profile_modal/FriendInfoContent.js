const html = String.raw;

class FriendInfoContent {
	template() {
		return html`
			<div class="my-info-content-container">
				<div class="my-info-content-left">
					<div class="my-info-content-image-name-container">
						<div class="my-info-content-image-container">
							<div class="my-info-content-image friend-image"></div>
							<div class="my-info-content-image-edit">
								<img class="edit-icon" src="image/edit.svg" alt="edit" />
							</div>
						</div>
						<div class="my-info-content-name friend-name">
							<span class="display-light28">이름</span>
							<img class="edit-icon" src="image/edit.svg" alt="edit" />
						</div>
					</div>
					<div class="my-info-content-id-password-container">
						<div class="my-info-content-id"></div>
						<div class="my-info-content-password"></div>
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

	mount(data) {
		const friendInfoContentImage = document.querySelector('.friend-image');
		const friendInfoContentName = document.querySelector('.friend-name');

		console.log('data: ', data);
		if (data.profile_url !== '/profile/default.png') {
			friendInfoContentImage.innerHTML = `
				<img
					class="my-info-user-profile-image"
					src="${data.profile_url}"
					alt="profile"
				/>
			`;
		} else {
			friendInfoContentImage.innerHTML = `
				<img
					class="my-info-user-profile-image"
					src="image/default-profile.png"
					alt="profile"
				/>
			`;
		}

		friendInfoContentName.innerHTML = `
			<span class="display-light28">${data.nickname}</span>
			<img class="edit-icon" src="image/edit.svg" alt="edit" />
		`;
	}
}

export const friendInfoContent = new FriendInfoContent();
