/* eslint-disable no-void */

import * as THREE from 'three';
import { FontLoader } from '../../node_modules/three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from '../../node_modules/three/examples/jsm/geometries/TextGeometry.js';

import { changeUrl } from '../index.js';
import { Gamewebsocket } from '../Gamewebsocket.js';

const html = String.raw;

class GamePage {
	constructor() {
		this.initial = {};
	}

	template(initial) {
		this.initial = initial;
		console.log(initial);

		return html`
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

			<button class="return-button" style="margin: 30px">Return</button>
		`;
	}

	addEventListeners() {
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

		// --------------------- ball -------------------------
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
		const ballLight = new THREE.PointLight(0xffff00, 0.3, 100);
		ballLight.position.set(0, 0, 0);
		scene.add(ballLight);

		// --------------------- paddle -------------------------
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

		function addPaddleLights(paddleMesh, paddleLightGroup) {
			for (
				let i = paddleMesh.position.y - 0.25;
				i <= paddleMesh.position.y + 0.25;
				i += 0.1
			) {
				const paddleLight = new THREE.PointLight(0xffffff, 0.1, 100);
				paddleLight.position.set(
					paddleMesh === paddleMesh1 ? -2.8 : 2.8,
					i,
					0.2
				);
				paddleLightGroup.add(paddleLight);
			}
		}

		addPaddleLights(paddleMesh1, paddleLightGroup1);
		addPaddleLights(paddleMesh2, paddleLightGroup2);

		scene.add(paddleLightGroup1);
		scene.add(paddleLightGroup2);

		// ---------------------------------------------------
		// Set the position of the ball
		ballMesh.position.x = 0;
		ballMesh.position.y = 0;
		ballMesh.position.z = -0.01;

		// Set the position of the paddle
		paddleMesh1.position.x = -2.8;

		// Set the position of the paddle
		paddleMesh2.position.x = 2.8;

		// Create a ambientLight
		const ambientLight = new THREE.AmbientLight(0xffffff, 2);
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
			const disconnectMessage = {
				type: 'disconnect',
				message: "I'm leaving!"
			};
			this.initial.Gamewebsocket.send(JSON.stringify(disconnectMessage));
			this.initial.Gamewebsocket.close();
			console.log('match_end');
			changeUrl('match');
		});
	}
}

export default new GamePage();
