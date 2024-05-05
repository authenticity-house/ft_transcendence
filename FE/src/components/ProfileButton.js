import { profileModal } from './modal/profile_modal/ProfileModal.js';
import { browserInfo } from '../utils/browserInfo.js';

const html = String.raw;

function profileButton() {
	return html`
		<div class="profile-button-container modal-hidden">
			<button
				type="button"
				data-bs-toggle="modal"
				data-bs-target="#profile-modal"
				class="info-modal-button modal-hidden"
				id="header-stats-button"
			>
				<img src="image/statistics.svg" alt="stats" class="info-modal-img" />
				<span class="display-light18">통계</span>
			</button>
			<button
				type="button"
				data-bs-toggle="modal"
				data-bs-target="#profile-modal"
				class="info-modal-button modal-hidden"
				id="header-my-friend-button"
			>
				<img src="image/my-friend.svg" alt="friend" class="info-modal-img" />
				<span class="display-light18">내 친구</span>
			</button>
			<button
				type="button"
				data-bs-toggle="modal"
				data-bs-target="#profile-modal"
				class="info-modal-button modal-hidden"
				id="header-user-search-button"
			>
				<img src="image/search.svg" alt="search" class="info-modal-img" />
				<span class="display-light18">유저 검색</span>
			</button>
			<button
				type="button"
				data-bs-toggle="modal"
				data-bs-target="#profile-modal"
				class="info-modal-button modal-hidden"
				id="header-my-record-button"
			>
				<img src="image/match-record.svg" alt="record" class="info-modal-img" />
				<span class="display-light18">경기 기록</span>
			</button>
			<button
				type="button"
				class="info-modal-button user-profile-button head_white_neon_15"
				id="header-my-info-button"
			>
				<img
					src="image/question-mark.png"
					alt="user"
					class="user-profile-none-img"
				/>
				<div class="modal-login-tooltip display-light14">로그인 필요</div>
			</button>
		</div>
	`;
}

// 각 버튼을 눌렀을 때 해당하는 모달을 띄우는 이벤트 리스너 추가
function headerAddEventListeners() {
	const infoModalButtons = document.querySelectorAll('.info-modal-button');
	infoModalButtons.forEach((button) => {
		button.addEventListener('click', () => {
			const url = window.location.href.split('/').pop();
			if (url === 'game') {
				browserInfo('게임 중에는 해당 기능을 사용할 수 없습니다.');
				return;
			}
			if (button.id === 'header-my-friend-button') {
				profileModal.openModal('my-friend');
			}
			if (button.id === 'header-user-search-button') {
				profileModal.openModal('user-search');
			}
			if (button.id === 'header-my-record-button') {
				profileModal.openModal('match-record');
			}
			if (button.id === 'header-stats-button') {
				profileModal.openModal('stats');
			}
			if (button.id === 'header-my-info-button') {
				const myInfoButton = document.getElementById('header-my-info-button');
				if (myInfoButton.querySelector('.user-profile-none-img')) {
					// 비 로그인 시, 모달 창 가지 않고 '로그인 필요' 띄우기
					const tooltip = myInfoButton.querySelector('.modal-login-tooltip');
					tooltip.style.display = 'block';
					setTimeout(() => {
						tooltip.style.display = 'none';
					}, 1000);
				} else {
					// 로그인 시, 모달 창 띄우기
					profileModal.openModal('my-info');
				}
			}
		});
	});
}

export { profileButton, headerAddEventListeners };
