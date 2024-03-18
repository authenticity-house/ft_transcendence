import { changeUrl } from '../index.js';
import BoldTitle from '../components/BoldTitle.js';
import ButtonSmall from '../components/ButtonSmall.js';
import TournamentBracket from '../components/TournamentBracket.js';

const html = String.raw;

function addUserBracket(position, halfHeight, child) {
	for (let i = 0; i < position.length; i += 1) {
		const topPosition = position[i] - halfHeight;
		const userWrapper = document.createElement('div');
		userWrapper.classList.add('user-wrapper-position');
		userWrapper.classList.add('head_blue_neon_15');
		userWrapper.style.top = `${topPosition}px`;
		userWrapper.style.left = '0';
		child.appendChild(userWrapper);
	}
}

function addWireBracket(position, child) {
	let odd = false;
	if (position.length % 2 === 1) odd = true;
	const newPosition = [];

	for (let i = 0; i < position.length; ) {
		if (odd === true && i === 2) {
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

class TournamentPage {
	template() {
		const titlComponent = new BoldTitle('대진표', 'yellow');
		const nextButton = new ButtonSmall('다음');

		const tournamentBracket = new TournamentBracket();

		return html`
			<div class="medium-window head_white_neon_15">
				${titlComponent.template()}
				<div class="medium-window-container display-light18">
					${tournamentBracket.template()}
				</div>
				<div class="event-click-match" style="margin-top: 4rem">
					${nextButton.template()}
				</div>
			</div>
		`;
	}

	addEventListeners() {
		const next = document.querySelector('.event-click-match');
		next.addEventListener('click', () => {
			changeUrl('');
		});
	}

	mount() {
		const { position, halfHeight } = getUserPosition();
		const tournamentBracket = document.querySelector('.tournament-bracket');
		const userWireContainer = tournamentBracket.children;
		let firstChildPassed = false;
		for (const child of userWireContainer) {
			if (firstChildPassed === false) {
				firstChildPassed = true;
				continue;
			}
			if (child.classList.contains('user-container')) {
				addUserBracket(position, halfHeight, child);
			} else if (child.classList.contains('wire-container')) {
				addWireBracket(position, child);
			}
		}
	}
}

export default new TournamentPage();
