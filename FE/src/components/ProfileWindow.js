const html = String.raw;

function profileWindow() {
	return html`
		<div class="user-profile-container">
			<div class="user-profile-wrapper"></div>
			<span class="display-medium48 yellow_neon_10">종식</span>
			<div class="user-profile-summary"></div>
			<button class="create-room-button head_blue_neon_15">
				<span class="display-light24 blue_neon_10">방만들기</span>
			</button>
		</div>
	`;
}

export { profileWindow };
