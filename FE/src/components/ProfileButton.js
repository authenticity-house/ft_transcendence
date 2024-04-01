const html = String.raw;

// 추후 유저 프로필 이미지 인자로 받아오기
function profileButton(image) {
	const profileImage = image || 'image/default-profile.png';
	return html`
		<div class="profile-button-container">
			<button class="info-modal-button">
				<img src="image/my-friend.svg" alt="friend" class="info-modal-img" />
				<span class="display-light24">내 친구</span>
			</button>
			<button class="info-modal-button">
				<img src="image/search.svg" alt="search" class="info-modal-img" />
				<span class="display-light24">유저 검색</span>
			</button>
			<button class="info-modal-button">
				<img src="image/match-record.svg" alt="record" class="info-modal-img" />
				<span class="display-light24">경기 기록</span>
			</button>
			<button class="info-modal-button">
				<img src="image/statistics.svg" alt="stats" class="info-modal-img" />
				<span class="display-light24">통계</span>
			</button>
			<button
				type="button"
				data-bs-toggle="modal"
				data-bs-target="#profile-modal"
				class="user-profile-button"
			>
				<img src="${profileImage}" alt="user" class="user-profile-img" />
			</button>
		</div>
	`;
}

export { profileButton };
