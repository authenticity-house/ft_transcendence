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
					reset();
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
