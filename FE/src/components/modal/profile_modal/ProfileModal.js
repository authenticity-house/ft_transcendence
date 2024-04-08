import { changeUrl } from '../../../index.js';
import { getContent } from './GetContent.js';
import { myFriendContent } from './MyFriendContent.js';
import { myInfoContent } from './MyInfoContent.js';
import { myRecordContent } from './MyRecordContent.js';
import { userSearchContent } from './UserSearchContent.js';
import { getCookie, removeCSRF } from '../../../utils/getCookie.js';
import { hideModal } from '../modalUtiils.js';

const html = String.raw;

class ProfileModal {
	template() {
		return html`
			<div
				class="modal fade"
				id="profile-modal"
				tabindex="-1"
				aria-labelledby="profileModalLabel"
				aria-hidden="true"
			>
				<div class="modal-dialog modal-dialog-centered">
					<div
						class="modal-content head_white_neon_15 display-light28"
						id="profile-modal-content"
					>
						<button
							id="profile-modal-close"
							type="button"
							class="btn-close btn-close-white"
							data-bs-dismiss="modal"
							aria-label="Close"
						></button>
						<div id="profile-modal-body" class="modal-body">
							<div id="profile-modal-container" class="container-fluid">
								<div id="profile-modal-row" class="row">
									<!-- 네비게이션 바 -->
									<div id="profile-modal-nav" class="col-3">
										<div
											class="nav flex-column nav-pills"
											id="profile-nav-tab"
											role="tablist"
											aria-orientation="vertical"
										>
											<button
												class="profile-nav-link"
												id="my-info-tab"
												data-toggle="tab"
												role="tab"
												aria-controls="my-info"
												aria-selected="true"
											>
												<img
													class="profile-icon"
													src="image/my-info.svg"
													alt="info"
												/>
												내 정보
											</button>
											<button
												class="profile-nav-link"
												id="match-record-tab"
												data-toggle="tab"
												role="tab"
												aria-controls="match-record"
												aria-selected="true"
											>
												<img
													class="profile-icon"
													src="image/match-record.svg"
													alt="record"
												/>
												경기 기록
											</button>
											<button
												class="profile-nav-link"
												id="user-search-tab"
												data-toggle="tab"
												role="tab"
												aria-controls="user-search"
												aria-selected="true"
											>
												<img
													class="profile-icon"
													src="image/search.svg"
													alt="search"
												/>
												유저 검색
											</button>
											<button
												class="profile-nav-link"
												id="my-friend-tab"
												data-toggle="tab"
												role="tab"
												aria-controls="my-friend"
												aria-selected="true"
											>
												<img
													class="profile-icon"
													src="image/my-friend.svg"
													alt="friend"
												/>
												내 친구
											</button>
											<button
												class="profile-nav-link"
												id="stats-tab"
												data-toggle="tab"
												role="tab"
												aria-controls="stats"
												aria-selected="true"
											>
												<img
													class="profile-icon"
													src="image/statistics.svg"
													alt="statistics"
												/>
												통계
											</button>
										</div>
										<div id="logout-container">
											<button
												id="logout-button"
												class="display-light28"
												type="button"
											>
												<img
													class="profile-icon"
													src="image/logout.svg"
													alt="logout"
												/>
												<span id="logout-text">로그아웃</span>
											</button>
										</div>
									</div>
									<!-- 선택된 뷰의 내용을 표시하는 부분 -->
									<div id="profile-modal-content-container" class="col-9">
										<div class="tab-content" id="nav-tabContent">
											<div
												class="tab-pane fade show"
												id="my-info"
												role="tabpanel"
												aria-labelledby="my-info-tab"
											>
												${myInfoContent.template()}
											</div>
											<div
												class="tab-pane fade"
												id="match-record"
												role="tabpanel"
												aria-labelledby="match-record-tab"
											>
												${myRecordContent.template()}
											</div>
											<div
												class="tab-pane fade"
												id="user-search"
												role="tabpanel"
												aria-labelledby="user-search-tab"
											>
												${userSearchContent.template()}
											</div>
											<div
												class="tab-pane fade"
												id="my-friend"
												role="tabpanel"
												aria-labelledby="my-friend-tab"
											>
												${myFriendContent.template()}
											</div>
											<div
												class="tab-pane fade"
												id="stats"
												role="tabpanel"
												aria-labelledby="stats-tab"
											>
												통계
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		`;
	}

	addEventListeners() {
		// 모든 탭 버튼 선택
		const navLinks = document.querySelectorAll('.profile-nav-link');

		navLinks.forEach((link) => {
			link.addEventListener('click', (event) => {
				// 기본 이벤트 방지
				event.preventDefault();

				// 모든 탭 컨텐츠 숨김 처리
				document.querySelectorAll('.tab-pane').forEach((pane) => {
					pane.classList.remove('show', 'active');
				});

				// 모든 탭 버튼의 'active' 클래스 제거
				navLinks.forEach((navLink) => {
					navLink.classList.remove('active');
				});

				// 클릭된 탭 버튼에 'active' 클래스 추가
				link.classList.add('active');

				// 클릭된 탭에 해당하는 컨텐츠 보여주기
				const selectedTabContentId = link.getAttribute('aria-controls');
				const selectedTabContent =
					document.getElementById(selectedTabContentId);
				selectedTabContent.classList.add('show', 'active');
				getContent(selectedTabContentId);
			});
		});

		// 로그아웃 버튼에 대한 이벤트 리스너도 여기에 추가할 수 있습니다.
		const logout = document.getElementById('logout-button');
		logout.addEventListener('click', () => {
			const csrfToken = getCookie('csrftoken');

			// const csrfToken = Cookies.get('csrftoken');

			fetch('http://127.0.0.1:8080/api/users/logout/', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': csrfToken
				},
				mode: 'same-origin'
			})
				.then((res) => {
					console.log('here', res);
					// 200 : OK
					if (res.ok) {
						removeCSRF();
						hideModal('profile-modal', () => {
							setTimeout(() => {
								changeUrl('');
							}, 100);
						});

						return res.json();
					}
					throw new Error('Error');
				})
				.then((data) => console.log(data))
				.catch((error) => console.error('Error:', error));
		});
	}

	// 헤더 버튼을 눌렀을 때 각 버튼에 맞는 탭이 활성화된 상태로 모달이 열리도록 하는 함수
	openModal(tabId) {
		const profileModal = document.getElementById('profile-modal');
		const tab = document.getElementById(tabId);
		const tabButton = document.getElementById(`${tabId}-tab`);

		// 모든 탭 컨텐츠 숨김 처리
		document.querySelectorAll('.tab-pane').forEach((pane) => {
			pane.classList.remove('show', 'active');
		});

		// 모든 탭 버튼의 'active' 클래스 제거
		document.querySelectorAll('.profile-nav-link').forEach((navLink) => {
			navLink.classList.remove('active');
		});

		// 클릭된 탭 버튼에 'active' 클래스 추가
		tabButton.classList.add('active');

		// 클릭된 탭에 해당하는 컨텐츠 보여주기
		tab.classList.add('show', 'active');
		getContent(tabId);

		// 모달 열기
		profileModal.style.display = 'block';
	}
}

export const profileModal = new ProfileModal();
