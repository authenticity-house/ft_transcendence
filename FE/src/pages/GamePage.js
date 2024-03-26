/* eslint-disable no-void */

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
		console.log(initial);

		return html`
			<div class="game-page-container">
				<div class="game-page-container">
					<div class="game-header">
						<div class="player1-name display-light32"></div>
						<div class="score-container display-medium48">
							<div class="player1">0</div>
							<div>:</div>
							<div class="player2">0</div>
						</div>
						<div class="player2-name display-light32"></div>
					</div>
					<div
						class="game-container"
						style="position: relative; display: flex; justify-content: center"
					>
						<div class="game-result display-medium48 pink_neon_10">Winner!</div>
					</div>
				</div>
				<!-- 나가기 버튼 -->
				<button
					type="button"
					class="button-small"
					data-bs-toggle="modal"
					data-bs-target="#staticBackdrop"
				>
					나가기
				</button>
			</div>
			<!-- 나가기 모달 -->
			<div
				class="modal fade"
				id="staticBackdrop"
				data-bs-backdrop="static"
				data-bs-keyboard="false"
				tabindex="-1"
				aria-labelledby="staticBackdropLabel"
				aria-hidden="true"
			>
				<div class="modal-dialog modal-dialog-centered">
					<div class="modal-content modal-content-style">
						<div class="modal-body">
							<div class="display-light28 modal-content-body-text">
								게임이 진행중입니다.<br />정말로 나가시겠습니까?
							</div>
							<div class="horizontal-button-container">
								<button
									type="button"
									class="button-x-small return-button"
									data-bs-dismiss="modal"
								>
									나가기
								</button>
								<button
									type="button"
									class="button-x-small"
									data-bs-dismiss="modal"
								>
									돌아가기
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		`;
	}

	addEventListeners() {
		// ---------------------------------------------------------------
		// Create a scene
		const scene = new THREE.Scene();
		scene.background = new THREE.Color(0x141343);

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
		// ---------------------------------------------------------------
		// ----------------------------- ball ----------------------------
		// Create a ball
		const ball = new THREE.SphereGeometry(0.04, 32, 32);
		const ballMaterial = new THREE.MeshPhysicalMaterial({
			color: 0xffffff,
			metalness: 0.5,
			roughness: 0.5,
			clearcoat: 1,
			clearcoatRoughness: 0.5,
			side: THREE.DoubleSide,
			emissive: this.initial.color.ball,
			emissiveIntensity: 0.5
		});
		const ballMesh = new THREE.Mesh(ball, ballMaterial);
		scene.add(ballMesh);

		// Create a light emitting from the ball
		const ballLight = new THREE.PointLight(this.initial.color.ball, 0.3, 100);
		ballLight.position.set(0, 0, 0);
		scene.add(ballLight);

		// --------------------- paddle -------------------------
		// Create a paddle
		const paddle = new THREE.BoxGeometry(
			this.initial.paddle1.width,
			this.initial.paddle1.height,
			0.1
		);
		const paddleMaterial = new THREE.MeshPhysicalMaterial({
			color: 0xffffff,
			metalness: 0.5,
			roughness: 0.5,
			clearcoat: 1,
			clearcoatRoughness: 0.5,
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

		function addPaddleLights(paddleMesh, paddleLightGroup) {
			for (
				let i = paddleMesh.position.y - 0.25;
				i <= paddleMesh.position.y + 0.25;
				i += 0.1
			) {
				const paddleLight = new THREE.PointLight(
					this.initial.color.paddle,
					0.1,
					100
				);
				paddleLight.position.set(
					paddleMesh === paddleMesh1 ? -2.8 : 2.8,
					i,
					0.2
				);
				paddleLightGroup.add(paddleLight);
			}
		}

		addPaddleLights.bind(this)(paddleMesh1, paddleLightGroup1);
		addPaddleLights.bind(this)(paddleMesh2, paddleLightGroup2);

		scene.add(paddleLightGroup1);
		scene.add(paddleLightGroup2);

		// -----------------------------------------------------------
		// -------------- 게임 서버에서 받아온 정보로 세팅 -------------------
		// Set the position of the ball
		ballMesh.position.x = this.initial.ball.x;
		ballMesh.position.y = this.initial.ball.y;
		ballMesh.position.z = -0.01;

		// Set the position of the paddle
		paddleMesh1.position.x = this.initial.paddle1.x;
		paddleMesh1.position.y = this.initial.paddle1.y;

		// Set the position of the paddle
		paddleMesh2.position.x = this.initial.paddle2.x;
		paddleMesh2.position.y = this.initial.paddle2.y;

		// Create a ambientLight
		const ambientLight = new THREE.AmbientLight(0xffffff, 2);
		scene.add(ambientLight);

		// Create a pointLight
		const pointLight = new THREE.PointLight(0xffffff, 1, 1000);
		pointLight.position.set(0, 0, 1);
		scene.add(pointLight);

		// Set the camera position
		camera.position.z = 4;
		// 닉네임 세팅
		const player1Name = document.querySelector('.player1-name');
		const player2Name = document.querySelector('.player2-name');

		player1Name.textContent = this.initial.nickname.player1;
		player2Name.textContent = this.initial.nickname.player2;

		// ---------------------------------------------------------------
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
		// ---------------------------------------------------------------
		renderer.render(scene, camera);

		this.camera = camera;
		this.scene = scene;
		this.renderer = renderer;
		this.paddleMesh1 = paddleMesh1;
		this.paddleMesh2 = paddleMesh2;
		this.paddleLightGroup1 = paddleLightGroup1;
		this.paddleLightGroup2 = paddleLightGroup2;
		this.ballMesh = ballMesh;
		this.ballLight = ballLight;

		// Resize the window
		window.addEventListener('resize', () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();

			renderer.setSize(window.innerWidth / 1.8, window.innerHeight / 1.8);
		});

		this.initial.Gamewebsocket.gamepage = this;

		this.initial.Gamewebsocket.addListeners();

		this.initial.Gamewebsocket.sendGameStartRequest();

		// -------------------------------------------------------------------------------------------------------------------------
		// Return to the main page

		const returnButton = document.querySelector('.return-button');
		returnButton.addEventListener('click', () => {
			this.initial.Gamewebsocket.sendGameDisconnect();
			// this.initial.Gamewebsocket.close();
			console.log('match_end');
			changeUrl('match');
		});
	}
}

export default new GamePage();
