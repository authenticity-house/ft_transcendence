import { changeUrlInstance, changeUrlData } from '../index.js';
import { removeModalBackdrop } from '../components/modal/modalUtiils.js';
import GamePage from '../pages/GamePage.js';

import * as msg from './messages.js';
import { MessageType, SubType, Winner } from './constWebsocket.js';

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

	// -----------------------------------------------------------------------------

	resetGameData() {
		this.player1Score = document.querySelector('.player1');
		this.player2Score = document.querySelector('.player2');
		this.gameResult = document.querySelector('.game-result');
		this.frame = 0;
		this.winner = 0;
	}

	// -----------------------------------------------------------------------------

	setGameSetting(data) {
		this.gamesetting = data;
	}

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
		this.websocket.send(msg.gameDisconnectMsg());
		this.websocket.close();
		console.log('disconnected');
	}

	// -----------------------------------------------------------------------------

	setPositionAndLookAt(x, y, lookAtPosition) {
		this.gamepage.camera.position.set(x, y, this.gamepage.camera.position.z);
		this.gamepage.camera.lookAt(lookAtPosition);
	}

	updateCameraPosition() {
		// Player 1
		if (this.frame < 100) {
			this.setPositionAndLookAt(
				-4,
				-1 + (this.frame / 100) * 2,
				this.gamepage.paddleMesh1.position
			);
		}
		// Player 2
		else if (this.frame >= 100 && this.frame < 200) {
			this.setPositionAndLookAt(
				4,
				1 - ((this.frame - 100) / 100) * 2,
				this.gamepage.paddleMesh2.position
			);
		}
		// Ready
		else if (this.frame >= 200 && this.frame <= 300) {
			this.gamepage.camera.position.set(
				0,
				0,
				3.5 +
					Math.sin((3 / 2) * Math.PI + ((this.frame - 200) / 100) * Math.PI) *
						(1 / 2)
			);
			this.gamepage.camera.lookAt(0, 0, 0);

			this.toggleFinalAnimation();
		}
	}

	toggleFinalAnimation() {
		const lastChild =
			this.gamepage.scene.children[this.gamepage.scene.children.length - 1];

		if (this.frame === 200) lastChild.visible = true;
		if (this.frame >= 275 && this.frame < 300 && this.frame % 4 === 0)
			lastChild.visible = !lastChild.visible;
		if (this.frame === 300) lastChild.visible = false;
	}

	// -----------------------------------------------------------------------------

	checkWinner() {
		const finalScore = this.websocket.initial.total_score;

		if (Number(this.player1Score.textContent) === finalScore)
			this.winner = Winner.PLAYER_1;
		if (Number(this.player2Score.textContent) === finalScore)
			this.winner = Winner.PLAYER_2;
	}

	// -----------------------------------------------------------------------------

	updateScores(score) {
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
	}

	displayWinner() {
		const winnerPosition = this.winner === Winner.PLAYER_1 ? -4 : 4;
		const targetPaddle =
			this.winner === Winner.PLAYER_1
				? this.gamepage.paddleMesh1
				: this.gamepage.paddleMesh2;

		this.gamepage.camera.position.x = winnerPosition;
		this.gamepage.camera.lookAt(targetPaddle.position);
		this.gameResult.style.display = 'block';
	}

	// -----------------------------------------------------------------------------

	renderThreeJs(data) {
		this.frame += 1;

		this.updateCameraPosition();
		this.checkWinner();

		// object destructuring
		const { ball, paddle1, paddle2, score } = data;

		this.gamepage.ballMesh.position.x = ball.x;
		this.gamepage.ballMesh.position.y = ball.y;
		this.gamepage.paddleMesh1.position.y = paddle1.y;
		this.gamepage.paddleLightGroup1.position.y = paddle1.y;
		this.gamepage.paddleMesh2.position.y = paddle2.y;
		this.gamepage.paddleLightGroup2.position.y = paddle2.y;
		this.gamepage.ballLight.position.copy(this.gamepage.ballMesh.position);

		this.updateScores(score);
		this.displayWinner();

		this.gamepage.renderer.render(this.gamepage.scene, this.gamepage.camera);
	}

	// =============================================================================

	handleMessage(message) {
		switch (message.type) {
			case MessageType.GAME:
				this.handleGameTypeMessage(message);
				break;

			case MessageType.GAME_OVER:
				console.log('game over');
				if (message.subtype === SubType.TOURNAMENT_TREE) {
					// 최종 대진표
					changeUrlData('tournament', {
						...message.data,
						sendMsg: this.sendGameOver.bind(this)
					});
				}
				break;

			case MessageType.GAME_OVER_RESPONSE:
				// 최종 경기결과
				changeUrlData('tournamentResult', {
					content: message.data,
					sendMsg: this.sendGameDisconnect.bind(this)
				});
				break;

			default:
				console.log('default');
				break;
		}
	}

	// -----------------------------------------------------------------------------

	handleGameTypeMessage(message) {
		switch (message.subtype) {
			case SubType.CONNECTION_ESTABLISHED:
				// 게임 초기 정보 전송
				this.sendGameSessionInfo(this.websocket.initial);
				break;
			case SubType.TOURNAMENT_TREE:
				// 대진표 출력 및 게임 매치 초기화 요청
				changeUrlData('tournament', {
					...message.data,
					sendMsg: this.sendGameMatchInitSetting.bind(this)
				});
				break;
			case SubType.MATCH_INIT_SETTING:
				// 매치 초기화 정보 저장
				this.setGameSetting(message.data);
				// 게임 페이지 생성 및 실행
				this.gamepage = new GamePage({
					...message.data,
					sendMsg: this.sendGameDisconnect.bind(this)
				});
				changeUrlInstance('game', this.gamepage);

				this.resetGameData(); // score 정보 초기화
				this.sendGameStartRequest(); // 게임 시작 요청
				break;
			case SubType.MATCH_RUN:
				// 수신한 매치 데이터로 rendering
				this.renderThreeJs(message.data);
				break;
			case SubType.MATCH_END:
				console.log('match_end');
				removeModalBackdrop(); // modal-fade 비활성화

				// 1vs1 대전의 경우 disconnect
				if (this.gamesetting.battle_mode === 1)
					changeUrlData('duelstats', {
						...message.data,
						sendMsg: this.sendGameDisconnect.bind(this)
					});
				// 토너먼트의 경우 다음 매치 요청
				else
					changeUrlData('duelstats', {
						...message.data,
						sendMsg: this.sendGameNextMatch.bind(this)
					});

				break;
			case SubType.ERROR:
				console.log(`server: ${message.message}`);
				break;
			default:
				console.log('default');
				break;
		}
	}
}
