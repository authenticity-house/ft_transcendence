export function gameSessionInfoMsg(initial) {
	const message = {
		type: 'game',
		subtype: 'session_info',
		message: '',
		data: initial
	};
	// 임시로 1로 설정
	message.data.total_score = 1;

	return message;
}

export function gameMatchInitSettingMsg() {
	const message = {
		type: 'game',
		subtype: 'match_init_setting',
		message: 'go!',
		data: {}
	};

	return message;
}

export function gameStartRequestMsg() {
	const message = {
		type: 'game',
		subtype: 'match_start',
		message: 'go!',
		data: '',
		match_id: 123
	};

	return message;
}

export function gameNextMatchMsg() {
	const message = {
		type: 'game',
		subtype: 'next_match',
		message: 'go!'
	};
	return message;
}

export function gameOverMsg() {
	const message = {
		type: 'game_over',
		subtype: 'summary',
		message: 'go!'
	};
	return message;
}

export function gameDisconnectMsg() {
	const message = {
		type: 'disconnect',
		message: "I'm leaving!"
	};
	return message;
}
