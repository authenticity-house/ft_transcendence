import { formDataToJson } from '../../utils/formDataToJson.js';
import { showModal, hideModal } from '../../components/modal/modalUtils.js';
import apiEndpoints from '../../constants/apiConfig.js';

export function registerAPI(formData) {
	const payload = formDataToJson(formData);
	console.log('Form data:', payload);
	showModal('registerLoadingModal');

	fetch(apiEndpoints.REGISTRATION_URL, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		},
		body: payload
	})
		.then((response) => {
			let modalToShow;

			// 200 : OK
			if (response.ok) {
				if (response.status === 201) {
					// 201 : Created
					modalToShow = 'registerModal';
				}
			}
			if (response.status === 400 || response.status === 403) {
				// 비밀번호 다름, 아이디/닉네임/이메일 중복
				modalToShow = 'registerFailModal';
			}
			if (modalToShow) {
				hideModal('registerLoadingModal', () => {
					showModal(modalToShow);
				});
				return response.json();
			}
			throw new Error('Error');
		})
		.then((data) => console.log(data))
		.catch((error) => console.error('Error:', error));
}
