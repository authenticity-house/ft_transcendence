export function removeModalBackdrop() {
	const backdrop = document.querySelector('.modal-backdrop');
	if (backdrop) {
		backdrop.parentNode.removeChild(backdrop);
	}
}
