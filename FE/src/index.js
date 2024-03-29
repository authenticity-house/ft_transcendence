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
import TournamentResultPage from './pages/TournamentResultPage.js';

// Shows loading message for 2 seconds
const loadingContainer = document.querySelector('.loading-container');

setTimeout(() => {
	loadingContainer.classList.add('hidden');
}, 1500);

// --------------------------------------------------------------------------------------------- //
// root is the root element of the website
const root = document.querySelector('#root');

// homeLink is the root path of the website
const homeLink = '/';

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
	tournament: TournamentPage,
	tournamentResult: TournamentResultPage
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
	// 링크가 변경되기 전에 유효하지 않은 요청인지 확인
	const url = window.location.href.split('/').pop();
	if (
		url === 'game' ||
		url === 'duelstats' ||
		url === 'tournament' ||
		url === 'tournamentResult'
	) {
		alert('유효하지 않은 요청입니다.');
		changeUrl('');
	} else {
		root.innerHTML = routes[url].template();
		routes[url].addEventListeners();
	}
};

// 새로 고침 시 홈페이지로 주소 변경
window.onload = () => {
	history.pushState(null, null, homeLink);
};
