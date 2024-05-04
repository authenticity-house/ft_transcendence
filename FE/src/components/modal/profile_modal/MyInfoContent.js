import TextInputBox from '../../TextInputBox.js';
import uploadImageListener from './updateProfile/uploadImageListener.js';
import updateNicknameListener from './updateProfile/updateNicknameListener.js';
import updatePasswordListener from './updateProfile/updatePasswordListener.js';

const html = String.raw;

class MyInfoContent {
	template() {
		return html`
			<div class="my-info-content-container">
				<div class="my-info-content-left">
					<div class="my-info-content-image-name-container">
						<div class="my-info-content-image-container">
							<div class="my-info-content-image"></div>
							<button class="my-info-content-image-edit">
								<img class="edit-icon" src="image/edit.svg" alt="edit" />
							</button>
						</div>
						<!-- 유저 프로필 이미지 수정  -->
						<form
							id="image-upload-form"
							enctype="multipart/form-data"
							style="display:none;"
						>
							<input
								type="file"
								name="image"
								id="modify-profile-image"
								accept="image/*"
							/>
							<input type="submit" value="Upload Image" />
						</form>

						<div class="my-info-content-name">
							<span class="display-light28">이름</span>
							<img class="edit-icon" src="image/edit.svg" alt="edit" />
						</div>

						<div class="modify-name-error-msg display-light18"></div>
					</div>
					<div class="my-info-content-id-password-container">
						<div class="my-info-content-id"></div>
						<div class="my-info-content-password"></div>
					</div>
				</div>
				<div class="vertical-container" style="gap:6rem">
					<div class="my-info-content-right">
						<div class="my-info-stats-container display-light28">
							<div class="my-info-content-win-lose-container">
								<span>N전</span>
								<span>N승</span>
								<span>N패</span>
							</div>
							<div class="my-info-content-win-rate-container">
								<span>승률</span>
								<span>NN%</span>
							</div>
							<div class="my-info-content-rating-container">
								<span>레이팅</span>
								<span>NNN점</span>
							</div>
						</div>
					</div>
					<div class="my-info-content-id-password-container2">
						<div class="my-info-content-modify-password-container"></div>
					</div>
				</div>
			</div>
		`;
	}

	createTextInputBoxes() {
		const boxesConfig = [
			{
				text: '기존 비밀번호',
				button: false,
				name: 'old_password',
				modify: true
			},
			{ text: '새 비밀번호', button: false, name: 'password', modify: true },
			{
				text: '새 비밀번호 확인',
				button: false,
				name: 'password2',
				modify: true
			}
		];
		return boxesConfig.map((config) => new TextInputBox(config));
	}

	mount(data) {
		const myInfoContentImage = document.querySelector('.my-info-content-image');
		const myInfoContentName = document.querySelector('.my-info-content-name');
		const myInfoContentIdPasswordContainer = document.querySelector(
			'.my-info-content-id-password-container'
		);
		const myInfoContentIdPasswordContainer2 = document.querySelector(
			'.my-info-content-id-password-container2'
		);

		if (data.profile_url !== '/profile/default.png') {
			myInfoContentImage.innerHTML = `
				<img
					class="my-info-user-profile-image"
					src="${data.profile_url}"
					alt="profile"
				/>
			`;
		} else {
			myInfoContentImage.innerHTML = `
				<img
					class="my-info-user-profile-image"
					src="image/default-profile.png"
					alt="profile"
				/>
			`;
		}

		myInfoContentName.innerHTML = `
			<span class="display-light28">${data.nickname}</span>
			<input type="text" class="display-light20 my-info-content-name-modify-input"
				placeholder="새로운 닉네임" maxlength="12" />
			<img id="edit-name" class="edit-icon" src="image/edit.svg" alt="edit" />
			<img id="edit-name-cancel" class="edit-icon-cancel display-none" src="image/close.svg" alt="cancel" />
		`;

		if (data.provider === 'PONG') {
			const myInfoContentId = document.querySelector('.my-info-content-id');
			const myInfoContentPassword = document.querySelector(
				'.my-info-content-password'
			);
			const modifyPassword = document.querySelector(
				'.my-info-content-modify-password-container'
			);

			myInfoContentId.innerHTML = `
				<span class="display-light24">ID</span>
				<span class="display-light24">${data.username}</span>
			`;

			const textInputBoxes = this.createTextInputBoxes();
			modifyPassword.innerHTML = `
				<form class="modify-password-form">
						${textInputBoxes.map((input) => input.template()).join('')}
					<div class="modify-password-button-container">
						<button type="button" id="cancel-pw" class="display-light18 head_blue_neon_15 modify-password-button">
							취소
						</button>
						<button type="button" id="submit-pw" class="display-light18 head_blue_neon_15 modify-password-button">
							확인
						</button>
					</div>
					<div class="modify-name-error-msg2 display-light18"></div>
				</form>
			`;

			myInfoContentPassword.innerHTML = `
				<div class="password-button-container">
					<span class="display-light24">비밀번호</span>
					<button type="button" class="display-light24 head_blue_neon_15">
						변경
					</button>
				</div>
			`;

			myInfoContentIdPasswordContainer.appendChild(myInfoContentId);
			myInfoContentIdPasswordContainer2.appendChild(modifyPassword);
			myInfoContentIdPasswordContainer.appendChild(myInfoContentPassword);

			document.querySelector('.modify-name-error-msg').innerHTML = '';
		}
	}

	mountStats(data) {
		const myInfoContentWinLoseContainer = document.querySelector(
			'.my-info-content-win-lose-container'
		);
		const myInfoContentWinRateContainer = document.querySelector(
			'.my-info-content-win-rate-container'
		);
		const myInfoContentRatingContainer = document.querySelector(
			'.my-info-content-rating-container'
		);

		myInfoContentWinLoseContainer.innerHTML = `
			<span>${data.total_count}전</span>
			<span>${data.wins_count}승</span>
			<span>${data.losses_count}패</span>
		`;

		myInfoContentWinRateContainer.innerHTML = `
			<span>승률</span>
			<span>${data.winning_rate}%</span>
		`;

		myInfoContentRatingContainer.innerHTML = `
			<span>레이팅</span>
			<span>${data.rating}점</span>
		`;
	}

	addEventListener() {
		uploadImageListener();
		updateNicknameListener();
		updatePasswordListener();
	}
}

export const myInfoContent = new MyInfoContent();
