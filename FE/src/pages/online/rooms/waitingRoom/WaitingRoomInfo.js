function createStyledElement(elementType, classNames, text) {
	const element = document.createElement(elementType);
	if (classNames) {
		element.className = classNames;
	}
	if (text) {
		element.textContent = text;
	}
	return element;
}

function getRoomTitle() {
	const roomTitle = createStyledElement('span', 'display-medium44', '방 정보');
	return roomTitle;
}

function getRoomInfoContent(roomInfo) {
	const roomInfoContent = createStyledElement(
		'div',
		'room-info-content-container display-medium20'
	);

	const battleMode = ['1 vs 1', '토너먼트'];
	const level = ['쉬움', '보통', '어려움'];

	const playModeTextColor =
		roomInfo.battle_mode === 1 ? 'blue_neon_10' : 'pink_neon_10';
	const playModeElement = createStyledElement(
		'span',
		`room-info-content-text ${playModeTextColor}`,
		`${battleMode[roomInfo.battle_mode - 1]}`
	);
	roomInfoContent.appendChild(playModeElement);

	const roomNameElement = createStyledElement(
		'span',
		'room-info-content-text display-light16',
		`${roomInfo.room_name}`
	);
	roomInfoContent.appendChild(roomNameElement);

	const averageRatingElement = createStyledElement(
		'span',
		'room-info-content-text',
		`평균 레이팅: ${roomInfo.rating}`
	);
	roomInfoContent.appendChild(averageRatingElement);

	const totalScoreElement = createStyledElement(
		'span',
		'room-info-content-text',
		`승점: ${roomInfo.total_score}점`
	);
	roomInfoContent.appendChild(totalScoreElement);

	const levelElement = createStyledElement(
		'span',
		'room-info-content-text',
		`난이도: ${level[roomInfo.level - 1]}`
	);
	roomInfoContent.appendChild(levelElement);

	const colorElement = createStyledElement('div', 'room-info-content-color');
	const colorPaddle = createStyledElement('div', 'room-info-color-paddle');
	colorPaddle.style.backgroundColor = roomInfo.color.paddle;
	colorPaddle.style.boxShadow = `0rem 0rem 2rem 0rem ${roomInfo.color.paddle}`;
	colorElement.appendChild(colorPaddle);
	const colorBall = createStyledElement('div', 'room-info-color-ball');
	colorBall.style.backgroundColor = roomInfo.color.ball;
	colorBall.style.boxShadow = `0rem 0rem 2rem 0rem ${roomInfo.color.ball}`;
	colorElement.appendChild(colorBall);
	roomInfoContent.appendChild(colorElement);

	return roomInfoContent;
}

function getModifyButton() {
	const modifyElement = createStyledElement(
		'button',
		'room-info-modify-button head_yellow_neon_15 yellow_neon_10 display-light20'
	);
	const modifyText = createStyledElement('span', '', '수정하기');
	modifyElement.appendChild(modifyText);
	return modifyElement;
}

function getRoomContainer(roomInfo, isHost) {
	const roomInfoContainer = createStyledElement('div', 'room-info-container');
	roomInfoContainer.appendChild(getRoomTitle());
	roomInfoContainer.appendChild(getRoomInfoContent(roomInfo));
	if (isHost) {
		roomInfoContainer.appendChild(getModifyButton());
	}
	return roomInfoContainer;
}

export { getRoomContainer };
