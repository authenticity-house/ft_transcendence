export function browserInfo(msg) {
	const browserInfoElement = document.getElementById('browser-state-info');
	browserInfoElement.textContent = msg;
	browserInfoElement.style.opacity = 1;
	browserInfoElement.style.transition = 'opacity 0.5s ease';
	setTimeout(() => {
		browserInfoElement.style.opacity = 0;
	}, 1200);
}
