export function showMessage(element, message, duration = 1200) {
	const text = document.querySelector(element);
	text.innerText = message;
	text.style.opacity = 1;
	text.style.transition = 'opacity 0.5s ease';

	setTimeout(() => {
		text.style.opacity = 0;
	}, duration);
}
