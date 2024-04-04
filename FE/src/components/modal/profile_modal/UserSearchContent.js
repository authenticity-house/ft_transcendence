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
					<img class="user-search-icon" src="image/search.svg" alt="search" />
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
			userSearches += userSearchNode.template();
		}

		const userSearch = document.querySelector('.user-search-result');
		userSearch.innerHTML = userSearches;
	}

	addEventListeners() {}
}

export const userSearchContent = new UserSearchContent();
