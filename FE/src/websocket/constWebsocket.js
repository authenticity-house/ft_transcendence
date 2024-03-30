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
