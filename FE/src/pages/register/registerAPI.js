import { formDataToJson } from '../../utils/formDataToJson.js';
import {
	showModal,
	hideModal,
	showModalWithContent
} from '../../components/modal/modalUtils.js';
import apiEndpoints from '../../constants/apiConfig.js';

async function handleResponse(response) {
	const data = await response.json();

	const { status, ok } = response;

	const defaultMessage =
		'오류가 발생하여 회원가입에 실패했습니다.<br />다시 시도해주세요.';
	let message = defaultMessage;

	if ((!ok && status === 400) || status === 403) {
		if (
			data.non_field_errors &&
			data.non_field_errors[0] ===
				'The password is too similar to the username.'
		) {
			message = '비밀번호가 아이디와 유사합니다.<br />다시 작성해주세요.';
		} else if (
			data.password1 &&
			data.password1[0] === 'This password is too common.'
		) {
			message = '비밀번호가 너무 일반적입니다.<br />다시 작성해주세요.';
		}
	}

	return { ok, status, message };
}

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
