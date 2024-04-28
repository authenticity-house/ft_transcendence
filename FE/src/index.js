import LoginPage from './pages/LoginPage.js';
import PlayModePage from './pages/PlayModePage.js';
import GamePage from './game/GamePage.js';
import RegisterPage from './pages/register/RegisterPage.js';
import GameSettingPage from './pages/local/gameSetting/GameSettingPage.js';
import GameSettingTournament from './pages/local/gameSetting/GameSettingTournament.js';
import GameSettingDetailed from './pages/local/gameSetting/GameSettingDetailed.js';
import MatchModePage from './pages/MatchModePage.js';
import DuelStatsPage from './pages/local/DuelStatsPage.js';
import TournamentPage from './pages/local/TournamentPage.js';
import TournamentResultPage from './pages/local/TournamentResultPage.js';
import OnlineMainScreenPage from './pages/online/OnlineMainScreenPage.js';
import OnlineGameSettingPage from './pages/online/gameSetting/OnlineGameSettingPage.js';
import OnlineGameSettingDetailed from './pages/online/gameSetting/OnlineGameSettingDetailed.js';
import OnlineGameSettingTournament from './pages/online/gameSetting/OnlineGameSettingTournament.js';
import WaitingRoomPage from './pages/online/rooms/waitingRoom/WaitingRoomPage.js';
import { GamewebsocketManager } from './game/GamewebsocketManager.js';
import {
	headerAddEventListeners,
	profileButton
} from './components/ProfileButton.js';
import { profileModal } from './components/modal/profile_modal/ProfileModal.js';
import apiEndpoints from './constants/apiConfig.js';

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
	playMode: PlayModePage,
	matchMode: MatchModePage,
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

let urlState;

// Page Load - Login Check
fetch(apiEndpoints.LOGIN_CHECK_URL, { method: 'GET' }).then((res) => {
	if (res.status === 200) {
		// 로그인 되어 있으면, PlayModePage
		history.pushState(null, null, `${homeLink}play`);
		urlState = `${homeLink}play`;
		console.log(urlState);
		root.innerHTML = routes.play.template();
		routes.play.mount();
		routes.play.addEventListeners();
	} else {
		// 로그인 안되어 있을 시, LoginPage
		history.pushState(null, null, `${homeLink}`);
		urlState = `${homeLink}`;
		console.log(urlState);

		root.innerHTML = routes[''].template();
		routes[''].mount();
		routes[''].addEventListeners();
	}
});

export const changeUrlInstance = (url, instance) => {
	history.pushState(null, null, `${homeLink}gameBlock`);
	if (url !== window.location.href.split('/').pop()) {
		history.pushState(null, null, `${homeLink}${url}`);
		urlState = `${homeLink}${url}`;
		console.log(urlState);
	}
	root.innerHTML = instance.template();
	instance.addEventListeners();
};

export const changeUrl = (url) => {
	if (url !== window.location.href.split('/').pop()) {
		history.pushState(null, null, `${homeLink}${url}`);
		urlState = `${homeLink}${url}`;
		console.log(urlState);
	}
	root.innerHTML = routes[url].template();
	if (typeof routes[url].mount === 'function') routes[url].mount();
	routes[url].addEventListeners();
};

export const changeUrlData = (url, data, historyState) => {
	if (historyState !== 'notHistory') {
		if (url === 'gameSettingTournament') {
			history.pushState(null, null, `${homeLink}gameSetting`); // url만 gameSetting으로
			urlState = `${homeLink}gameSetting`;
			console.log(urlState);
		} else {
			history.pushState(null, null, `${homeLink}${url}`);
			urlState = `${homeLink}${url}`;
			console.log(urlState);
		}
	}
	root.innerHTML = routes[url].template(data);
	if (typeof routes[url].mount === 'function') routes[url].mount(data);
	routes[url].addEventListeners();
};

export const gamewsmanager = new GamewebsocketManager();

// When the user clicks the logo, the page is changed
const logo = document.querySelector('#logo');
logo.addEventListener('click', () => {
	gamewsmanager.unregister();
	const url = window.location.href.split('/').pop();
	if (url === 'game') {
		history.pushState(null, null, 'gameBlock');
	}
	window.location.reload(true);
});

// When the user presses the back or forward button, the page is changed
window.addEventListener('popstate', () => {
	const url = window.location.href.split('/').pop();
	if (url === 'gameBlock') {
		// 뒤로가기, 앞으로가기 눌러서 이동하면 안되는 페이지가 나옴 -> urlState로 다시 이동
		history.forward();
	} else if (url === 'game') {
		urlState = `${homeLink}${url}`;
	} else {
		// url page 띄우기
		urlState = `${homeLink}${url}`;
		console.log(urlState);

		root.innerHTML = routes[url].template();
		if (typeof routes[url].mount === 'function') routes[url].mount();
		routes[url].addEventListeners();
	}
});
