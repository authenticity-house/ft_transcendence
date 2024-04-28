import { MessageManager } from './MessageManager.js';
import { getWebsocketUrl } from '../utils/getWebsocketUrl.js';

export class Gamewebsocket {
	constructor(initial) {
		this.initial = initial;

		this.url = typeof this.initial === 'object' ? '/game-server/' : initial;
		this.ws = new WebSocket(getWebsocketUrl(this.url));

		this.messageManager = new MessageManager(this);

		this.gamesetting = {};
		this.player1Score = null;
		this.player2Score = null;
		this.gameResult = null;
		this.winner = 0;
		this.keyDownList = new Set();

		this.ws.onopen = () => {
			console.log('connected');
			this.receiveMessages();
		};

		this.initializeEventListeners();
	}

	setupInputMapping(type) {
		if (type === 'left') {
			this.inputMapping = {
				ArrowUp: 'KeyW',
				ArrowDown: 'KeyS'
			};
		} else if (type === 'right') {
			this.inputMapping = {
				KeyW: 'ArrowUp',
				KeyS: 'ArrowDown'
			};
		} else {
			this.inputMapping = {};
		}
	}
	// -----------------------------------------------------------------------------

	send(message) {
		this.ws.send(JSON.stringify(message));
	}

	close() {
		this.ws.close();
	}

	isOpen() {
		return this.ws.readyState === this.ws.OPEN;
	}

	// -----------------------------------------------------------------------------

	initializeEventListeners() {
		document.addEventListener('keydown', (event) => this.handleKeyDown(event));
		document.addEventListener('keyup', (event) => this.handleKeyUp(event));
	}

	handleKeyDown(event) {
		if (!this.isOpen()) return;

		let eventCode = event.code;

		if (this.inputMapping[eventCode]) {
			eventCode = this.inputMapping[eventCode];
		}

		const relevantKeys = ['KeyW', 'KeyS', 'ArrowUp', 'ArrowDown'];

		if (relevantKeys.includes(eventCode) && !this.keyDownList.has(eventCode)) {
			this.keyDownList.add(eventCode);
			this.sendKeySet();
		}
	}

	handleKeyUp(event) {
		if (!this.isOpen()) return;

		let eventCode = event.code;

		if (this.inputMapping[eventCode]) {
			eventCode = this.inputMapping[eventCode];
		}

		if (this.keyDownList.has(eventCode)) {
			this.keyDownList.delete(eventCode);
			this.sendKeySet();
		}
	}

	sendKeySet() {
		const message = {
			type: 'game',
			subtype: 'key_down',
			message: 'key!',
			match_id: 1,
			data: {
				key_set: Array.from(this.keyDownList)
			}
		};
		this.send(message);
	}

	// -----------------------------------------------------------------------------
	receiveMessages() {
		this.ws.onmessage = (e) => {
			const message = JSON.parse(e.data);
			this.messageManager.handleMessage(message);
		};
	}
}
