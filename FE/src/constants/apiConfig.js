function getApiBaseUrl() {
	const { protocol, hostname, port } = window.location;
	const apiPort = port ? `:${port}` : '';
	return `${protocol}//${hostname}${apiPort}/api/`;
}

function getApiEndpoints() {
	const BASE_URL = getApiBaseUrl();
	const USERS_URL = `${BASE_URL}users/`;
	const ROOMS_URL = `${BASE_URL}rooms/`;

	return {
		LOGIN_URL: `${USERS_URL}login/`,
		LOGIN_CHECK_URL: `${USERS_URL}check-login/`,
		REGISTRATION_URL: `${USERS_URL}registration/`,
		LOGOUT_URL: `${USERS_URL}logout/`,
		REGISTER_CHECK_URL: `${USERS_URL}check/?`,
		ROOMS_URL: `${ROOMS_URL}`
	};
}

const apiEndpoints = getApiEndpoints();

export default apiEndpoints;
