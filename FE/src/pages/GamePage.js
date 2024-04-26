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

	addToScene(func) {
		const result = func();
		if (Array.isArray(result)) {
			result.forEach((obj) => this.scene.add(obj));
		} else {
			this.scene.add(result);
		}
		return result;
	}

	init() {
		this.scene = utils.setupScene();
		this.camera = utils.createCamera();
		this.renderer = utils.createRenderer();

		this.createObjects();

		this.renderer.render(this.scene, this.camera);
		document.addEventListener('resize', this.handleResize);
	}

	createObjects() {
		this.addToScene(utils.addLights);
		this.addToScene(utils.createBoard);
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

		this.addToScene(utils.createReadyText);

		this.setPositions();
		this.setNicknames();
	}

	// --------------------------------
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
			changeUrl('match');
		});
	}
}

export default GamePage;
