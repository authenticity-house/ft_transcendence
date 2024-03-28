import { MessageManager } from './MessageManager.js';

export class Gamewebsocket {
	constructor(initial) {
		this.initial = initial;

		const { protocol, hostname, port } = location;

		// 보안 연결(HTTPS)인 경우 wss를, 아니면 ws를 사용
		const wsProtocol = protocol === 'https:' ? 'wss' : 'ws';
		// 포트 번호가 있으면 URL에 포함시키고, 없으면 포트 번호 없이 도메인만 사용
		const wsPort = port ? `:${port}` : '';
		const wsUrl = `${wsProtocol}://${hostname}${wsPort}/ws/game-server/`;

		this.ws = new WebSocket(wsUrl);

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
		const relevantKeys = ['KeyW', 'KeyS', 'ArrowUp', 'ArrowDown'];

		if (
			relevantKeys.includes(event.code) &&
			!this.keyDownList.has(event.code)
		) {
			this.keyDownList.add(event.code);
			this.sendKeySet();
		}
	}

	handleKeyUp(event) {
		if (!this.isOpen()) return;

		if (this.keyDownList.has(event.code)) {
			this.keyDownList.delete(event.code);
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
