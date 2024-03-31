const html = String.raw;

function profileWindow(profileData) {
	const profileImage = profileData.image || 'image/default-profile.png';
	const record = profileData.winLossRecord;
	return html`
		<div class="user-profile-container">
			<div class="user-profile-wrapper">
				<img src="${profileImage}" alt="user" class="user-profile-img" />
			</div>
			<span class="display-medium48 yellow_neon_10">
				${profileData.nickName}
			</span>
			<div class="user-profile-summary display-light24">
				<span>${record[0]}전 ${record[1]}승 ${record[2]}패</span>
				<span>승률 ${profileData.winRate}%</span>
				<span>레이팅 ${profileData.rating}점</span>
			</div>
			<button class="create-room-button head_blue_neon_15">
				<span class="display-light24 blue_neon_10">방만들기</span>
			</button>
		</div>
	`;
}

export { profileWindow };
