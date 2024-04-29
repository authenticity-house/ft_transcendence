import * as THREE from 'three';

export function setupScene() {
	const scene = new THREE.Scene();
	scene.background = new THREE.Color(0x141343);
	return scene;
}

export function createCamera() {
	const camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		0.1,
		1000
	);

	camera.position.z = 4;
	return camera;
}

export function createRenderer() {
	const renderer = new THREE.WebGLRenderer({
		antialias: true
	});
	renderer.setSize(window.innerWidth / 1.8, window.innerHeight / 1.8);
	document.querySelector('.game-container').appendChild(renderer.domElement);
	return renderer;
}

export function addAmbientLight() {
	const ambientLight = new THREE.AmbientLight(0xffffff, 2);
	return ambientLight;
}

export function addPointLights() {
	const pointLight = new THREE.PointLight(0xffffff, 1, 1000);
	pointLight.position.set(0, 0, 1);

	return pointLight;
}
export function createBoardLine() {
	const board = new THREE.BoxGeometry(6, 4, 0.1);

	const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
	const edges = new THREE.EdgesGeometry(board);

	const line = new THREE.LineSegments(edges, lineMaterial);

	return line;
}

export function createBoardPlane() {
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

	return planeMesh;
}

export function createDashedLine() {
	const lineDashedMaterial = new THREE.LineDashedMaterial({
		color: 0xffffff,
		dashSize: 0.1,
		gapSize: 0.1
	});
	const points = [new THREE.Vector3(0, 2, 0), new THREE.Vector3(0, -2, 0)];
	const lineDashed = new THREE.Line(
		new THREE.BufferGeometry().setFromPoints(points),
		lineDashedMaterial
	);
	lineDashed.computeLineDistances();
	return lineDashed;
}

export function createBall(initial) {
	const ball = new THREE.SphereGeometry(0.04, 32, 32);
	const ballMaterial = new THREE.MeshPhysicalMaterial({
		color: 0xffffff,
		metalness: 0.5,
		roughness: 0.5,
		clearcoat: 1,
		clearcoatRoughness: 0.5,
		side: THREE.DoubleSide,
		emissive: initial.color.ball,
		emissiveIntensity: 0.5
	});
	const ballMesh = new THREE.Mesh(ball, ballMaterial);

	ballMesh.position.set(initial.ball.x, initial.ball.y, -0.01);
	return ballMesh;
}

export function createBallLight(initial, ballMesh) {
	const ballLight = new THREE.PointLight(initial.color.ball, 0.3, 100);
	ballLight.position.copy(ballMesh.position);
	return ballLight;
}

export function createPaddle(initial) {
	const paddleGeometry = new THREE.BoxGeometry(
		initial.paddle1.width,
		initial.paddle1.height,
		0.1
	);
	const paddleMaterial = new THREE.MeshPhysicalMaterial({
		color: 0xffffff,
		metalness: 0.5,
		roughness: 0.5,
		clearcoat: 1,
		clearcoatRoughness: 0.5,
		emissive: initial.color.paddle,
		emissiveIntensity: 0.5,
		side: THREE.DoubleSide
	});
	const paddleMesh = new THREE.Mesh(paddleGeometry, paddleMaterial);
	return paddleMesh;
}

export function createPaddleLight(paddleMesh, initial, pos) {
	const paddleLightGroup = new THREE.Group();

	for (
		let i = paddleMesh.position.y - 0.25;
		i <= paddleMesh.position.y + 0.25;
		i += 0.1
	) {
		const paddleLight = new THREE.PointLight(initial.color.paddle, 0.1, 100);
		paddleLight.position.set(pos === 'left' ? -2.8 : 2.8, i, 0.2);
		paddleLightGroup.add(paddleLight);
	}

	return paddleLightGroup;
}
