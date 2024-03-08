// Shows loading message for 2 seconds
const loadingContainer = document.querySelector('.loading-container');

setTimeout(() => {
	loadingContainer.classList.add('hidden');
}, 1500);
