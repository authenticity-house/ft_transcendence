import Mainpage from './pages/Mainpage.js';

export default class App {
	constructor($target) {
		this.$target = $target;
		this.render();
		new Mainpage();
	}

	render() {
		this.$target.innerHTML = `<h1>Hello, World!</h1>`;
	}
}
