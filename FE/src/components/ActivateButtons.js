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

// export function ActivateButtons(containerSelector, gameSetting) {
//	document.querySelectorAll(containerSelector).forEach((container, index) => {
//		container.querySelectorAll('button').forEach((btn, btnIndex) => {
//			btn.addEventListener('click', (event) => {
//				const clickedBtn = event.target;
//				container.querySelectorAll('button').forEach((innerBtn) => {
//					innerBtn.classList.remove('selected');
//				});
//				clickedBtn.classList.add('selected');
//				// 승점 또는 난이도 설정에 따라 index 업데이트
//				if (index === 0) {
//					gameSetting.score = String(btnIndex + 1); // 인덱스는 0부터 시작하므로 1을 더함
//				} else if (index === 1) {
//					gameSetting.level = String(btnIndex + 1);
//				}
//			});
//		});
//	});
// }
