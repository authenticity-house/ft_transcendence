const html = String.raw;

class MyInfoContent {
	template() {
		return html`
			<div class="my-info-content-container">
				<div class="my-info-content-left">
					<div class="my-info-content-image-name-container">
						<div class="my-info-content-image-container">
							<div class="my-info-content-image"></div>
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
		const myInfoContentImage = document.querySelector('.my-info-content-image');
		const myInfoContentName = document.querySelector('.my-info-content-name');
		const myInfoContentIdPasswordContainer = document.querySelector(
			'.my-info-content-id-password-container'
		);

		if (data.profile_url !== '/profile/default.png') {
			myInfoContentImage.innerHTML = `
				<img
					class="my-info-user-profile-image"
					src="${data.profile_url}"
					alt="profile"
				/>
			`;
		} else {
			myInfoContentImage.innerHTML = `
				<img
					class="my-info-user-profile-image"
					src="image/default-profile.png"
					alt="profile"
				/>
			`;
		}

		myInfoContentName.innerHTML = `
			<span class="display-light28">${data.nickname}</span>
			<img class="edit-icon" src="image/edit.svg" alt="edit" />
		`;

		if (data.provider === 'PONG') {
			const myInfoContentId = document.querySelector('.my-info-content-id');
			const myInfoContentPassword = document.querySelector(
				'.my-info-content-password'
			);

			myInfoContentId.innerHTML = `
				<span class="display-light24">ID</span>
				<span class="display-light24">${data.username}</span>
			`;

			myInfoContentPassword.innerHTML = `
				<span class="display-light24">비밀번호</span>
				<button type="button" class="display-light24 head_blue_neon_15">
					변경
				</button>
			`;

			myInfoContentIdPasswordContainer.appendChild(myInfoContentId);
			myInfoContentIdPasswordContainer.appendChild(myInfoContentPassword);
		}
	}

	mountStats(data) {
		const myInfoContentWinLoseContainer = document.querySelector(
			'.my-info-content-win-lose-container'
		);
		const myInfoContentWinRateContainer = document.querySelector(
			'.my-info-content-win-rate-container'
		);
		const myInfoContentRatingContainer = document.querySelector(
			'.my-info-content-rating-container'
		);

		myInfoContentWinLoseContainer.innerHTML = `
			<span>${data.total_count}전</span>
			<span>${data.wins_count}승</span>
			<span>${data.losses_count}패</span>
		`;

		myInfoContentWinRateContainer.innerHTML = `
			<span>승률</span>
			<span>${data.winning_rate}%</span>
		`;

		myInfoContentRatingContainer.innerHTML = `
			<span>레이팅</span>
			<span>${data.rating}점</span>
		`;
	}
}

export const myInfoContent = new MyInfoContent();
