import LoginPage from './pages/LoginPage.js';
import GuestPage from './pages/GuestPage.js';
import GamePage from './pages/GamePage.js';
import RegisterPage from './pages/RegisterPage.js';
import RegisterNicknamePage from './pages/RegisterNicknamePage.js';

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
	guest: GuestPage,
	game: GamePage,
	register: RegisterPage,
	registerNickname: RegisterNicknamePage
};

// When the page is loaded, the root element is filled with the template of the current page
root.innerHTML = routes[''].template();
routes[''].addEventListeners();

// When the user presses the back or forward button, the page is changed
export const changeUrl = (url) => {
	history.pushState(null, null, `${homeLink}${url}`);
	root.innerHTML = routes[url].template();
	routes[url].addEventListeners();
};

// When the user presses the back or forward button, the page is changed
window.onpopstate = () => {
	const url = window.location.href.split('/').pop();
	root.innerHTML = routes[url].template();
	routes[url].addEventListeners();
};