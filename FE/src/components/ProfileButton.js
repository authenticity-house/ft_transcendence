import { profileModal } from './modal/profile_modal/ProfileModal.js';

const html = String.raw;

// 추후 유저 프로필 이미지 인자로 받아오기
function profileButton() {
	// const profileImage = image || 'image/default-profile.png';
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
				<span class="display-light24">통계</span>
			</button>
			<button
				type="button"
				data-bs-toggle="modal"
				data-bs-target="#profile-modal"
				class="info-modal-button modal-hidden"
				id="header-my-friend-button"
			>
				<img src="image/my-friend.svg" alt="friend" class="info-modal-img" />
				<span class="display-light24">내 친구</span>
			</button>
			<button
				type="button"
				data-bs-toggle="modal"
				data-bs-target="#profile-modal"
				class="info-modal-button modal-hidden"
				id="header-user-search-button"
			>
				<img src="image/search.svg" alt="search" class="info-modal-img" />
				<span class="display-light24">유저 검색</span>
			</button>
			<button
				type="button"
				data-bs-toggle="modal"
				data-bs-target="#profile-modal"
				class="info-modal-button modal-hidden"
				id="header-my-record-button"
			>
				<img src="image/match-record.svg" alt="record" class="info-modal-img" />
				<span class="display-light24">경기 기록</span>
			</button>
			<button
				type="button"
				data-bs-toggle="modal"
				data-bs-target="#profile-modal"
				class="info-modal-button user-profile-button head_white_neon_15"
				id="header-my-info-button"
			>
				<img
					src="image/question-mark.png"
					alt="user"
					class="user-profile-none-img"
				/>
			</button>
		</div>
	`;
}

// 각 버튼을 눌렀을 때 해당하는 모달을 띄우는 이벤트 리스너 추가
function headerAddEventListeners() {
	const infoModalButtons = document.querySelectorAll('.info-modal-button');
	infoModalButtons.forEach((button) => {
		button.addEventListener('click', () => {
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
				profileModal.openModal('my-info');
			}
		});
	});
}

export { profileButton, headerAddEventListeners };
