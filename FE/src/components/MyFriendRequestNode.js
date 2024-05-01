const html = String.raw;

class MyFriendRequestNode {
	constructor(data) {
		this.data = data;
	}

	template(pk) {
		return html`
			<div class="my-friend-request-node-container">
				<span class="display-light28">${this.data.nickname}</span>
				<div class="my-friend-request-node-button-container">
					${this.data.sent
						? html`
								<button
									id="my-friend-request-cancel-${pk}"
									class="my-friend-request-node-cancel"
								>
									<img src="image/x-square.svg" alt="cancel" />
								</button>
							`
						: html`
								<button
									id="my-friend-request-accept-${pk}"
									class="my-friend-request-node-accept"
								>
									<img src="image/check-square.svg" alt="accept" />
								</button>
								<button
									id="my-friend-request-reject-${pk}"
									class="my-friend-request-node-reject"
								>
									<img src="image/x-square.svg" alt="reject" />
								</button>
							`}
				</div>
			</div>
		`;
	}

	sentreceived() {
		return this.data.sent;
	}
}

export default MyFriendRequestNode;
