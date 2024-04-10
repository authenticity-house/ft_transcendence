export function formDataToJson(formData) {
	const object = {};
	formData.forEach((value, key) => {
		object[key] = value;
	});
	return JSON.stringify(object);
}
