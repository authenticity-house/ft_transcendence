import { formDataToJson } from '../../utils/formDataToJson.js';
import {
	showModal,
	hideModal,
	showModalWithContent
} from '../../components/modal/modalUtils.js';
import apiEndpoints from '../../constants/apiConfig.js';
import {
	registrationMessages,
	registrationError
} from '../../constants/constants.js';

async function handleResponse(response) {
	const data = await response.json();
	const { status, ok } = response;

	let message = registrationMessages.DEFAULT_ERROR;

	if (!ok && status === 400) {
		if (
			data.non_field_errors &&
			data.non_field_errors[0] === registrationError.PASSWORD_SIMILAR_ERROR
		) {
			message = registrationMessages.PASSWORD_SIMILAR_TO_USERNAME;
		} else if (
			data.password1 &&
			data.password1[0] === registrationError.PASSWORD_TOO_COMMON_ERROR
		) {
			message = registrationMessages.PASSWORD_TOO_COMMON;
		}
	}

	return { ok, status, message };
}

export function registerAPI(formData, reset) {
	const payload = formDataToJson(formData);

	showModal('loadingModal');

	fetch(apiEndpoints.REGISTRATION_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: payload
	})
		.then(handleResponse)
		.then(({ ok, status, message }) => {
			hideModal('registerLoadingModal');

			if (ok && status === 201) {
				showModal('registerModal');
				reset();
			} else {
				showModalWithContent(
					'registerFailModal',
					'register-fail-modal',
					message
				);
			}
		})
		.catch((error) => {
			showModal('registerFailModal', error);
		});
}
