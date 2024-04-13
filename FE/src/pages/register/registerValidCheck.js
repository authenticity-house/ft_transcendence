export function idValidCheck(id) {
	const idRegex = /^[a-z0-9_-][a-z0-9_-]*$/;

	if (!idRegex.test(id)) return false;

	if (!(id.length >= 4 && id.length <= 12)) return false;

	return true;
}

export function emailValidCheck(email) {
	const emailRegex = /^[a-z0-9_-]+@[a-z0-9-]+\.[a-z]{2,4}$/;
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
