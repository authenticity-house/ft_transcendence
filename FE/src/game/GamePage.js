import * as THREE from 'three';
import { FontLoader } from '../../node_modules/three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from '../../node_modules/three/examples/jsm/geometries/TextGeometry.js';

import { changeUrl } from '../index.js';
import { exitModal } from '../components/modal/exitModal.js';
import * as utils from './gamePageUtils.js';

const html = String.raw;

class GamePage {
	constructor(initial) {
		this.initial = initial;

		this.scene = null;
		this.camera = null;
		this.renderer = null;
		this.ballMesh = null;
		this.ballLight = null;
		this.paddleMesh1 = null;
		this.paddleMesh2 = null;
		this.paddleLightGroup1 = null;
		this.paddleLightGroup2 = null;
	}

	template() {
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
			${exitModal()}
		`;
	}

	init() {
		this.scene = utils.setupScene();
		this.camera = utils.createCamera();
		this.renderer = utils.createRenderer();

		this.createObjects();

		this.renderer.render(this.scene, this.camera);

		document.addEventListener('resize', this.handleResize);
	}

	addToScene(func) {
		const result = func();
		this.scene.add(result);
		return result;
	}

	createObjects() {
		this.addToScene(utils.addAmbientLight);
		this.addToScene(utils.addPointLights);

		this.addToScene(utils.createBoardLine);
		this.addToScene(utils.createBoardPlane);
		this.addToScene(utils.createDashedLine);

		this.ballMesh = this.addToScene(() => utils.createBall(this.initial));
		this.ballLight = this.addToScene(() =>
			utils.createBallLight(this.initial, this.ballMesh)
		);

		this.paddleMesh1 = this.addToScene(() => utils.createPaddle(this.initial));
		this.paddleMesh2 = this.addToScene(() => utils.createPaddle(this.initial));

		this.paddleLightGroup1 = this.addToScene(() =>
			utils.createPaddleLight(this.paddleMesh1, this.initial, 'left')
		);
		this.paddleLightGroup2 = this.addToScene(() =>
			utils.createPaddleLight(this.paddleMesh2, this.initial, 'right')
		);

		this.createReadyText();

		this.setPositions();
		this.setNicknames();
	}

	// --------------------------------------------------------------------------------
	createReadyText() {
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
			textMesh.name = 'readyText';

			this.scene.add(textMesh);
		});
	}

	setPositions() {
		this.ballMesh.position.set(this.initial.ball.x, this.initial.ball.y, -0.01);
		this.paddleMesh1.position.set(
			this.initial.paddle1.x,
			this.initial.paddle1.y
		);
		this.paddleMesh2.position.set(
			this.initial.paddle2.x,
			this.initial.paddle2.y
		);
	}

	setNicknames() {
		document.querySelector('.player1-name').textContent =
			this.initial.nickname.player1;
		document.querySelector('.player2-name').textContent =
			this.initial.nickname.player2;
	}

	// --------------------------------------------------------------------------------

	handleResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth / 1.8, window.innerHeight / 1.8);
	}

	addEventListeners() {
		this.init();

		const returnButton = document.querySelector('.return-button');
		returnButton.addEventListener('click', () => {
			this.initial.sendMsg();

			console.log('match_end');

			changeUrl('matchMode'); // local
			// online
		});
	}
}

export default GamePage;
