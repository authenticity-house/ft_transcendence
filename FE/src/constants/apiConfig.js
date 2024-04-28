// http://127.0.0.1:8080/api/
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
		ROOMS_URL: `${ROOMS_URL}`,
		MY_INFO_URL: `${USERS_URL}user/`
	};
}

const apiEndpoints = getApiEndpoints();

export default apiEndpoints;
