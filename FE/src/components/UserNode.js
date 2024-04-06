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
					src="${this.data.profileImg}"
					alt="profile"
				/>
				<span class="display-light28">${this.data.nickname}</span>
			</div>
		`;
	}
}

export default UserNode;
