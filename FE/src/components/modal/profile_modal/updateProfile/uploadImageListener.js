import apiEndpoints from '../../../../constants/apiConfig.js';
import { getCookie } from '../../../../utils/getCookie.js';
import { showMessage } from './updateProfileUtils.js';

async function uploadImageAPI(e) {
	const image = e.target.files[0];
	if (!image) return;

	const formData = new FormData();
	formData.append('image', image);
	const csrfToken = getCookie('csrftoken');

	try {
		const response = await fetch(apiEndpoints.UPLOAD_IMAGE_URL, {
			method: 'POST',
			headers: {
				'X-CSRFToken': csrfToken
			},
			body: formData
		});

		const data = await response.json();
		const { status, ok } = response;
		if (ok) {
			document.querySelector('.my-info-user-profile-image').src = data.url;
			const headerImg = document.querySelector('.user-profile-img');
			const OnlineImg = document.querySelector('.user-profile-summary-img');
			if (headerImg) headerImg.src = data.url;
			if (OnlineImg) OnlineImg.src = data.url;
		} else if (status === 400) {
			showMessage('.modify-image-error-msg', '이미지 업로드에 실패했습니다.');
		}
	} catch (error) {
		showMessage('.modify-image-error-msg', '이미지 크기가 큽니다.');
	}
}

export default function uploadImageListener() {
	// 프로필 변경 이미지 클릭
	const modifyProfilButton = document.querySelector(
		'.my-info-content-image-edit'
	);
	modifyProfilButton.addEventListener('click', () =>
		document.getElementById('modify-profile-image').click()
	);

	// 유저 프로필 변경
	document
		.getElementById('modify-profile-image')
		.addEventListener('change', (e) => {
			uploadImageAPI(e);
		});
}
