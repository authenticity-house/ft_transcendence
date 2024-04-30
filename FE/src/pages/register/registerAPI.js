// import { formDataToJson } from '../../utils/formDataToJson.js';
// import { showModal, hideModal } from '../../components/modal/modalUtils.js';
// import apiEndpoints from '../../constants/apiConfig.js';

// export function registerAPI(formData, reset) {
// 	const payload = formDataToJson(formData);

// 	showModal('registerLoadingModal');

// 	fetch(apiEndpoints.REGISTRATION_URL, {
// 		method: 'POST',
// 		headers: {
// 			'Content-Type': 'application/json'
// 		},
// 		body: payload
// 	}).then((response) => {
// 		let modalToShow = 'registerFailModal';

// 		// 200 : OK
// 		if (response.ok) {
// 			if (response.status === 201) {
// 				// 201 : Created
// 				modalToShow = 'registerModal';
// 				reset();
// 			}
// 		}
// 		if (response.status === 400) {
// 			// 비밀번호 다름, 아이디/닉네임/이메일 중복
// 			console.log('res', response);
// 			// if (
// 			// 	response.non_field_errors &&
// 			// 	response.non_field_errors[0] ===
// 			// 		'The password is too similar to the username.'
// 			// )
// 			modalToShow = 'registerSimilarModal';
// 		}
// 		if (modalToShow) {
// 			hideModal('registerLoadingModal', () => {
// 				showModal(modalToShow);
// 			});
// 		}
// 		return response.json();
// 	});
// }

import { formDataToJson } from '../../utils/formDataToJson.js';
import { showModal, hideModal } from '../../components/modal/modalUtils.js';
import apiEndpoints from '../../constants/apiConfig.js';

export function registerAPI(formData, reset) {
	const payload = formDataToJson(formData);

	showModal('registerLoadingModal');

	fetch(apiEndpoints.REGISTRATION_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: payload
	})
		.then((response) => {
			return response
				.json()
				.then((data) => ({ status: response.status, ok: response.ok, data }));
		})
		.then(({ status, ok, data }) => {
			let modalToShow = 'registerFailModal';

			if (ok) {
				if (status === 201) {
					modalToShow = 'registerModal';
					reset(); // 폼을 리셋합니다.
				}
			} else if (status === 400 || status === 403) {
				if (
					data.non_field_errors &&
					data.non_field_errors[0] ===
						'The password is too similar to the username.'
				) {
					modalToShow = 'registerSimilarModal';
				}
			}
			hideModal('registerLoadingModal', () => {
				showModal(modalToShow);
			});
		})
		.catch(() => {
			hideModal('registerLoadingModal', () => {
				showModal('registerFailModal');
			});
		});
}
