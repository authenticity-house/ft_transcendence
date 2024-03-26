const html = String.raw;

function bracketTemplate(bracketInfo) {
	let playerCount = 0;
	let userWrappers = '';
	for (let i = 0; i < bracketInfo.length; i += 1) {
		for (let j = 0; j < bracketInfo[i].length; j += 1) {
			userWrappers += `<div class="user-wrapper"><p>${bracketInfo[i][j]}</p></div>`;
			playerCount += 1;
		}
	}
	if (playerCount <= 4) {
		return html`
			<div class="tournament-bracket">
				<div class="user-container">${userWrappers}</div>
				<div class="wire-container"></div>
				<div class="user-container"></div>
				<div class="wire-container"></div>
				<div class="user-container"></div>
			</div>
		`;
	}
	return html`
		<div class="tournament-bracket">
			<div class="user-container">${userWrappers}</div>
			<div class="wire-container"></div>
			<div class="user-container"></div>
			<div class="wire-container"></div>
			<div class="user-container"></div>
			<div class="wire-container"></div>
			<div class="user-container"></div>
		</div>
	`;
}

function getUserPosition() {
	const userContainer = document.querySelector('.user-container');
	const userContainerRect = userContainer.getBoundingClientRect();
	const parentY = userContainerRect.y;
	const position = [];

	let halfHeight;
	const userWrappers = document.querySelectorAll('.user-wrapper');
	userWrappers.forEach((child) => {
		const childRect = child.getBoundingClientRect();
		halfHeight = childRect.height / 2;
		const childY = childRect.y + halfHeight;
		const relativeY = childY - parentY;
		position.push(relativeY);
	});
	return { position, halfHeight };
}

function addUserBracket(position, halfHeight, child, bracketInfo, winPlayer) {
	let positionIndex = 0;
	for (let i = 0; i < bracketInfo.length; i += 1) {
		for (let j = 0; j < bracketInfo[i].length; j += 1) {
			const topPosition = position[positionIndex] - halfHeight;
			positionIndex += 1;
			const userWrapper = document.createElement('div');
			userWrapper.style.top = `${topPosition}px`;
			userWrapper.style.left = '0';
			userWrapper.classList.add('user-wrapper-position');

			const userWrapperText = bracketInfo[i][j];
			const textSpan = document.createElement('span');
			textSpan.textContent = userWrapperText;
			if (userWrapperText === 'PONG !')
				userWrapper.classList.add('pong-animation');
			if (userWrapperText === winPlayer)
				textSpan.classList.add('win-player-animation');
			userWrapper.appendChild(textSpan);
			child.appendChild(userWrapper);
		}
	}
}

function addWireBracket(position, child, depth) {
	let odd = false;
	if (position.length % 2 === 1) odd = true;
	const newPosition = [];

	for (let i = 0; i < position.length; ) {
		if (
			(odd === true && i === 0 && depth === 1) ||
			(odd === true && i === 2 && depth === 2)
		) {
			const topPosition = position[i];
			const wireWrapper = document.createElement('div');
			wireWrapper.classList.add('wire-wrapper');
			wireWrapper.style.top = `${topPosition}px`;
			wireWrapper.style.left = '0';
			wireWrapper.innerHTML = '<div class="wire-dotted-line"></div>';
			child.appendChild(wireWrapper);
			newPosition.push(topPosition);
			i += 1;
		} else {
			const topPosition = position[i];
			const bottomPosition = position[i + 1];
			const mid = (topPosition + bottomPosition) / 2;
			const height = bottomPosition - topPosition;
			const wireWrapper = document.createElement('div');
			wireWrapper.classList.add('wire-wrapper');
			wireWrapper.style.top = `${topPosition}px`;
			wireWrapper.style.left = '0';
			wireWrapper.style.height = `${height}px`;
			wireWrapper.innerHTML = `
					<div class="wire-rectangle"></div>
					<div class="wire-solid-line"></div>`;
			child.appendChild(wireWrapper);
			newPosition.push(mid);
			i += 2;
		}
	}
	position.splice(0, position.length, ...newPosition);
}

export { bracketTemplate, addUserBracket, addWireBracket, getUserPosition };
