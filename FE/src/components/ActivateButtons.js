export function activateButtons(containerSelector) {
	document.querySelectorAll(containerSelector).forEach((container) => {
		container.querySelectorAll('button').forEach((btn, index) => {
			if (index === 0) {
				firstButtonFunction(); // 첫 번째 버튼 클릭 시 실행될 함수
			} else if (index === 1) {
				secondButtonFunction(); // 두 번째 버튼 클릭 시 실행될 함수
			}
		});
	});
}
