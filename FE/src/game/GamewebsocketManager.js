export class GamewebsocketManager {
	constructor() {
		this.ws = null;
	}

	register(ws) {
		this.ws = ws;
	}

	unregister() {
		if (this.ws && this.ws.isOpen()) {
			if (this.ws.messageManager) {
				this.ws.messageManager.sendGameDisconnect();
			}
			if (this.ws.exitRoom) {
				this.ws.exitRoom();
			}
		}
		this.ws = null;
	}

	changeInfo() {
		if (this.ws && this.ws.isOpen()) {
			if (this.ws.exitRoom && this.ws.sendChangeProfile) {
				this.ws.sendChangeProfile();
			}
		}
	}
}
