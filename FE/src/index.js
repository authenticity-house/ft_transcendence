import LoginPage from './pages/LoginPage.js';
import PlayModePage from './pages/PlayModePage.js';
import GamePage from './pages/GamePage.js';
import RegisterPage from './pages/RegisterPage.js';

import GameSettingPage from './pages/GameSettingPage.js';
import GameSettingTournament from './pages/GameSettingTournament.js';
import GameSettingDetailed from './pages/GameSettingDetailed.js';
import MatchModePage from './pages/MatchModePage.js';
import DuelStatsPage from './pages/DuelStatsPage.js';
import TournamentPage from './pages/TournamentPage.js';
import TournamentResultPage from './pages/TournamentResultPage.js';

import OnlineMainScreenPage from './pages/OnlineMainScreenPage.js';

import OnlineGameSettingPage from './pages/online/OnlineGameSettingPage.js';
import OnlineGameSettingDetailed from './pages/online/OnlineGameSettingDetailed.js';
import OnlineGameSettingTournament from './pages/online/OnlineGameSettingTournament.js';

import WaitingRoomPage from './pages/WaitingRoomPage.js';

import { GamewebsocketManager } from './websocket/GamewebsocketManager.js';
import {
	headerAddEventListeners,
	profileButton
} from './components/ProfileButton.js';
import { profileModal } from './components/modal/profileModal.js';

const html = String.raw;

// Shows loading message for 2 seconds
const loadingContainer = document.querySelector('.loading-container');

setTimeout(() => {
	loadingContainer.classList.add('hidden');
}, 1500);

// header에 프로필 버튼 추가
const profileButtonComponent = profileButton();

const header = document.querySelector('header');
header.innerHTML = html`
	<img id="logo" src="./image/logo.svg" alt="logo" style="width: 48rem" />
	${profileButtonComponent} ${profileModal.template()}
`;

profileModal.addEventListeners();
headerAddEventListeners();

// --------------------------------------------------------------------------------------------- //
// root is the root element of the website
const root = document.querySelector('#root');

// homeLink is the root path of the website
const homeLink = '/';

// routes object is used to change the page
const routes = {
	'': LoginPage,
	register: RegisterPage,
	gameSetting: GameSettingPage,
	gameSettingTournament: GameSettingTournament,
	gameSettingDetailed: GameSettingDetailed,
	play: PlayModePage,
	match: MatchModePage,
	game: GamePage,
	duelstats: DuelStatsPage,
	tournament: TournamentPage,
	tournamentResult: TournamentResultPage,
	onlineMainScreen: OnlineMainScreenPage,
	onlineSetting: OnlineGameSettingPage,
	onlineSettingTournament: OnlineGameSettingTournament,
	onlineDetailed: OnlineGameSettingDetailed,
	waitingRoom: WaitingRoomPage
};

// When the page is loaded, the root element is filled with the template of the current page
root.innerHTML = routes[''].template();
routes[''].addEventListeners();

export const changeUrlInstance = (url, instance) => {
	if (url !== window.location.href.split('/').pop()) {
		history.pushState(null, null, `${homeLink}${url}`);
		root.innerHTML = instance.template();
		instance.addEventListeners();
	}
};

// When the user presses the back or forward button, the page is changed
export const changeUrl = (url) => {
	if (url !== window.location.href.split('/').pop()) {
		history.pushState(null, null, `${homeLink}${url}`);
		root.innerHTML = routes[url].template();
		if (typeof routes[url].mount === 'function') {
			routes[url].mount();
		}
		routes[url].addEventListeners();
	}
};

export const changeUrlData = (url, data) => {
	if (url !== window.location.href.split('/').pop()) {
		history.pushState(null, null, `${homeLink}${url}`);
		root.innerHTML = routes[url].template(data);
		if (typeof routes[url].mount === 'function') {
			routes[url].mount(data);
		}
		routes[url].addEventListeners();
	}
};

export const gamewsmanager = new GamewebsocketManager();

// When the user clicks the logo, the page is changed
const logo = document.querySelector('#logo');
logo.addEventListener('click', () => {
	gamewsmanager.unregister();
	changeUrl('');
});

// When the user presses the back or forward button, the page is changed
window.onpopstate = () => {
	// 링크가 변경되기 전에 유효하지 않은 요청인지 확인
	gamewsmanager.unregister();
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
