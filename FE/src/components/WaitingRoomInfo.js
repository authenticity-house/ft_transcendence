function getRoomTitle() {
	const roomTitle = document.createElement('span');
	roomTitle.className = 'display-medium44';
	roomTitle.textContent = '방 정보';
	return roomTitle;
}

function getRoomInfoContent(roomInfo) {
	const roomInfoContent = document.createElement('div');
	roomInfoContent.className = 'room-info-content-container display-medium20';

	const battleMode = ['1 vs 1', '토너먼트'];
	const level = ['쉬움', '보통', '어려움'];
	const totalScore = [5, 10, 15];

	const playModeElement = document.createElement('span');
	const playModeTextColor =
		roomInfo.battle_mode === 1 ? 'blue_neon_10' : 'pink_neon_10';
	playModeElement.className = `room-info-content-text ${playModeTextColor}`;
	playModeElement.textContent = `${battleMode[roomInfo.battle_mode - 1]}`;
	roomInfoContent.appendChild(playModeElement);

	const roomNameElement = document.createElement('span');
	roomNameElement.className = 'room-info-content-text display-light16';
	roomNameElement.textContent = `${roomInfo.roomName}`;
	roomInfoContent.appendChild(roomNameElement);

	const totalScoreElement = document.createElement('span');
	totalScoreElement.className = 'room-info-content-text';
	totalScoreElement.textContent = `승점: ${totalScore[roomInfo.total_score - 1]}점`;
	roomInfoContent.appendChild(totalScoreElement);

	const levelElement = document.createElement('span');
	levelElement.className = 'room-info-content-text';
	levelElement.textContent = `난이도: ${level[roomInfo.level - 1]}`;
	roomInfoContent.appendChild(levelElement);

	const colorElement = document.createElement('div');
	colorElement.className = 'room-info-content-color';
	const colorPaddle = document.createElement('div');
	colorPaddle.className = 'room-info-color-paddle';
	colorPaddle.style.backgroundColor = roomInfo.color.paddle;
	colorPaddle.style.boxShadow = `0rem 0rem 2rem 0rem ${roomInfo.color.paddle}`;
	colorElement.appendChild(colorPaddle);
	const colorBall = document.createElement('div');
	colorBall.className = 'room-info-color-ball';
	colorBall.style.backgroundColor = roomInfo.color.ball;
	colorBall.style.boxShadow = `0rem 0rem 2rem 0rem ${roomInfo.color.ball}`;
	colorElement.appendChild(colorBall);
	roomInfoContent.appendChild(colorElement);

	return roomInfoContent;
}

function getModifyButton() {
	const modifyElement = document.createElement('button');
	modifyElement.className =
		'room-info-modify-button head_yellow_neon_15 yellow_neon_10 display-light20';
	const modifyText = document.createElement('span');
	modifyText.textContent = '수정하기';
	modifyElement.appendChild(modifyText);
	return modifyElement;
}

function getRoomContainer(roomInfo, isHost) {
	const roomInfoContainer = document.createElement('div');
	roomInfoContainer.className = 'room-info-container';
	roomInfoContainer.appendChild(getRoomTitle());
	roomInfoContainer.appendChild(getRoomInfoContent(roomInfo));
	if (isHost) {
		roomInfoContainer.appendChild(getModifyButton());
	}
	return roomInfoContainer;
}

export { getRoomContainer };
