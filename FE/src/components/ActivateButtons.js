export function ActivateButtons(containerSelector) {
	document.querySelectorAll(containerSelector).forEach((container) => {
		container.querySelectorAll('button').forEach((btn) => {
			btn.addEventListener('click', (event) => {
				const clickedBtn = event.target;
				container.querySelectorAll('button').forEach((innerBtn) => {
					innerBtn.classList.remove('selected');
				});
				clickedBtn.classList.add('selected');
				// gameSetting.setSelectedButtonIndex(index);
			});
		});
	});
}
