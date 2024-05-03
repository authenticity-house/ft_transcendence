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

	mountStats(data) {
		const friendInfoContentWinLoseContainer = document.querySelector(
			'.friend-info-content-win-lose-container'
		);
		const friendInfoContentWinRateContainer = document.querySelector(
			'.friend-info-content-win-rate-container'
		);
		const friendInfoContentRatingContainer = document.querySelector(
			'.friend-info-content-rating-container'
		);

		friendInfoContentWinLoseContainer.innerHTML = `
			<span>${data.total_count}전</span>
			<span>${data.wins_count}승</span>
			<span>${data.losses_count}패</span>
		`;

		friendInfoContentWinRateContainer.innerHTML = `
			<span>승률</span>
			<span>${data.winning_rate * 100}%</span>
		`;

		friendInfoContentRatingContainer.innerHTML = `
			<span>레이팅</span>
			<span>${data.rating}점</span>
		`;
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
					friend_pk: data.pk
				})
			})
				.then((res) => res.json())
				.then((res) => {
					if (res.detail === 'success') {
						alert('친구 추가 요청을 보냈습니다.');
					} else if (res.code === 'FRIEND_ERROR_0') {
						alert('자기 자신을 친구로 추가할 수 없습니다.');
					} else if (res.code === 'FRIEND_ERROR_1') {
						alert('이미 친구인 사용자입니다.');
					} else if (res.code === 'FRIEND_ERROR_2') {
						alert('이미 친구 요청을 보낸 사용자입니다.');
					} else if (res.code === 'PARSE_ERROR') {
						alert('잘못된 요청입니다.');
					} else {
						alert('친구 추가 요청을 보내는데 실패했습니다.');
					}
				})
				.catch((err) => console.log(err));
		});
	}
}

export const friendInfoContent = new FriendInfoContent();
