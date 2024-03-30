// const html = String.raw;

// export class Header {
// 	constructor() {
// 		this.header = document.querySelector('.header');
// 	}

// 	template() {
// 		return html`
// 			<div class="header">
// 				<div class="header-logo">
// 					<a href="/">FE</a>
// 				</div>
// 				<div class="header-menu">
// 					<a href="/match">Match</a>
// 					<a href="/game">Game</a>
// 					<a href="/duelstats">DuelStats</a>
// 					<a href="/tournament">Tournament</a>
// 					<a href="/tournamentResult">TournamentResult</a>
// 					<a href="/onlineMainScreen">OnlineMainScreen</a>
// 				</div>
// 			</div>
// 		`;
// 	}

// 	addEventListeners() {
// 		const headerMenu = document.querySelector('.header-menu');
// 		headerMenu.addEventListener('click', (e) => {
// 			const { target } = e;
// 			if (target.tagName === 'A') {
// 				e.preventDefault();
// 				changeUrl(target.getAttribute('href'));
// 			}
// 		});
// 	}
// }
