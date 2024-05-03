import { changeUrl } from '../../index.js';

export function removeModalBackdrop() {
	const backdrop = document.querySelector('.modal-backdrop');
	if (backdrop) {
		backdrop.parentNode.removeChild(backdrop);
	}
}

export function hideModal(element, callback) {
	const modalElement = document.getElementById(element);

	// eslint-disable-next-line no-undef
	const bsModal = bootstrap.Modal.getInstance(modalElement);
	if (bsModal) {
		// eslint-disable-next-line no-underscore-dangle
		bsModal._element.addEventListener(
			'hidden.bs.modal',
			function onModalHidden() {
				// eslint-disable-next-line no-underscore-dangle
				bsModal._element.removeEventListener('hidden.bs.modal', onModalHidden);

				if (callback) callback();
			}
		);
		bsModal.hide();
	} else if (callback) {
		callback();
	}
}

function handleBackHomeClick(event) {
	const idToUrl = {
		'back-home-button': '',
		'back-list-button': 'onlineMainScreen',
		'back-online-button': 'onlineMainScreen'
	};

	const url = idToUrl[event.target.id];
	if (url !== undefined) {
		removeModalBackdrop();
		changeUrl(url);
		document.removeEventListener('click', handleBackHomeClick);
	}
}

// 모달 띄운 후 홈으로 돌아가기 버튼 누르면 홈으로 돌아감
export function showModal(element) {
	const modalElement = document.getElementById(element);

	// eslint-disable-next-line no-undef
	let bsModal = bootstrap.Modal.getInstance(modalElement);

	if (!bsModal) {
		// eslint-disable-next-line no-undef
		bsModal = new bootstrap.Modal(modalElement);
	}
	bsModal.show();

	document.addEventListener('click', handleBackHomeClick);
}

export function updateModalContent(id, newContent) {
	const contentElement = document.getElementById(id);
	if (contentElement) {
		contentElement.innerHTML = newContent;
	}
}

// 모달 업데이트 및 표시
export function showModalWithContent(modalId, contentId, content) {
	updateModalContent(contentId, content);
	showModal(modalId);
}
