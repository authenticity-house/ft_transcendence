class TournamentBracket {
	template() {
		const html = String.raw;
		/* MOCK DATA */
		const userNickname = [
			'player1',
			'player2',
			'player3',
			'player4',
			'player5',
			'player6',
			'player7'
			// 'player8'
		];
		const playerCount = userNickname.length;
		let userWrappers = '';
		for (let i = 0; i < userNickname.length; i += 1) {
			userWrappers += `<div class="user-wrapper head_blue_neon_15"><p>${userNickname[i]}</p></div>`;
		}

		if (playerCount <= 4) {
			return html`
				<div class="tournament-bracket">
					<div class="user-container">${userWrappers}</div>
					<div class="wire-container"></div>
					<div class="user-container"></div>
					<div class="wire-container"></div>
					<div class="user-container"></div>
				</div>
			`;
		}
		return html`
			<div class="tournament-bracket">
				<div class="user-container">${userWrappers}</div>
				<div class="wire-container"></div>
				<div class="user-container"></div>
				<div class="wire-container"></div>
				<div class="user-container"></div>
				<div class="wire-container"></div>
				<div class="user-container"></div>
			</div>
		`;
	}
}

export default TournamentBracket;
