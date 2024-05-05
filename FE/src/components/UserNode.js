const html = String.raw;

class UserNode {
	constructor(data) {
		this.data = data;
	}

	template() {
		return html`
			<div class="user-search-node-container col-4">
				<img
					class="user-search-node-profile"
					src="${this.data.profile_url}"
					alt="profile"
				/>
				<span class="${this.setFontSize(this.data.nickname)}"
					>${this.data.nickname}</span
				>
			</div>
		`;
	}

	setFontSize(nickname) {
		if (nickname.length > 10) {
			return 'display-light18';
		}
		if (nickname.length > 6) {
			return 'display-light24';
		}
		return 'display-light28';
	}
}

export default UserNode;
