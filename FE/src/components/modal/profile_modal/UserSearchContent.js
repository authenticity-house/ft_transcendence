import UserNode from '../../UserNode.js';

const html = String.raw;

class UserSearchContent {
	template() {
		return html`
			<div class="user-search-content-container">
				<div class="user-search-input-container">
					<input
						type="text"
						class="user-search-input"
						placeholder="닉네임을 입력하세요."
					/>
					<button class="user-search-button">
						<img class="user-search-icon" src="image/search.svg" alt="search" />
					</button>
				</div>
				<div class="user-search-result-container container">
					<div class="user-search-result row"></div>
				</div>
			</div>
		`;
	}

	mount(data) {
		this.data = data;

		let userSearches = '';

		for (let i = 0; i < data.length; i += 1) {
			const userSearchNode = new UserNode(data[i]);
			userSearches += `
				<button class="user-node-button" data-bs-target="#friend-profile-modal" data-bs-toggle="modal">
			`;
			userSearches += userSearchNode.template();
			userSearches += '</button>';
		}

		const userSearch = document.querySelector('.user-search-result');
		userSearch.innerHTML = userSearches;
	}

	addEventListeners() {
		// const userSearchNodes = document.querySelectorAll('.user-search-node-container');
	}
}

export const userSearchContent = new UserSearchContent();
