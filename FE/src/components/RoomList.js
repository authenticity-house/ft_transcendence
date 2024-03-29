const html = String.raw;

function roomListWindow() {
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
			<div class="room-list-container"></div>
		</div>
	`;
}

export { roomListWindow };
