const html = String.raw;

function getUserSeatBox(maxPlayer) {
	const blockIndex = maxPlayer;
	const userSeatContainer = document.createElement('div');
	userSeatContainer.className = 'waiting-room-users-container';
	for (let i = 0; i < 8; i += 1) {
		const userSeatBox = document.createElement('div');
		userSeatBox.className = 'user-seat-box head_white_neon_10 display-light18';
		if (i >= blockIndex) {
			const blockContainer = document.createElement('div');
			blockContainer.className = 'user-seat-box-block-container';
			const blockImage = document.createElement('img');
			blockImage.src = 'image/block.svg';
			blockImage.alt = 'block';
			blockImage.className = 'user-seat-box-img';
			blockContainer.appendChild(blockImage);
			userSeatBox.appendChild(blockContainer);
		}
		userSeatContainer.appendChild(userSeatBox);
	}
	return userSeatContainer;
}

function getUserProfileBox(userSeatElement, userInfo) {
	const userSeatBoxAll = userSeatElement.querySelectorAll('.user-seat-box');

	userSeatBoxAll.forEach((seatBox, index) => {
		const user = userInfo[index];
		if (userInfo[index]) {
			const userImage = user.image || 'image/default-profile.png';
			let readyStateString = '방장';
			let readyStateColor = 'head_yellow_neon_15 yellow_neon_10';
			if (user.host === false) {
				readyStateString = user.readyState ? '준비완료' : '대기 중';
				readyStateColor = user.readyState
					? 'head_pink_neon_15 pink_neon_10'
					: 'head_blue_neon_15 blue_neon_10';
			}

			const htmlString = html`
				<div class="user-seat-box-img-container">
					<img src="${userImage}" alt="user" class="user-seat-box-img" />
				</div>
				<span>${user.nickName}</span>
				<span>레이팅: ${user.rating}</span>
				<div class="user-seat-box-ready-state ${readyStateColor}">
					<span>${readyStateString}</span>
				</div>
			`;

			const fragment = document
				.createRange()
				.createContextualFragment(htmlString);
			seatBox.appendChild(fragment);
		}
	});
}

export { getUserSeatBox, getUserProfileBox };
