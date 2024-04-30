import apiEndpoints from '../../../constants/apiConfig.js';
import { getCookie } from '../../../utils/getCookie.js';

const html = String.raw;

class FriendInfoContent {
	template() {
		return html`
			<div class="friend-info-content-container">
				<div class="friend-info-content-left">
					<div class="friend-info-content-image-name-container">
						<div class="friend-info-content-image-container">
							<div class="friend-info-content-image"></div>
						</div>
						<div class="friend-info-content-name">
							<span class="display-light28">이름</span>
						</div>
					</div>
					<div class="friend-info-content-add-friend-container"></div>
				</div>
				<div class="friend-info-content-right">
					<div class="friend-info-stats-container display-light28">
						<div class="friend-info-content-win-lose-container">
							<span>N전</span>
							<span>N승</span>
							<span>N패</span>
						</div>
						<div class="friend-info-content-win-rate-container">
							<span>승률</span>
							<span>NN%</span>
						</div>
						<div class="friend-info-content-rating-container">
							<span>레이팅</span>
							<span>NNN점</span>
						</div>
					</div>
				</div>
			</div>
		`;
	}

	mount(data) {
		const friendInfoContentImage = document.querySelector(
			'.friend-info-content-image'
		);
		const friendInfoContentName = document.querySelector(
			'.friend-info-content-name'
		);

		console.log('data: ', data);
		if (data.profile_url !== '/profile/default.png') {
			friendInfoContentImage.innerHTML = `
				<img
					class="my-info-user-profile-image"
					src="${data.profile_url}"
					alt="profile"
				/>
			`;
		} else {
			friendInfoContentImage.innerHTML = `
				<img
					class="my-info-user-profile-image"
					src="image/default-profile.png"
					alt="profile"
				/>
			`;
		}

		friendInfoContentName.innerHTML = `
			<span class="display-light28">${data.nickname}</span>
		`;

		const friendInfoContentAddButton = document.createElement('button');

		friendInfoContentAddButton.classList.add('friend-info-content-add-button');
		friendInfoContentAddButton.classList.add('head_blue_neon_15');
		friendInfoContentAddButton.innerHTML = '친구 추가';

		const friendInfoContentAddFriendContainer = document.querySelector(
			'.friend-info-content-add-friend-container'
		);

		// 친구 추가 컨테이너 안에 기존 내용 삭제
		friendInfoContentAddFriendContainer.innerHTML = '';
		friendInfoContentAddFriendContainer.appendChild(friendInfoContentAddButton);
	}

	addEventListeners(data) {
		const friendInfoContentAddButton = document.querySelector(
			'.friend-info-content-add-button'
		);

		friendInfoContentAddButton.addEventListener('click', () => {
			fetch(apiEndpoints.MY_FRIEND_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': getCookie('csrftoken')
				},
				body: JSON.stringify({
					friend_pk: String(data.pk)
				})
			})
				.then((res) => {
					return res.json();
				})
				.then((res) => {
					if (res.detail === 'success') {
						alert('친구 추가 요청을 보냈습니다.');
					} else {
						alert('친구 추가 요청을 보내지 못했습니다.');
					}
				});
		});
	}
}

export const friendInfoContent = new FriendInfoContent();
