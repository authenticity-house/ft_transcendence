const html = String.raw;

function getRoomElementAll(roomList) {
	let allRoom = '';
	roomList.forEach((room) => {
		const color =
			room.matchMode === 'tournament'
				? ['head_pink_neon_15', 'pink_neon_10']
				: ['head_blue_neon_15', 'blue_neon_10'];

		const singleRoom = html`
			<button class="single-room-button ${color[0]}">
				<div class="single-room-match-mode">
					<span class="${color[1]} display-light18">${room.matchMode}</span>
				</div>
				<div class="single-room-title">
					<p class="display-light16">${room.roomTitle}</p>
				</div>
				<div class="single-room-bottom display-light16">
					<span>레이팅: ${room.rating}점대</span>
					<div class="single-room-people">
						<span>${room.peopleNow} / ${room.peopleMax}</span>
					</div>
				</div>
			</button>
		`;
		allRoom += singleRoom;
	});
	return allRoom;
}

function roomListWindow(roomList) {
	const allRoom = getRoomElementAll(roomList);
	return html`
		<div class="room-list-window">
			<div class="room-list-header">
				<p class="display-medium48 yellow_neon_10">방 목록</p>
				<button class="room-list-refresh-button">
					<img
						src="image/refresh.png"
						alt="refresh"
						class="room-list-refresh-img"
					/>
				</button>
			</div>
			<div class="room-list-container">${allRoom}</div>
		</div>
	`;
}

export { roomListWindow, getRoomElementAll };
