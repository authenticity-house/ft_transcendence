export function idValidCheck(id) {
	const idRegex = /^[a-z0-9_-][a-z0-9_-]*$/;

	if (!idRegex.test(id)) return false;

	if (!(id.length >= 4 && id.length <= 12)) return false;

	return true;
}

export function emailValidCheck(email) {
	const emailRegex = /^[a-z0-9_-]+@[a-z0-9-]+\.[a-z0-9]{2,8}(\.[a-z]{2,8})?$/;

	if (!emailRegex.test(email)) return false;

	if (!(email.length <= 250)) return false;

	return true;
}

export function nicknameValidCheck(id) {
	const nicknameRegex = /^[a-z0-9_-][a-z0-9_-]*$/;
	if (!nicknameRegex.test(id)) return false;

	if (!(id.length >= 2 && id.length <= 12)) return false;

	return true;
}

export function passwordValidCheck() {
	const pass1 = document.querySelector(`input[name="password1"]`);
	const pass2 = document.querySelector(`input[name="password2"]`);

	if (pass1.value !== pass2.value)
		return '비밀번호와 비밀번호 확인이 일치하지 않습니다.';
	if (pass1.value.length < 8)
		return '비밀번호가 너무 짧습니다.<br />9자 이상으로 작성해주세요.';
	return false;
}
