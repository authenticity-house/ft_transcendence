export function getWebsocketUrl(path) {
	const { protocol, hostname, port } = location;

	// HTTPS인 경우 wss, 아니면 ws
	const wsProtocol = protocol === 'https:' ? 'wss' : 'ws';
	// 포트 번호가 있으면 URL에 포함시키고, 없으면 포트 번호 없이 도메인만 사용
	const wsPort = port ? `:${port}` : '';
	// ws://127.0.0.1:8080/ws/path/
	const wsUrl = `${wsProtocol}://${hostname}${wsPort}/ws${path}`;
	return wsUrl;
}
