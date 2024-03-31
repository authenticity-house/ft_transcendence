export class GamewebsocketManager {
	constructor() {
		this.gamews = null;
	}

	register(gamews) {
		this.gamews = gamews;
	}

	unregister() {
		if (this.gamews && this.gamews.isOpen()) {
			this.gamews.messageManager.sendGameDisconnect();
		}
		this.gamews = null;
	}
}
