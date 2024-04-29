const html = String.raw;

class FriendInfoContent {
	template() {
		return html`
			<div class="friend-info-content-container">
				<div class="friend-info-content-left">
					<div class="friend-info-content-image-name-container">
						<div class="friend-info-content-image-container">
							<div class="friend-info-content-image"></div>
						</div>
						<div class="friend-info-content-name">
							<span class="display-light28">이름</span>
						</div>
					</div>
				</div>
				<div class="friend-info-content-right">
					<div class="friend-info-stats-container display-light28">
						<div class="friend-info-content-win-lose-container">
							<span>N전</span>
							<span>N승</span>
							<span>N패</span>
						</div>
						<div class="friend-info-content-win-rate-container">
							<span>승률</span>
							<span>NN%</span>
						</div>
						<div class="friend-info-content-rating-container">
							<span>레이팅</span>
							<span>NNN점</span>
						</div>
					</div>
				</div>
			</div>
		`;
	}

	mount(data) {
		const friendInfoContentImage = document.querySelector(
			'.friend-info-content-image'
		);
		const friendInfoContentName = document.querySelector(
			'.friend-info-content-name'
		);

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
		`;
	}
}

export const friendInfoContent = new FriendInfoContent();
