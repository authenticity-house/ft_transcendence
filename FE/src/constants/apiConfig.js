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
	const STATS_URL = `${BASE_URL}stats/`;

	return {
		LOGIN_URL: `${USERS_URL}login/`,
		LOGOUT_URL: `${USERS_URL}logout/`,

		LOGIN_CHECK_URL: `${USERS_URL}check-login/`,
		REGISTRATION_URL: `${USERS_URL}registration/`,
		REGISTER_CHECK_URL: `${USERS_URL}check/?`,

		MY_INFO_URL: `${USERS_URL}user/`,
		UPDATE_USER_URL: `${USERS_URL}update/`,
		UPLOAD_IMAGE_URL: `${USERS_URL}upload-image/`,
		SEARCH_USER_URL: `${USERS_URL}search/?prefix=`,

		FRIEND_PROFILE_URL: `${USERS_URL}detail/`,
		MY_FRIEND_URL: `${USERS_URL}friends/`,
		MY_FRIEND_REQUEST_SENT_URL: `${USERS_URL}friends/sent/`,
		MY_FRIEND_REQUEST_RECEIVED_URL: `${USERS_URL}friends/received/`,

		ROOMS_URL: `${ROOMS_URL}`,

		MATCH_RECORD_URL: `${STATS_URL}match/list/`,
		STATS_SUMMARY_URL: `${STATS_URL}summary/`,
		MY_STATS_URL: `${STATS_URL}`
	};
}

const apiEndpoints = getApiEndpoints();

export default apiEndpoints;
