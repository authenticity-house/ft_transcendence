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
		LOGIN_CHECK_URL: `${USERS_URL}check-login/`,
		REGISTRATION_URL: `${USERS_URL}registration/`,
		LOGOUT_URL: `${USERS_URL}logout/`,
		REGISTER_CHECK_URL: `${USERS_URL}check/?`,
		ROOMS_URL: `${ROOMS_URL}`,
		MY_INFO_URL: `${USERS_URL}user/`,
		SEARCH_USER_URL: `${USERS_URL}search/?prefix=`,
		FRIEND_PROFILE_URL: `${USERS_URL}detail/`,
		MY_FRIEND_URL: `${USERS_URL}friends/`,
		MY_FRIEND_REQUEST_SENT_URL: `${USERS_URL}friends/sent/`,
		MY_FRIEND_REQUEST_RECEIVED_URL: `${USERS_URL}friends/received/`,
		MATCH_RECORD_URL: `${STATS_URL}match/list/`
	};
}

const apiEndpoints = getApiEndpoints();

export default apiEndpoints;

// 	{
// 		"player1": {
// 			"pk": 1,
// 			"nickname": "joyoo",
// 			"profile_url": "https://cdn.intra.42.fr/users/25ec24c4d02e655452e0778874ef8d4e/joyoo.jpg"
// 		},
// 		"player2": {
// 			"pk": 2,
// 			"nickname": "asdf",
// 			"profile_url": "/profile/default.png"
// 		},
// 		"data": {
// 			"date": "2024-04-30",
// 			"graph": {
// 				"player1": {
// 					"score_pos": [],
// 					"score_trend": [0, 0, 0, 0, 0, 0]
// 				},
// 				"player2": {
// 					"score_pos": [
// 						[-2.982, 1.845],
// 						[-2.968, 0.823],
// 						[-2.977, 0.934],
// 						[-2.97, -0.817],
// 						[-2.963, -1.071]
// 					],
// 					"score_trend": [0, 1, 2, 3, 4, 5]
// 				}
// 			},
// 			"rally": [0, 0, 0],
// 			"player1": {
// 				"score": 0,
// 				"key_cnt": 0.6,
// 				"nickname": "player1",
// 				"attack_pos": 3,
// 				"attack_type": 2,
// 				"power_up_cnt": 0
// 			},
// 			"player2": {
// 				"score": 5,
// 				"key_cnt": 0,
// 				"nickname": "player2",
// 				"attack_pos": 3,
// 				"attack_type": 0,
// 				"power_up_cnt": 0
// 			},
// 			"play_time": "00:00:13",
// 			"max_ball_speed": [0.04, 0.04, 0.04]
// 		},
// 		"winner_id": 2
// 	},
