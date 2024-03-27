import { changeUrlInstance, changeUrlData } from '../index.js';
import { removeModalBackdrop } from '../components/modal/modalUtiils.js';

import * as msg from './messages.js';

import GamePage from '../pages/GamePage.js';

export class MessageManager {
	constructor(websocket) {
		this.websocket = websocket;

		this.gamesetting = {};
		this.gamepage = null;
		this.player1Score = null;
		this.player2Score = null;
		this.gameResult = null;
		this.frame = 0;
		this.winner = 0;
	}

	// ----------------------------------------------------------
	sendGameSessionInfo(data) {
		this.websocket.send(msg.gameSessionInfoMsg(data));
	}

	sendGameMatchInitSetting() {
		this.websocket.send(msg.gameMatchInitSettingMsg());
	}

	sendGameStartRequest() {
		this.websocket.send(msg.gameStartRequestMsg());
	}

	sendGameNextMatch() {
		this.websocket.send(msg.gameNextMatchMsg());
	}

	sendGameOver() {
		this.websocket.send(msg.gameOverMsg());
	}

	sendGameDisconnect() {
		const message = {
			type: 'disconnect',
			message: "I'm leaving!"
		};
		this.websocket.send(message);
		this.websocket.close();
		console.log('disconnected');
	}

	// ----------------------------------------------------------
	renderThreeJs(data) {
		this.frame += 1;
		if (
			Number(this.player1Score.textContent) ===
			this.websocket.initial.total_score
		) {
			this.winner = 1;
		}
		if (
			Number(this.player2Score.textContent) ===
			this.websocket.initial.total_score
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
			// eslint-disable-next-line no-void
			void this.player1Score.offsetWidth;
			this.player1Score.textContent = score.player1;
			this.player1Score.classList.add('score_transition');
		}
		if (Number(this.player2Score.textContent) !== score.player2) {
			this.player2Score.classList.remove('score_transition');
			// eslint-disable-next-line no-void
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

	addListeners() {
		this.player1Score = document.querySelector('.player1');
		this.player2Score = document.querySelector('.player2');
		this.gameResult = document.querySelector('.game-result');
		this.winner = 0;
	}

	// ----------------------------------------------------------

	handleMessage(message) {
		switch (message.type) {
			case 'game':
				this.handleGameTypeMessage(message);
				break;

			case 'game_over':
				console.log('game over');
				if (message.subtype === 'tournament_tree') {
					// 최종 대진표
					changeUrlData('tournament', {
						...message.data,
						sendMsg: this.sendGameOver.bind(this)
					});
				}
				break;
			case 'game_over_response':
				// 최종 경기결과 정보
				{
					const tmpData = {
						content: message.data,
						sendMsg: this.sendGameDisconnect.bind(this)
					};
					changeUrlData('tournamentResult', tmpData);
				}
				break;

			default:
				console.log('default');
				break;
		}
	}

	handleGameTypeMessage(message) {
		if (message.subtype === 'connection_established') {
			// 게임 초기 정보 전송
			this.sendGameSessionInfo(this.websocket.initial);
		} else if (message.subtype === 'tournament_tree') {
			// 대진표 출력 및 게임 매치 초기화 요청
			changeUrlData('tournament', {
				...message.data,
				sendMsg: this.sendGameMatchInitSetting.bind(this)
			});
		} else if (message.subtype === 'match_init_setting') {
			// 매치 초기화 정보 수신
			this.gamesetting = message.data;

			// 게임 페이지 생성 및 실행
			this.gamepage = new GamePage({
				...message.data,
				sendMsg: this.sendGameDisconnect.bind(this)
			});
			changeUrlInstance('game', this.gamepage);

			// score 정보 초기화
			this.addListeners();
			// 게임 시작 요청
			this.sendGameStartRequest();
		} else if (message.subtype === 'match_run') {
			// 매치 데이터 수신으로 rendering
			this.renderThreeJs(message.data);
		} else if (message.subtype === 'match_end') {
			console.log('match_end');
			this.frame = 0;
			removeModalBackdrop(); // modal-fade 비활성화

			// 1vs1 대전의 경우 disconnect 후 경기결과
			if (this.gamesetting.battle_mode === 1) {
				this.sendGameDisconnect();
				changeUrlData('duelstats', message.data);
			}
			// 토너먼트의 경우 경기결과 출력 후 다음 매치 요청
			else {
				changeUrlData('duelstats', {
					...message.data,
					sendMsg: this.sendGameNextMatch.bind(this)
				});
			}
		} else if (message.subtype === 'error') {
			console.log(`server: ${message.message}`);
		}
	}
}
