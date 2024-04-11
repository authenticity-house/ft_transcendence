const html = String.raw;

function getRoomElementAll(roomList) {
	let allRoom = '';
	roomList.forEach((room) => {
		const color =
			room.battle_mode === 2
				? ['head_pink_neon_15', 'pink_neon_10']
				: ['head_blue_neon_15', 'blue_neon_10'];
		const battleMode = room.battle_mode === 2 ? '토너먼트' : '1 vs 1';

		const singleRoom = html`
			<button class="single-room-button ${color[0]}">
				<div class="single-room-match-mode">
					<span class="${color[1]} display-light18">${battleMode}</span>
				</div>
				<div class="single-room-title">
					<p class="display-light16">${room.room_name}</p>
				</div>
				<div class="single-room-bottom display-light16">
					<span>레이팅: ${room.rating}점</span>
					<div class="single-room-people">
						<span>${room.current_headcount} / ${room.max_headcount}</span>
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
						style="animation: none"
					/>
				</button>
			</div>
			<div class="room-list-container">${allRoom}</div>
		</div>
	`;
}

export { roomListWindow, getRoomElementAll };
