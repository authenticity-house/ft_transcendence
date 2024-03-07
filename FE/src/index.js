const root = document.getElementById('root');

// Create a new element
const h1 = document.createElement('h1');
h1.textContent = 'Hello World!';
root.appendChild(h1);

// Create a new element
const p = document.createElement('p');
p.textContent = 'This is a paragraph.';
root.appendChild(p);

// Create a new element
const button = document.createElement('button');
button.textContent = 'Click me!';
root.appendChild(button);

// Shows loading message for 2 seconds
const loadingContainer = document.querySelector('.loading-container');

setTimeout(() => {
	loadingContainer.classList.add('hidden');
}, 1500);

function showLoading() {
	loadingContainer.classList.remove('hidden');
	setTimeout(() => {
		loadingContainer.classList.add('hidden');
	}, 1500);
}

button.addEventListener('click', showLoading);
