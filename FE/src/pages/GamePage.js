import * as THREE from 'three';
import { OrbitControls } from '../../node_modules/three/examples/jsm/controls/OrbitControls.js';

import { changeUrl } from '../index.js';

const html = String.raw;

class GamePage {
	template() {
		return html`
			<div class="game-container"></div>
			<div class="return-button">
				<button class="return-button__button">Return</button>
			</div>
		`;
	}

	addEventListeners() {
		// Create a scene
		const scene = new THREE.Scene();
		scene.background = new THREE.Color(0x222222);

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
		renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);

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
			emissive: 0x0000ff,
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
			const paddleLight = new THREE.PointLight(0x0000ff, 0.2, 100);
			paddleLight.position.set(-2.8, i, 0.2);
			paddleLightGroup1.add(paddleLight);
		}

		for (
			let i = paddleMesh2.position.y - 0.25;
			i <= paddleMesh2.position.y + 0.25;
			i += 0.1
		) {
			const paddleLight = new THREE.PointLight(0x0000ff, 0.2, 100);
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

		// Create a controls
		const controls = new OrbitControls(camera, renderer.domElement);

		// Set the camera position
		camera.position.z = 3;

		// Set the ball movement
		// seed from PI / 2 to 3 * PI / 2
		const seed = Math.PI / 2 + Math.random() * Math.PI;
		const ballSpeed = 0.06;
		const direction = new THREE.Vector3(
			Math.cos(seed) * ballSpeed,
			Math.sin(seed) * ballSpeed,
			0
		);

		// Set the paddle movement
		// mesh1 moves key W and S
		// mesh2 moves key UP and DOWN
		const paddleSpeed = 0.05;
		const keyDownList = new Set();

		document.addEventListener('keydown', (event) => {
			if (event.key === 'w') {
				keyDownList.add('w');
			}
			if (event.key === 's') {
				keyDownList.add('s');
			}
			if (event.key === 'ArrowUp') {
				keyDownList.add('ArrowUp');
			}
			if (event.key === 'ArrowDown') {
				keyDownList.add('ArrowDown');
			}
		});

		document.addEventListener('keyup', (event) => {
			if (event.key === 'w') {
				keyDownList.delete('w');
			}
			if (event.key === 's') {
				keyDownList.delete('s');
			}
			if (event.key === 'ArrowUp') {
				keyDownList.delete('ArrowUp');
			}
			if (event.key === 'ArrowDown') {
				keyDownList.delete('ArrowDown');
			}
		});

		// Set the ball reflection
		const reflect = (axis) => {
			direction[axis] *= -1;
		};

		// Set the ball reflection from the paddle
		const calculateReflection = (paddleMesh) => {
			const paddleY = paddleMesh.position.y;
			const ballY = ballMesh.position.y;
			const relativeIntersectY = ballY - paddleY;
			const normalizedRelativeIntersectionY =
				relativeIntersectY / (paddleMesh.geometry.parameters.height / 2);
			const bounceAngle = normalizedRelativeIntersectionY * (Math.PI / 2.5);
			return bounceAngle;
		};

		// Create an animation
		const animate = () => {
			requestAnimationFrame(animate);

			controls.update();

			// Ball movement
			ballMesh.position.add(direction);
			ballLight.position.copy(ballMesh.position);

			// Ball reflection
			if (ballMesh.position.y <= -2 || ballMesh.position.y >= 2) {
				reflect('y');
			}
			if (ballMesh.position.x <= -3 || ballMesh.position.x >= 3) {
				reflect('x');
			}

			// Ball reflection on paddle
			if (
				ballMesh.position.x <= -2.7 &&
				ballMesh.position.x >= -2.8 &&
				ballMesh.position.y <= paddleMesh1.position.y + 0.25 &&
				ballMesh.position.y >= paddleMesh1.position.y - 0.25 &&
				direction.x < 0
			) {
				const angle = calculateReflection(paddleMesh1);
				direction.x = Math.cos(angle) * ballSpeed;
				direction.y = Math.sin(angle) * ballSpeed;
			}
			if (
				ballMesh.position.x >= 2.7 &&
				ballMesh.position.x <= 2.8 &&
				ballMesh.position.y <= paddleMesh2.position.y + 0.25 &&
				ballMesh.position.y >= paddleMesh2.position.y - 0.25 &&
				direction.x > 0
			) {
				const angle = calculateReflection(paddleMesh2);
				direction.x = Math.cos(angle) * ballSpeed * -1;
				direction.y = Math.sin(angle) * ballSpeed;
			}

			// Paddle movement
			if (keyDownList.has('w')) {
				if (paddleMesh1.position.y < 1.75) {
					paddleMesh1.position.y += paddleSpeed;
					paddleLightGroup1.position.y += paddleSpeed;
				}
			}
			if (keyDownList.has('s')) {
				if (paddleMesh1.position.y > -1.75) {
					paddleMesh1.position.y -= paddleSpeed;
					paddleLightGroup1.position.y -= paddleSpeed;
				}
			}
			if (keyDownList.has('ArrowUp')) {
				if (paddleMesh2.position.y < 1.75) {
					paddleMesh2.position.y += paddleSpeed;
					paddleLightGroup2.position.y += paddleSpeed;
				}
			}
			if (keyDownList.has('ArrowDown')) {
				if (paddleMesh2.position.y > -1.75) {
					paddleMesh2.position.y -= paddleSpeed;
					paddleLightGroup2.position.y -= paddleSpeed;
				}
			}

			renderer.render(scene, camera);
		};

		animate();

		// Resize the window
		window.addEventListener('resize', () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();

			renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
		});

		// Return to the main page
		const returnButton = document.querySelector('.return-button');
		returnButton.addEventListener('click', () => {
			changeUrl('');
		});
	}
}

export default new GamePage();
