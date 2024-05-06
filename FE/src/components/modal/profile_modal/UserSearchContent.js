import apiEndpoints from '../../../constants/apiConfig.js';
import { getCookie } from '../../../utils/getCookie.js';
import UserNode from '../../UserNode.js';
import { profileModal } from './ProfileModal.js';

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
				<button id="friend-profile-button-${data[i].pk}" class="user-node-button" data-bs-target="#friend-profile-modal" data-bs-toggle="modal">
			`;
			userSearches += userSearchNode.template();
			userSearches += '</button>';
		}

		const userSearch = document.querySelector('.user-search-result');
		userSearch.innerHTML = userSearches;
	}

	addProfileModalEventListeners() {
		const userSearchNodes = document.querySelectorAll('.user-node-button');

		userSearchNodes.forEach((userSearchNode) => {
			userSearchNode.addEventListener('click', () => {
				const userPk = userSearchNode.id.split('-')[3];
				profileModal.openFriendModal(userPk);
			});
		});
	}

	searchUser(userSearchValue) {
		const csrfToken = getCookie('csrftoken');
		if (userSearchValue === '') {
			alert('닉네임을 입력해주세요.');
		} else {
			// 서버에 요청
			fetch(apiEndpoints.SEARCH_USER_URL + userSearchValue, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': csrfToken
				}
			})
				.then((res) => {
					if (res.status === 204) {
						alert('검색 결과가 없습니다.');
					}
					if (res.status === 200) return res.json();
					return null;
				})
				.then((res) => {
					this.mount(res);
					this.addProfileModalEventListeners();
				});
		}
	}

	addEventListeners() {
		// const userSearchNodes = document.querySelectorAll('.user-search-node-container');
		const userSearchButton = document.querySelector('.user-search-button');
		const userSearchInput = document.querySelector('.user-search-input');

		userSearchButton.addEventListener('click', () => {
			const userSearchValue = userSearchInput.value;
			this.searchUser(userSearchValue);
		});

		let searchInProgress = false;
		userSearchInput.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' && !searchInProgress) {
				// 한글 입력 시 한 번 더 검색되는 문제 해결
				e.preventDefault();
				searchInProgress = true;
				const userSearchValue = userSearchInput.value;
				this.searchUser(userSearchValue);

				setTimeout(() => {
					searchInProgress = false;
				}, 500);
			}
		});
	}
}

export const userSearchContent = new UserSearchContent();
