import { gamewsmanager } from '../../../index.js';
import { getContent } from './GetContent.js';
import { myFriendContent } from './MyFriendContent.js';
import { myInfoContent } from './MyInfoContent.js';
import { myRecordContent } from './MyRecordContent.js';
import { userSearchContent } from './UserSearchContent.js';

import { getCookie, removeCSRF } from '../../../utils/getCookie.js';
import { hideModal } from '../modalUtils.js';

import apiEndpoints from '../../../constants/apiConfig.js';

import { statsContent } from './StatsContent.js';
import { friendInfoContent } from './FriendInfoContent.js';

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
						class="modal-content head_white_neon_15 display-light28 profile-modal-content"
					>
						<button
							type="button"
							class="btn-close btn-close-white profile-modal-close"
							data-bs-dismiss="modal"
							aria-label="Close"
						></button>
						<div class="modal-body profile-modal-body">
							<div class="container-fluid profile-modal-container">
								<div class="row profile-modal-row">
									<!-- 네비게이션 바 -->
									<div class="col-3 profile-modal-nav">
										<div
											class="nav flex-column nav-pills profile-nav-tab"
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
									<div class="profile-modal-content-container col-9">
										<div class="tab-content nav-tabContent">
											<div
												class="tab-pane my-tab-pane fade"
												id="my-info"
												role="tabpanel"
												aria-labelledby="my-info-tab"
											>
												${myInfoContent.template()}
											</div>
											<div
												class="tab-pane my-tab-pane fade"
												id="match-record"
												role="tabpanel"
												aria-labelledby="match-record-tab"
											>
												${myRecordContent.template()}
											</div>
											<div
												class="tab-pane my-tab-pane fade"
												id="user-search"
												role="tabpanel"
												aria-labelledby="user-search-tab"
											>
												${userSearchContent.template()}
											</div>
											<div
												class="tab-pane my-tab-pane fade"
												id="my-friend"
												role="tabpanel"
												aria-labelledby="my-friend-tab"
											>
												${myFriendContent.template()}
											</div>
											<div
												class="tab-pane my-tab-pane fade"
												id="stats"
												role="tabpanel"
												aria-labelledby="stats-tab"
											>
												${statsContent.template()}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<!-- 친구 프로필 모달 -->
			<div
				class="modal fade"
				id="friend-profile-modal"
				aria-hidden="true"
				aria-labelledby="profileFriendModalLabel"
				tabindex="-1"
			>
				<div class="modal-dialog modal-dialog-centered">
					<div
						class="modal-content head_white_neon_15 display-light28 profile-modal-content"
					>
						<button
							type="button"
							class="btn-close btn-close-white profile-modal-close"
							data-bs-dismiss="modal"
							aria-label="Close"
						></button>
						<div class="modal-body profile-modal-body">
							<div class="container-fluid profile-modal-container">
								<div class="row profile-modal-row">
									<!-- 네비게이션 바 -->
									<div class="col-3 profile-modal-nav">
										<div
											class="nav flex-column nav-pills profile-nav-tab"
											role="tablist"
											aria-orientation="vertical"
										>
											<button
												class="friend-profile-nav-link"
												id="friend-info-tab"
												data-toggle="tab"
												role="tab"
												aria-controls="friend-info"
												aria-selected="true"
											>
												<img
													class="profile-icon"
													src="image/my-info.svg"
													alt="info"
												/>
												정보
											</button>
											<button
												class="friend-profile-nav-link"
												id="friend-match-record-tab"
												data-toggle="tab"
												role="tab"
												aria-controls="friend-match-record"
												aria-selected="true"
											>
												<img
													class="profile-icon"
													src="image/match-record.svg"
													alt="record"
												/>
												경기 기록
											</button>
										</div>
										<div id="return-container">
											<button
												id="return-button"
												class="display-light28"
												type="button"
												data-bs-target="#profile-modal"
												data-bs-toggle="modal"
											>
												<img
													class="profile-icon"
													src="image/logout.svg"
													alt="logout"
												/>
												<span id="return-text">돌아가기</span>
											</button>
										</div>
									</div>
									<!-- 선택된 뷰의 내용을 표시하는 부분 -->
									<div class="profile-modal-content-container col-9">
										<div class="tab-content nav-tabContent">
											<div
												class="tab-pane friend-tab-pane fade"
												id="friend-info"
												role="tabpanel"
												aria-labelledby="friend-info-tab"
											>
												${friendInfoContent.template()}
											</div>
											<div
												class="tab-pane friend-tab-pane fade"
												id="friend-match-record"
												role="tabpanel"
												aria-labelledby="friend-match-record-tab"
											>
												${myRecordContent.template()}
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
				document.querySelectorAll('.my-tab-pane').forEach((pane) => {
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
				console.log(selectedTabContentId);
				getContent(selectedTabContentId);
			});
		});

		// 모든 친구 프로필 탭 버튼 선택
		const friendNavLinks = document.querySelectorAll(
			'.friend-profile-nav-link'
		);

		friendNavLinks.forEach((link) => {
			link.addEventListener('click', (event) => {
				// 기본 이벤트 방지
				event.preventDefault();

				// 모든 탭 컨텐츠 숨김 처리
				document.querySelectorAll('.friend-tab-pane').forEach((pane) => {
					pane.classList.remove('show', 'active');
				});

				// 모든 탭 버튼의 'active' 클래스 제거
				friendNavLinks.forEach((navLink) => {
					navLink.classList.remove('active');
				});

				// 클릭된 탭 버튼에 'active' 클래스 추가
				link.classList.add('active');

				// 클릭된 탭에 해당하는 컨텐츠 보여주기
				const selectedTabContentId = link.getAttribute('aria-controls');
				const selectedTabContent =
					document.getElementById(selectedTabContentId);
				selectedTabContent.classList.add('show', 'active');
				console.log(selectedTabContentId);
				getContent(selectedTabContentId);
			});
		});

		// 로그아웃 버튼에 대한 이벤트 리스너도 여기에 추가할 수 있습니다.
		const logout = document.getElementById('logout-button');
		logout.addEventListener('click', () => {
			const csrfToken = getCookie('csrftoken');

			// const csrfToken = Cookies.get('csrftoken');

			fetch(apiEndpoints.LOGOUT_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-CSRFToken': csrfToken
				},
				mode: 'same-origin'
			})
				.then((res) => {
					// 200 : OK
					if (res.ok) {
						removeCSRF();
						hideModal('profile-modal', () => {
							setTimeout(() => {
								gamewsmanager.unregister();
								// 페이지 강제 새로 고침
								window.location.reload(true);
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
		document.querySelectorAll('.my-tab-pane').forEach((pane) => {
			pane.classList.remove('show', 'active');
		});

		// 모든 탭 버튼의 'active' 클래스 제거
		document.querySelectorAll('.profile-nav-link').forEach((navLink) => {
			navLink.classList.remove('active');
		});

		// 클릭된 탭 버튼에 'active' 클래스 추가
		tabButton.classList.add('active');

		// 모달 열기
		profileModal.style.display = 'block';

		// 클릭된 탭에 해당하는 컨텐츠 보여주기
		tab.classList.add('show', 'active');
		getContent(tabId);
	}

	openFriendModal(userPk) {
		const friendProfileModal = document.getElementById('friend-profile-modal');
		const tab = document.getElementById('friend-info');
		const tabButton = document.getElementById('friend-info-tab');

		// 모든 탭 컨텐츠 숨김 처리
		document.querySelectorAll('.friend-tab-pane').forEach((pane) => {
			pane.classList.remove('show', 'active');
		});

		// 모든 탭 버튼의 'active' 클래스 제거
		document.querySelectorAll('.friend-profile-nav-link').forEach((navLink) => {
			navLink.classList.remove('active');
		});

		// 정보 탭 버튼에 'active' 클래스 추가
		tabButton.classList.add('active');

		// 모달 열기
		friendProfileModal.style.display = 'block';

		// 클릭된 탭에 해당하는 컨텐츠 보여주기
		tab.classList.add('show', 'active');
		getContent('friend-info', userPk);
	}
}

export const profileModal = new ProfileModal();
