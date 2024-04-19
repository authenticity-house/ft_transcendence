import { changeUrl } from '../index.js';
import ButtonLarge from '../components/ButtonLarge.js';
import ButtonBackArrow from '../components/ButtonBackArrow.js';
import apiEndpoints from '../constants/apiConfig.js';

const html = String.raw;

class PlayModePage {
	template() {
		const localButton = new ButtonLarge('LOCAL');
		const onlineButton = new ButtonLarge('ONLINE');
		const backButton = new ButtonBackArrow();

		return html`
			<div class="select-container">
				<div class="select-wrapper button-click-local">
					${localButton.template()}
				</div>
				<div class="select-wrapper button-click-online">
					${onlineButton.template()}
				</div>

				<div class="back-arrow-container">
					<div class="back-arrow">${backButton.template()}</div>
				</div>
			</div>
		`;
	}

	mount() {
		// 숨겼던 모달 드러내기
		document
			.querySelector('.profile-button-container')
			.classList.remove('modal-hidden');

		// 로그인 확인
		fetch(apiEndpoints.LOGIN_CHECK_URL, { method: 'GET' })
			.then((res) => {
				if (res.status === 403) {
					// 로그인 X - 온라인 모드로 가지 못하게 설정
					const onlineButton = document
						.querySelector('.button-click-online')
						.querySelector('.button-large');
					onlineButton.classList.add('disabled');
				} else if (res.status === 200) {
					// 로그인 성공 - 뒤로가기 버튼 없애기
					document
						.querySelector('.button-back-arrow-box')
						.classList.add('display-none');
					// 로그인 성공 - 모달 창 전부 표시
					document.querySelectorAll('.modal-hidden').forEach((element) => {
						element.classList.remove('modal-hidden');
					});
					// 로그인 성공 - 모달 유저 프로필 변경
					const userProfile = document.querySelector('.user-profile-button');
					userProfile.innerHTML = '';
					const userImgElement = document.createElement('img');
					// 유저 이미지 URL 받아서 넣을 예정
					userImgElement.src = 'image/default-profile.png';
					userImgElement.alt = 'user';
					userImgElement.classList.add('user-profile-img');
					userProfile.appendChild(userImgElement);
				}
			})
			.catch((error) => {
				console.error('Error fetching login status:', error);
			});
	}

	addEventListeners() {
		const local = document
			.querySelector('.button-click-local')
			.querySelector('.button-large');
		local.addEventListener('click', () => {
			changeUrl('match');
		});
		const online = document
			.querySelector('.button-click-online')
			.querySelector('.button-large');
		online.addEventListener('click', () => {
			if (online.classList.contains('disabled'))
				console.log('ONLINE Button Clicked! Not LoggedIn');
			else changeUrl('onlineMainScreen');
		});
		const back = document.querySelector('.back-arrow');
		back.addEventListener('click', () => {
			changeUrl('');
		});
	}
}

export default new PlayModePage();
