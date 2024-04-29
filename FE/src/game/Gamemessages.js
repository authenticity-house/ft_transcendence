export class GameMessages {
	static gameSessionInfoMsg(initial) {
		return {
			type: 'game',
			subtype: 'session_info',
			message: '',
			data: initial
		};
		// 임시로 1로 설정
		// message.data.total_score = 1;
	}

	static gameMatchInitSettingMsg() {
		return {
			type: 'game',
			subtype: 'match_init_setting',
			message: 'go!',
			data: {}
		};
	}

	static gameStartRequestMsg() {
		return {
			type: 'game',
			subtype: 'match_start',
			message: 'go!',
			data: '',
			match_id: 123
		};
	}

	static gameNextMatchMsg() {
		return {
			type: 'game',
			subtype: 'next_match',
			message: 'go!'
		};
	}

	static gameOverMsg() {
		return {
			type: 'game_over',
			subtype: 'summary',
			message: 'go!'
		};
	}

	static gameDisconnectMsg() {
		return {
			type: 'disconnect',
			message: "I'm leaving!"
		};
	}
}
