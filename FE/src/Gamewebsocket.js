/* eslint-disable no-void */

import { changeUrlData } from './index.js';

export class Gamewebsocket {
	constructor(gamepage) {
		console.log('Gamewebsocket created');
		this.gamepage = gamepage;

		const ws = new WebSocket('ws://localhost:8000/ws/game-server/');
		this.ws = ws;
		this.frame = 0;
		this.player1Score = document.querySelector('.player1');
		this.player2Score = document.querySelector('.player2');
		this.gameResult = document.querySelector('.game-result');
		this.winner = 0;

		const keyDownList = new Set();
		document.addEventListener('keydown', (event) => {
			if (this.isOpen(ws)) {
				let isChange = false;

				if (
					['KeyW', 'KeyS', 'ArrowUp', 'ArrowDown'].includes(event.code) &&
					!keyDownList.has(event.code)
				) {
					keyDownList.add(event.code);
					isChange = true;
				}

				if (isChange) {
					const message = JSON.stringify({
						type: 'game',
						subtype: 'key_down',
						message: 'key!',
						match_id: 1,
						data: {
							key_set: Array.from(keyDownList)
						}
					});
					ws.send(message);
				}
			}
		});

		document.addEventListener('keyup', (event) => {
			if (this.isOpen(ws)) {
				let isChange = false;

				if (keyDownList.has(event.code)) {
					keyDownList.delete(event.code);
					isChange = true;
				}

				if (isChange) {
					const message = JSON.stringify({
						type: 'game',
						subtype: 'key_down',
						message: 'key!',
						match_id: 1,
						data: {
							key_set: Array.from(keyDownList)
						}
					});
					ws.send(message);
				}
			}
		});

		ws.onopen = () => {
			console.log('connected');
			this.receiveMessages();
		};
	}

	// --------------------- utils ---------------------
	send(data) {
		this.ws.send(data);
	}

	close() {
		this.ws.close();
	}

	isOpen(ws) {
		return ws.readyState === ws.OPEN;
	}

	sendGameSessionInfo() {
		const message = {
			type: 'game',
			subtype: 'session_info',
			message: '',
			data: this.gamepage.initial
		};
		this.ws.send(JSON.stringify(message));
	}

	// --------------------- game ---------------------
	sendGameStartRequest(data) {
		const { color } = data;

		function changePaddleLightColor(paddleLightGroup, paddleColor) {
			paddleLightGroup.children.forEach((paddleLight) => {
				paddleLight.color.set(paddleColor);
			});
		}

		this.gamepage.paddleMesh1.material.emissive.set(color.paddle);
		this.gamepage.paddleMesh2.material.emissive.set(color.paddle);
		changePaddleLightColor(this.gamepage.paddleLightGroup1, color.paddle);
		changePaddleLightColor(this.gamepage.paddleLightGroup2, color.paddle);

		this.gamepage.ballMesh.material.emissive.set(color.ball);
		this.gamepage.ballLight.color.set(color.ball);

		const player1Name = document.querySelector('.player1-name');
		const player2Name = document.querySelector('.player2-name');

		player1Name.textContent = data.nickname.player1;
		player2Name.textContent = data.nickname.player2;

		const message = {
			type: 'game',
			subtype: 'match_start',
			message: 'go!',
			data: '',
			match_id: 123
		};
		this.ws.send(JSON.stringify(message));
	}

	renderThreeJs(data) {
		this.frame += 1;
		if (
			Number(this.player1Score.textContent) ===
			this.gamepage.initial.total_score
		) {
			this.winner = 1;
		}
		if (
			Number(this.player2Score.textContent) ===
			this.gamepage.initial.total_score
		) {
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
			switch (message.type) {
				case 'game':
					if (message.subtype === 'connection_established') {
						this.sendGameSessionInfo();
					} else if (message.subtype === 'match_init_setting') {
						this.sendGameStartRequest(message.data);
					} else if (message.subtype === 'match_run') {
						this.renderThreeJs(message.data);
					} else if (message.subtype === 'match_end') {
						console.log('match_end');
						const disconnectMessage = {
							type: 'disconnect',
							message: 'plz!'
						};
						this.player1Score.textContent = message.data.player1.score;
						this.player2Score.textContent = message.data.player2.score;
						this.ws.send(JSON.stringify(disconnectMessage));
						changeUrlData('duelstats', message.data);
					} else if (message.subtype === 'error') {
						console.log(`server: ${message.message}`);
					}
					break;
				default:
					console.log('default');
					break;
			}
		};
	}
}
