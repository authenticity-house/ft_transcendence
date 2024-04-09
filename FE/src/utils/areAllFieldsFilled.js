export function areAllFieldsFilled(formData) {
	for (const value of formData.values()) {
		if (!value.trim()) {
			return false;
		}
	}
	return true;
}
