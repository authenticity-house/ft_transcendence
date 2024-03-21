import LoginPage from './pages/LoginPage.js';
import PlayModePage from './pages/PlayModePage.js';
import GamePage from './pages/GamePage.js';
import RegisterPage from './pages/RegisterPage.js';
import RegisterNicknamePage from './pages/RegisterNicknamePage.js';

import GameSettingPage from './pages/GameSettingPage.js';
import GameSettingTournament from './pages/GameSettingTournament.js';
import GameSettingDetailed from './pages/GameSettingDetailed.js';
import MatchModePage from './pages/MatchModePage.js';
import DuelStatsPage from './pages/DuelStatsPage.js';
import TournamentPage from './pages/TournamentPage.js';

// Shows loading message for 2 seconds
const loadingContainer = document.querySelector('.loading-container');

setTimeout(() => {
	loadingContainer.classList.add('hidden');
}, 1500);

// --------------------------------------------------------------------------------------------- //
// root is the root element of the website
const root = document.querySelector('#root');

// homeLink is the root path of the website
const homeLink = '/FE/public/';

// routes object is used to change the page
const routes = {
	'': LoginPage,
	register: RegisterPage,
	registerNickname: RegisterNicknamePage,
	gameSetting: GameSettingPage,
	gameSettingTournament: GameSettingTournament,
	gameSettingDetailed: GameSettingDetailed,
	play: PlayModePage,
	match: MatchModePage,
	game: GamePage,
	duelstats: DuelStatsPage,
	tournament: TournamentPage
};

// When the page is loaded, the root element is filled with the template of the current page
root.innerHTML = routes[''].template();
routes[''].addEventListeners();

// When the user presses the back or forward button, the page is changed
export const changeUrl = (url) => {
	history.pushState(null, null, `${homeLink}${url}`);
	root.innerHTML = routes[url].template();
	if (typeof routes[url].mount === 'function') {
		routes[url].mount();
	}
	routes[url].addEventListeners();
};

export const changeUrlData = (url, data) => {
	history.pushState(null, null, `${homeLink}${url}`);
	root.innerHTML = routes[url].template(data);
	if (typeof routes[url].mount === 'function') {
		routes[url].mount(data);
	}
	routes[url].addEventListeners();
};

// When the user presses the back or forward button, the page is changed
window.onpopstate = () => {
	const url = window.location.href.split('/').pop();
	root.innerHTML = routes[url].template();
	routes[url].addEventListeners();
};
