// 간단한 예시입니다.

class Header {
	constructor() {
		this.element = document.createElement('header');
		this.element.classList.add('header');
	}

	render() {
		const logo = document.createElement('h1');
		logo.textContent = 'My Website';

		this.element.appendChild(logo);
		document.body.appendChild(this.element);
	}
}

const header = new Header();
header.render();
