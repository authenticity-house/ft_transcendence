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
import { hideModal } from './components/modal/modalUtils.js';
import { browserInfo } from './utils/browserInfo.js';

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

// 페이지 로드
history.pushState(null, null, 'loginBlock'); // 로그인페이지에서 뒤로가기 막기
history.pushState(null, null, `${homeLink}`);
urlState = '';
root.innerHTML = routes[''].template();
routes[''].mount();
routes[''].addEventListeners();

export const changeUrlInstance = (url, instance) => {
	history.pushState(null, null, `${homeLink}gameBlock`);
	if (url !== window.location.href.split('/').pop()) {
		history.pushState(null, null, `${homeLink}${url}`);
		urlState = `${url}`;
	}
	root.innerHTML = instance.template();
	instance.addEventListeners();
};

export const changeUrl = (url) => {
	if (url !== window.location.href.split('/').pop()) {
		history.pushState(null, null, `${homeLink}${url}`);
		urlState = `${url}`;
	}
	root.innerHTML = routes[url].template();
	if (typeof routes[url].mount === 'function') routes[url].mount();
	routes[url].addEventListeners();
};

export const changeUrlData = (url, data, historyState = true) => {
	if (historyState) {
		if (url === 'gameSettingTournament') {
			history.pushState(null, null, `${homeLink}gameSetting`); // url만 gameSetting으로
			urlState = 'gameSetting';
		} else {
			history.pushState(null, null, `${homeLink}${url}`);
			urlState = `${url}`;
		}
	}
	if (url === 'tournament') {
		history.pushState(null, null, `${homeLink}gameBlock`);
		history.pushState(null, null, `${homeLink}game`); // url만 gameSetting으로
		urlState = 'game';
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
	// 모달창 열려 있을 시, 닫고 진행
	hideModal('profile-modal');
	// 방 대기실에서 뒤로가기 눌렀을 시, 방 웹소켓 연결 끊기
	if (urlState === 'waitingRoom') {
		gamewsmanager.unregister();
	}

	const url = window.location.href.split('/').pop();
	switch (url) {
		case 'waitingRoom':
			browserInfo('방 목록에서 방을 참가해주세요.');
			history.back();
			break;

		case 'gameBlock':
			if (urlState === 'game') {
				browserInfo('게임 중에는 이동이 불가합니다.');
			} else {
				browserInfo('종료된 게임으로 이동이 불가합니다.');
			}
			history.forward();
			break;

		case 'loginBlock':
			browserInfo('로그인 페이지 전으로는 이동이 불가합니다.');
			history.forward();
			break;

		case 'game':
			urlState = `${url}`;
			break;

		default:
			// url page 띄우기
			urlState = `${url}`;
			root.innerHTML = routes[url].template();
			if (typeof routes[url].mount === 'function') {
				routes[url].mount();
			}
			routes[url].addEventListeners();
			break;
	}
});
