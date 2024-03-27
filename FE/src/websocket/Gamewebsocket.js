/* eslint-disable no-void */
import { changeUrlInstance, changeUrlData } from '../index.js';
import { removeModalBackdrop } from '../components/modal/modalUtiils.js';
import { gameSessionInfoMsg } from './websocketUtils.js';
import GamePage from '../pages/GamePage.js';

const { port } = location;

export class Gamewebsocket {
	constructor(initial) {
		this.initial = initial;

		const ws = new WebSocket(`ws://localhost:${port}/ws/game-server/`);
		this.ws = ws;
		this.gamesetting = {};
		this.gamepage = null;
		this.player1Score = null;
		this.player2Score = null;
		this.gameResult = null;
		this.frame = 0;
		this.winner = 0;
		ws.onopen = () => {
			console.log('connected');
			this.receiveMessages();
		};
		this.initializeEventListeners();
	}

	// ---------------------------------------------
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
		const message = JSON.stringify({
			type: 'game',
			subtype: 'key_down',
			message: 'key!',
			match_id: 1,
			data: {
				key_set: Array.from(this.keyDownList)
			}
		});
		this.ws.send(message);
	}

	// --------------------- utils ---------------------
	send(data) {
		console.log(data);
		this.ws.send(JSON.stringify(data));
	}

	close() {
		this.ws.close();
	}

	isOpen() {
		return this.ws.readyState === this.ws.OPEN;
	}

	setGameSetting(data) {
		this.gamesetting = data;
	}

	sendGameDisconnect() {
		const message = {
			type: 'disconnect',
			message: "I'm leaving!"
		};
		this.send(message);
		this.ws.close();
		console.log('disconnected');
	}

	// ----------------------------------------------------------
	// --------------------- game ---------------------
	renderThreeJs(data) {
		this.frame += 1;
		if (Number(this.player1Score.textContent) === this.initial.total_score) {
			this.winner = 1;
		}
		if (Number(this.player2Score.textContent) === this.initial.total_score) {
			this.winner = 2;
		}

		if (this.frame < 100) {
			this.gamepage.camera.position.x = -4;
			this.gamepage.camera.position.y = -1 + (this.frame / 100) * 2;
			this.gamepage.camera.lookAt(this.gamepage.paddleMesh1.position);
		}
		if (this.frame >= 100 && this.frame < 200) {
			this.gamepage.camera.position.x = 4;
			this.gamepage.camera.position.y = 1 - ((this.frame - 100) / 100) * 2;
			this.gamepage.camera.lookAt(this.gamepage.paddleMesh2.position);
		}
		if (this.frame >= 200 && this.frame <= 300) {
			this.gamepage.camera.position.x = 0;
			this.gamepage.camera.position.y = 0;
			this.gamepage.camera.position.z =
				3.5 +
				Math.sin((3 / 2) * Math.PI + ((this.frame - 200) / 100) * Math.PI) *
					(1 / 2);
			this.gamepage.camera.lookAt(0, 0, 0);
			if (this.frame === 200) {
				this.gamepage.scene.children[
					this.gamepage.scene.children.length - 1
				].visible = true;
			}
			if (this.frame >= 275 && this.frame < 300 && this.frame % 4 === 0) {
				this.gamepage.scene.children[
					this.gamepage.scene.children.length - 1
				].visible =
					!this.gamepage.scene.children[this.gamepage.scene.children.length - 1]
						.visible;
			}
			if (this.frame === 300) {
				this.gamepage.scene.children[
					this.gamepage.scene.children.length - 1
				].visible = false;
			}
		}

		// object destructuring
		const { ball: ballData, paddle1, paddle2, score } = data;

		this.gamepage.ballMesh.position.x = ballData.x;
		this.gamepage.ballMesh.position.y = ballData.y;
		this.gamepage.paddleMesh1.position.y = paddle1.y;
		this.gamepage.paddleLightGroup1.position.y = paddle1.y;
		this.gamepage.paddleMesh2.position.y = paddle2.y;
		this.gamepage.paddleLightGroup2.position.y = paddle2.y;

		if (Number(this.player1Score.textContent) !== score.player1) {
			this.player1Score.classList.remove('score_transition');
			void this.player1Score.offsetWidth;
			this.player1Score.textContent = score.player1;
			this.player1Score.classList.add('score_transition');
		}
		if (Number(this.player2Score.textContent) !== score.player2) {
			this.player2Score.classList.remove('score_transition');
			void this.player2Score.offsetWidth;
			this.player2Score.textContent = score.player2;
			this.player2Score.classList.add('score_transition');
		}

		this.gamepage.ballLight.position.copy(this.gamepage.ballMesh.position);

		if (this.winner === 1) {
			this.gamepage.camera.position.x = -4;
			this.gamepage.camera.lookAt(this.gamepage.paddleMesh1.position);
			this.gameResult.style.display = 'block';
		}
		if (this.winner === 2) {
			this.gamepage.camera.position.x = 4;
			this.gamepage.camera.lookAt(this.gamepage.paddleMesh2.position);
			this.gameResult.style.display = 'block';
		}

		this.gamepage.renderer.render(this.gamepage.scene, this.gamepage.camera);
	}

	receiveMessages() {
		this.ws.onmessage = (e) => {
			const message = JSON.parse(e.data);
			this.handleMessage(message);
		};
	}

	handleMessage(message) {
		switch (message.type) {
			case 'game':
				this.handleGameTypeMessage(message);
				break;
			case 'game_over':
				console.log('game over');
				if (message.subtype === 'tournament_tree') {
					// eslint-disable-next-line no-param-reassign
					message.data.Gamewebsocket = this;
					// eslint-disable-next-line no-param-reassign
					message.data.gameOver = true;
					changeUrlData('tournament', message.data);
				}
				break;
			case 'game_over_response':
				// 최종 경기결과 정보 전송
				// eslint-disable-next-line no-param-reassign
				message.data.Gamewebsocket = this;
				changeUrlData('tournamentResult', message.data);
				break;

			default:
				console.log('default');
				break;
		}
	}

	handleGameTypeMessage(message) {
		if (message.subtype === 'connection_established') {
			this.send(gameSessionInfoMsg(this.initial));
		} else if (message.subtype === 'tournament_tree') {
			// eslint-disable-next-line no-param-reassign
			message.data.Gamewebsocket = this;
			changeUrlData('tournament', message.data);
		} else if (message.subtype === 'match_init_setting') {
			this.gamesetting = message.data;
			// eslint-disable-next-line no-param-reassign
			message.data.Gamewebsocket = this;
			this.gamepage = new GamePage(message.data);
			changeUrlInstance('game', this.gamepage);
		} else if (message.subtype === 'match_run') {
			this.renderThreeJs(message.data);
		} else if (message.subtype === 'match_end') {
			console.log('match_end');
			if (this.gamesetting.battle_mode === 1) {
				this.sendGameDisconnect();
			} else {
				// eslint-disable-next-line no-param-reassign
				message.data.Gamewebsocket = this;
			}
			this.frame = 0;
			removeModalBackdrop();
			changeUrlData('duelstats', message.data);
		} else if (message.subtype === 'error') {
			console.log(`server: ${message.message}`);
		}
	}

	addListeners() {
		this.player1Score = document.querySelector('.player1');
		this.player2Score = document.querySelector('.player2');
		this.gameResult = document.querySelector('.game-result');
		this.winner = 0;
	}
}
