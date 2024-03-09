import LoginPage from './pages/LoginPage.js';

// Shows loading message for 2 seconds
const loadingContainer = document.querySelector('.loading-container');

setTimeout(() => {
	loadingContainer.classList.add('hidden');
}, 1500);

const root = document.querySelector('#root');

const routes = {
	'/login': LoginPage
};

root.innerHTML = routes['/login'].template();

export const changeUrl = (url) => {
	history.pushState(null, null, url);
	root.innerHTML = routes[url].template();
};
