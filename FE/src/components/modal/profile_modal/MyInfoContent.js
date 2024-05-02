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
							<input type="file" id="modify-profile-image" accept="image/*" />
							<input type="submit" value="Upload Image" />
						</form>

						<div class="my-info-content-name">
							<span class="display-light28">이름</span>
							<img class="edit-icon" src="image/edit.svg" alt="edit" />
						</div>
					</div>
					<div class="my-info-content-id-password-container">
						<div class="my-info-content-id"></div>
						<div class="my-info-content-password"></div>
					</div>
				</div>
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
			</div>
		`;
	}

	mount(data) {
		const myInfoContentImage = document.querySelector('.my-info-content-image');
		const myInfoContentName = document.querySelector('.my-info-content-name');
		const myInfoContentIdPasswordContainer = document.querySelector(
			'.my-info-content-id-password-container'
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
			<img class="edit-icon" src="image/edit.svg" alt="edit" />
		`;

		if (data.provider === 'PONG') {
			const myInfoContentId = document.querySelector('.my-info-content-id');
			const myInfoContentPassword = document.querySelector(
				'.my-info-content-password'
			);

			myInfoContentId.innerHTML = `
				<span class="display-light24">ID</span>
				<span class="display-light24">${data.username}</span>
			`;

			myInfoContentPassword.innerHTML = `
				<span class="display-light24">비밀번호</span>
				<button type="button" class="display-light24 head_blue_neon_15">
					변경
				</button>
			`;

			myInfoContentIdPasswordContainer.appendChild(myInfoContentId);
			myInfoContentIdPasswordContainer.appendChild(myInfoContentPassword);
		}
	}

	addEventListener() {
		// 프로필 변경 이미지 클릭
		const modifyProfilButton = document.querySelector(
			'.my-info-content-image-edit'
		);
		modifyProfilButton.addEventListener('click', () =>
			document.getElementById('modify-profile-image').click()
		);
		// 유저 프로필 변경 (서버 X)
		document
			.getElementById('modify-profile-image')
			.addEventListener('change', (e) => {
				const file = e.target.files[0];
				const imageUrl = URL.createObjectURL(file);
				document.querySelector('.my-info-user-profile-image').src = imageUrl;
			});

		/*  // 유저 프로필 이미지 변경 (서버 연결)
			document.getElementById('image-upload-form').onsubmit = (e) => {
			e.preventDefault();
			const formData = new FormData(this);
			fetch('/users/update/', {
				method: 'PATCH',
				body: formData
			})
				.then((response) => response.json())
				.then((data) => {
					console.log('Success:', data);
					document.querySelector('.my-info-user-profile-image').src =
						data.imageUrl;
				})
				.catch((error) => {
					console.error('Error:', error);
				});
			};
		*/

		// 닉네임 변경 UI
		const modifyNickname = document.querySelector('.my-info-content-name');
		const modifyNicknameButton = modifyNickname.querySelector('img');
		// 현재 닉네임 : 나중에 newNickname 실패 시, 다시 불러 올때 사용 or newNicknmae과 똑같은지 확인 할때 사용
		const nickName = modifyNickname.querySelector('span').innerText;
		modifyNicknameButton.addEventListener('click', () => {
			if (modifyNicknameButton.classList.contains('modify')) {
				// 수정하기 (+ 닉네임 vaild 검사 / + 닉네임 수정 요청 코드 추가)
				const newNickname = modifyNickname.querySelector('input').value;
				// + 새로운 닉네임 valid 검사 코드 추가 ?

				// + 닉네임 수정 요청 코드 추가 후, res.ok이면
				modifyNickname.querySelector('span').innerText = newNickname;
				modifyNickname.querySelector('span').style.display = 'block';
				modifyNickname.querySelector('input').style.display = 'none';
				modifyNicknameButton.classList.remove('modify');
			} else {
				modifyNickname.querySelector('span').style.display = 'none';
				modifyNickname.querySelector('input').style.display = 'block';
				modifyNicknameButton.classList.add('modify');
			}
		});
	}
}

export const myInfoContent = new MyInfoContent();
