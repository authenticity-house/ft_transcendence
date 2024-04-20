export const MessageType = {
	GAME: 'game',
	GAME_OVER: 'game_over',
	GAME_OVER_RESPONSE: 'game_over_response'
};
Object.freeze(MessageType);

export const SubType = {
	CONNECTION_ESTABLISHED: 'connection_established',
	TOURNAMENT_TREE: 'tournament_tree',
	MATCH_INIT_SETTING: 'match_init_setting',
	MATCH_RUN: 'match_run',
	MATCH_END: 'match_end',
	ERROR: 'error'
};
Object.freeze(SubType);

export const Winner = {
	PLAYER_1: 1,
	PLAYER_2: 2
};
Object.freeze(Winner);

export const CLIENT_ID =
	'u-s4t2ud-bd4e13d8c5985218248a27937e7f99476cb6818a2417eb1aa3e9bcc1de456674';
export const REDIRECT_URI =
	'http%3A%2F%2Flocalhost%3A8080%2Fapi%2Fusers%2Foauth%2F';
