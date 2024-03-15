import * as THREE from 'three';
import { FontLoader } from '../../node_modules/three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from '../../node_modules/three/examples/jsm/geometries/TextGeometry.js';

import { changeUrl } from '../index.js';

const html = String.raw;

class GamePage {
	constructor() {
		this.initial = {};
	}

	template(initial) {
		this.initial = initial;
		this.initial.total_score *= 5;

		return html`
			<div
				id="score"
				style="
					display: flex;
					justify-content: center;
					color: white;
					font-size: 48px;
					margin: 10px;
					"
			>
				<div class="player1 score" style="margin-right: 40px">0</div>
				<div>:</div>
				<div class="player2 score" style="margin-left: 40px">0</div>
			</div>
			<div
				class="game-container"
				style="display: flex; justify-content: center"
			></div>
			<div class="result" style="display: flex; justify-content: center"></div>
			<button class="return-button" style="margin: 30px">Return</button>
		`;
	}

	addEventListeners() {
		// const INIT_BALL_SPEED = 0.05;
		// const REFLECT_SPEED = 0.1;
		// const PADDLE_SPEED = 0.07;
		// const WIN_SCORE = '10';

		// // get score element with querySelector
		// const player1Score = document.querySelector('.player1');
		// const player2Score = document.querySelector('.player2');

		// Create a scene
		const scene = new THREE.Scene();
		// GameSetting에서 가져온 값
		scene.background = new THREE.Color(this.initial.color.background);

		// Create a camera
		const camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);

		// Create a renderer
		const renderer = new THREE.WebGLRenderer({
			antialias: true
		});
		renderer.setSize(window.innerWidth / 1.8, window.innerHeight / 1.8);

		// Append the renderer to the game-container
		const gameContainer = document.querySelector('.game-container');
		gameContainer.appendChild(renderer.domElement);

		// create a pong board
		const board = new THREE.BoxGeometry(6, 4, 0.1);
		const edges = new THREE.EdgesGeometry(board);
		const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
		const line = new THREE.LineSegments(edges, lineMaterial);
		const plane = new THREE.PlaneGeometry(6, 4);
		const planeMaterial = new THREE.MeshPhysicalMaterial({
			color: 0x000000,
			metalness: 0.5,
			roughness: 0.5,
			clearcoat: 1,
			clearcoatRoughness: 0.5,
			side: THREE.DoubleSide
		});
		const planeMesh = new THREE.Mesh(plane, planeMaterial);
		planeMesh.position.z = -0.05;
		scene.add(planeMesh);
		scene.add(line);

		// Create a middle line
		const lineDashedMaterial = new THREE.LineDashedMaterial({
			color: 0xffffff,
			dashSize: 0.1,
			gapSize: 0.1
		});
		const points = [];
		points.push(new THREE.Vector3(0, 2, 0));
		points.push(new THREE.Vector3(0, -2, 0));

		const lineDashed = new THREE.Line(
			new THREE.BufferGeometry().setFromPoints(points),
			lineDashedMaterial
		);
		lineDashed.computeLineDistances();
		scene.add(lineDashed);

		// Create a ball
		const ball = new THREE.SphereGeometry(0.04, 32, 32);
		const ballMaterial = new THREE.MeshPhysicalMaterial({
			color: 0xffffff,
			metalness: 0.5,
			roughness: 0.5,
			clearcoat: 1,
			clearcoatRoughness: 0.5,
			side: THREE.DoubleSide,
			emissive: 0xffff00,
			emissiveIntensity: 0.5
		});
		const ballMesh = new THREE.Mesh(ball, ballMaterial);
		scene.add(ballMesh);

		// Create a light emitting from the ball
		const ballLight = new THREE.PointLight(0xffff00, 0.5, 100);
		ballLight.position.set(0, 0, 0);
		scene.add(ballLight);

		// Create a paddle
		const paddle = new THREE.BoxGeometry(0.1, 0.5, 0.1);
		const paddleMaterial = new THREE.MeshPhysicalMaterial({
			color: 0xffffff,
			metalness: 0.5,
			roughness: 0.5,
			clearcoat: 1,
			clearcoatRoughness: 0.5,
			// emissive: 0x0000ff,
			emissive: this.initial.color.paddle,
			emissiveIntensity: 0.5,
			side: THREE.DoubleSide
		});
		const paddleMesh1 = new THREE.Mesh(paddle, paddleMaterial);
		scene.add(paddleMesh1);

		// Create a paddle
		const paddleMesh2 = new THREE.Mesh(paddle, paddleMaterial);
		scene.add(paddleMesh2);

		// Create lights for the paddles
		const paddleLightGroup1 = new THREE.Group();
		const paddleLightGroup2 = new THREE.Group();

		for (
			let i = paddleMesh1.position.y - 0.25;
			i <= paddleMesh1.position.y + 0.25;
			i += 0.1
		) {
			// GameSetting에서 가져온 값
			// const paddleLight = new THREE.PointLight(0x0000ff, 0.1, 100);
			const paddleLight = new THREE.PointLight(
				this.initial.color.paddle,
				0.1,
				100
			);
			paddleLight.position.set(-2.8, i, 0.2);
			paddleLightGroup1.add(paddleLight);
		}

		for (
			let i = paddleMesh2.position.y - 0.25;
			i <= paddleMesh2.position.y + 0.25;
			i += 0.1
		) {
			// GameSetting에서 가져온 값
			// const paddleLight = new THREE.PointLight(0x0000ff, 0.1, 100);
			const paddleLight = new THREE.PointLight(
				this.initial.color.paddle,
				0.1,
				100
			);
			paddleLight.position.set(2.8, i, 0.2);
			paddleLightGroup2.add(paddleLight);
		}

		scene.add(paddleLightGroup1);
		scene.add(paddleLightGroup2);

		// Set the position of the ball
		ballMesh.position.x = 0;
		ballMesh.position.y = 0;
		ballMesh.position.z = -0.01;

		// Set the position of the paddle
		paddleMesh1.position.x = -2.8;

		// Set the position of the paddle
		paddleMesh2.position.x = 2.8;

		// Create a ambientLight
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
		scene.add(ambientLight);

		// Create a pointLight
		const pointLight = new THREE.PointLight(0xffffff, 1, 1000);
		pointLight.position.set(0, 0, 1);
		scene.add(pointLight);

		// Set the camera position
		camera.position.z = 4;

		// Load a font for ready text
		const fontLoader = new FontLoader();

		fontLoader.load('fonts/esamanru_medium.typeface.json', (font) => {
			const textGeometry = new TextGeometry('Ready', {
				font,
				size: 0.4,
				height: 0.1,
				curveSegments: 12,
				bevelEnabled: true,
				bevelThickness: 0.03,
				bevelSize: 0.01,
				bevelOffset: 0,
				bevelSegments: 1
			});
			const textMaterial = new THREE.MeshPhysicalMaterial({
				color: 0xffffff,
				metalness: 0.5,
				roughness: 0.5,
				clearcoat: 1,
				clearcoatRoughness: 0.5,
				emissive: 0xff00ff,
				emissiveIntensity: 0.5
			});
			const textMesh = new THREE.Mesh(textGeometry, textMaterial);
			textMesh.visible = false;
			textMesh.position.x = -0.96;
			textMesh.position.y = -0.13;
			textMesh.position.z = 0.5;
			scene.add(textMesh);
		});

		let frame = 0;

		renderer.render(scene, camera);

		// Resize the window
		window.addEventListener('resize', () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();

			renderer.setSize(window.innerWidth / 1.8, window.innerHeight / 1.8);
		});

		// -------------------------------------------------------------------------------------------------------------------------
		// websocket 통신

		const websocket = new WebSocket('ws://localhost:8000/ws/game-server/');

		function isOpen(ws) {
			return ws.readyState === ws.OPEN;
		}

		websocket.onclose = () => {
			console.log('Disconnected from server');
		};

		websocket.onerror = (error) => {
			console.log(`Error: ${error}`);
		};

		// 게임 서버로 게임 초기 정보 전송
		// function sendGameSessionInfo() {
		const sendGameSessionInfo = () => {
			const message = {
				// type: 'game',
				// subtype: 'session_info',
				// message: '',
				// data: {
				// 	battle_mode: 1,
				// 	total_score: 2,
				// 	level: 2,
				// 	color: {
				// 		paddle: '#FFFFFF',
				// 		background: '#FFFFFF'
				// 	}
				// }
				// data: this.data
				type: 'game',
				subtype: 'session_info',
				message: '',
				data: this.initial
			};
			console.log(
				message.data.total_score,
				message.data.level,
				message.data.color.paddle,
				message.data.color.background
			);
			websocket.send(JSON.stringify(message));
		};

		// 게임 서버로 매치 시작 요청 전송
		function sendGameStartRequest() {
			const message = {
				type: 'game',
				subtype: 'match_start',
				message: 'go!',
				data: '',
				match_id: 123
			};
			websocket.send(JSON.stringify(message));
		}

		const player1Score = document.querySelector('.player1');
		const player2Score = document.querySelector('.player2');

		// 화면 렌더링
		function renderThreeJs(data) {
			frame += 1;

			// if (winner === 1) {
			// 	camera.lookAt(paddleMesh1.position);
			// }
			// if (winner === 2) {
			// 	camera.lookAt(paddleMesh2.position);
			// }

			// Camera movement
			if (frame < 100) {
				camera.position.x = -4;
				camera.position.y = -1 + (frame / 100) * 2;
				camera.lookAt(paddleMesh1.position);
			}
			if (frame >= 100 && frame < 200) {
				camera.position.x = 4;
				camera.position.y = 1 - ((frame - 100) / 100) * 2;
				camera.lookAt(paddleMesh2.position);
			}
			if (frame >= 200 && frame <= 300) {
				camera.position.x = 0;
				camera.position.y = 0;
				camera.position.z =
					3.5 +
					Math.sin((3 / 2) * Math.PI + ((frame - 200) / 100) * Math.PI) *
						(1 / 2);
				camera.lookAt(0, 0, 0);
				if (frame === 200) {
					scene.children[scene.children.length - 1].visible = true;
				}
				if (frame >= 275 && frame < 300 && frame % 4 === 0) {
					scene.children[scene.children.length - 1].visible =
						!scene.children[scene.children.length - 1].visible;
				}
				if (frame === 300) {
					scene.children[scene.children.length - 1].visible = false;
					// ballSpeed = INIT_BALL_SPEED;
					// direction.x = Math.cos(seed) * ballSpeed;
					// direction.y = Math.sin(seed) * ballSpeed;
				}
			}

			// object destructuring
			const { ball: ballData, paddle1, paddle2, score } = data;

			ballMesh.position.x = ballData.x;
			ballMesh.position.y = ballData.y;
			paddleMesh1.position.y = paddle1.y;
			paddleLightGroup1.position.y = paddle1.y;
			paddleMesh2.position.y = paddle2.y;
			paddleLightGroup2.position.y = paddle2.y;

			player1Score.textContent = score.player1;
			player2Score.textContent = score.player2;

			ballLight.position.copy(ballMesh.position);

			renderer.render(scene, camera);
		}

		// 사용자 키 입력 이벤트리스너 등록

		const keyDownList = new Set();
		document.addEventListener('keydown', (event) => {
			if (isOpen(websocket)) {
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
					websocket.send(message);
				}
			}
		});

		document.addEventListener('keyup', (event) => {
			if (isOpen(websocket)) {
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
					websocket.send(message);
				}
			}
		});

		async function receiveMessages() {
			websocket.onmessage = (event) => {
				const message = JSON.parse(event.data);
				switch (message.type) {
					// case 'connection_established':
					// 	sendGameSessionInfo();
					// 	break;

					case 'game':
						if (message.subtype === 'connection_established') {
							sendGameSessionInfo();
						} else if (message.subtype === 'match_init_setting') {
							sendGameStartRequest();
						} else if (message.subtype === 'match_run') {
							renderThreeJs(message.data);
						} else if (message.subtype === 'match_end') {
							console.log('match_end');
							const disconnectMessage = {
								type: 'disconnect',
								message: 'plz!'
							};
							player1Score.textContent = message.data.player1.score;
							player2Score.textContent = message.data.player2.score;
							websocket.send(JSON.stringify(disconnectMessage));
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

		websocket.onopen = () => {
			console.log('Connected to server');
			Promise.all([receiveMessages()]);
		};

		// -------------------------------------------------------------------------------------------------------------------------
		// Return to the main page
		const returnButton = document.querySelector('.return-button');
		returnButton.addEventListener('click', () => {
			changeUrl('');
		});
	}
}

export default new GamePage();
