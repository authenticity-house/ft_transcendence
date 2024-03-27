/* eslint-disable no-void */
// import { changeUrlInstance, changeUrlData } from '../index.js';
// import { removeModalBackdrop } from '../components/modal/modalUtiils.js';
// import { gameSessionInfoMsg } from './messages.js';
// import GamePage from '../pages/GamePage.js';
import { MessageManager } from './MessageManager.js';

const { port } = location;

export class Gamewebsocket {
	constructor(initial) {
		this.initial = initial;

		this.ws = new WebSocket(`ws://localhost:${port}/ws/game-server/`);
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

	// ---------------------------------------------

	send(message) {
		this.ws.send(JSON.stringify(message));
	}

	close() {
		console.log('close');
		this.ws.close();
	}

	isOpen() {
		return this.ws.readyState === this.ws.OPEN;
	}

	setGameSetting(data) {
		this.gamesetting = data;
	}

	// -------------------------------------------------

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

	addListeners() {
		this.player1Score = document.querySelector('.player1');
		this.player2Score = document.querySelector('.player2');
		this.gameResult = document.querySelector('.game-result');
		this.winner = 0;
	}
}
