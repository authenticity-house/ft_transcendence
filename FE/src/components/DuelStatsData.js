class DuelStatsData {
	static getDuelStatsData(data) {
		const leftPlayer = data ? data.player1.nickname : '플레이어1';
		const rightPlayer = data ? data.player2.nickname : '플레이어2';
		const leftScore = data ? data.player1.score : 0;
		const rightScore = data ? data.player2.score : 0;
		const leftPlayerImage = data ? data.player1.image : '';
		const rightPlayerImage = data ? data.player2.image : '';

		const winPlayer =
			leftScore > rightScore ? `${leftPlayer} WIN!` : `${rightPlayer} WIN!`;

		const matchDate = data ? data.date : '2000-00-00';
		const matchTime = data ? data.play_time : '00:00:00';

		const maxRally = data ? data.rally[0] : 0;
		const maxMaxBallSpeed = data ? data.max_ball_speed[0] : 0;
		const avgRally = data ? data.rally[1] : 0;
		const avgMaxBallSpeed = data ? data.max_ball_speed[1] : 0;
		const minRally = data ? data.rally[2] : 0;
		const minMaxBallSpeed = data ? data.max_ball_speed[2] : 0;

		const attackType1 = data ? data.player1.attack_type : 0;
		const attackType2 = data ? data.player2.attack_type : 0;
		const attackTypeList = ['공격형', '방어형', '혼합형'];
		const leftAttackType = attackTypeList[attackType1];
		const rightAttackType = attackTypeList[attackType2];

		const attackPos1 = data ? data.player1.attack_pos : 0;
		const attackPos2 = data ? data.player2.attack_pos : 0;
		const attackPosList = ['상단', '중단', '하단', '전체'];
		const leftAttackPos = attackPosList[attackPos1];
		const rightAttackPos = attackPosList[attackPos2];

		const powerUpCnt1 = data ? data.player1.power_up_cnt : 0;
		const powerUpCnt2 = data ? data.player2.power_up_cnt : 0;

		const keyCnt1 = data ? data.player1.key_cnt : 0;
		const keyCnt2 = data ? data.player2.key_cnt : 0;

		return {
			leftPlayer,
			rightPlayer,
			leftScore,
			rightScore,
			leftPlayerImage,
			rightPlayerImage,
			winPlayer,
			matchDate,
			matchTime,
			maxRally,
			maxMaxBallSpeed,
			avgRally,
			avgMaxBallSpeed,
			minRally,
			minMaxBallSpeed,
			leftAttackType,
			rightAttackType,
			leftAttackPos,
			rightAttackPos,
			powerUpCnt1,
			powerUpCnt2,
			keyCnt1,
			keyCnt2
		};
	}

	static getMountDuelStatsData(data) {
		const leftScoreTrend = data ? data.graph.player1.score_trend : [];
		const rightScoreTrend = data ? data.graph.player2.score_trend : [];
		const leftScore = data ? data.player1.score : -1;
		const rightScore = data ? data.player2.score : -1;
		const maxScore = leftScore >= rightScore ? leftScore : rightScore;

		const leftPosition = data ? data.graph.player1.score_pos : [];
		const rightPosition = data ? data.graph.player2.score_pos : [];

		return {
			leftScoreTrend,
			rightScoreTrend,
			maxScore,
			leftPosition,
			rightPosition
		};
	}
}
export default DuelStatsData;
