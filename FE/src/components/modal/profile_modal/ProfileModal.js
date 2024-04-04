import { myInfoContent } from './MyInfoContent.js';
import { myRecordContent } from './MyRecordContent.js';
import { userSearchContent } from './UserSearchContent.js';

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
												내 친구
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

				if (selectedTabContentId === 'match-record') {
					// my-record 탭을 클릭했을 때 경기 기록을 렌더링
					// mock-data
					const data = [
						{
							date: '2024-04-03',
							play_time: '00:00:24',
							rally: [2, 0.4, 0],
							max_ball_speed: [0.059, 0.0438, 0.04],
							player1: {
								nickname: 'jeongrol',
								score: 0,
								attack_type: 0,
								power_up_cnt: 0,
								key_cnt: 0.2,
								attack_pos: 0
							},
							player2: {
								nickname: 'wonyang',
								score: 5,
								attack_type: 0,
								power_up_cnt: 0,
								key_cnt: 0,
								attack_pos: 0
							},
							graph: {
								player1: {
									score_trend: [0, 0, 0, 0, 0, 0],
									score_pos: []
								},
								player2: {
									score_trend: [0, 1, 2, 3, 4, 5],
									score_pos: [
										[-2.982, -1.161],
										[-2.983, 0.585],
										[-2.975, -0.94],
										[-2.969, 0.821],
										[-2.978, 0.691]
									]
								}
							}
						},
						{
							date: '2024-04-03',
							play_time: '00:00:14',
							rally: [0, 0, 0],
							max_ball_speed: [0.04, 0.04, 0.04],
							player1: {
								nickname: 'jihylim',
								score: 0,
								attack_type: 2,
								power_up_cnt: 0,
								key_cnt: 0.6,
								attack_pos: 3
							},
							player2: {
								nickname: 'jeongmin',
								score: 5,
								attack_type: 0,
								power_up_cnt: 0,
								key_cnt: 0,
								attack_pos: 3
							},
							graph: {
								player1: {
									score_trend: [0, 0, 0, 0, 0, 0],
									score_pos: []
								},
								player2: {
									score_trend: [0, 1, 2, 3, 4, 5],
									score_pos: [
										[-2.998, 0.112],
										[-2.971, 1.293],
										[-2.964, 1.405],
										[-2.964, 0.461],
										[-2.997, -0.126]
									]
								}
							}
						},
						{
							date: '2024-04-03',
							play_time: '00:00:19',
							rally: [2, 0.8, 0],
							max_ball_speed: [0.059, 0.0476, 0.04],
							player1: {
								nickname: 'joyoo',
								score: 0,
								attack_type: 0,
								power_up_cnt: 0,
								key_cnt: 3.2,
								attack_pos: 1
							},
							player2: {
								nickname: 'wonyang',
								score: 5,
								attack_type: 0,
								power_up_cnt: 0,
								key_cnt: 15.6,
								attack_pos: 1
							},
							graph: {
								player1: {
									score_trend: [0, 0, 0, 0, 0, 0],
									score_pos: []
								},
								player2: {
									score_trend: [0, 1, 2, 3, 4, 5],
									score_pos: [
										[-2.98, -0.266],
										[-2.963, -0.469],
										[-2.975, 1.383],
										[-2.997, -0.125],
										[-3, 0.053]
									]
								}
							}
						},
						{
							date: '2024-04-03',
							play_time: '00:00:23',
							rally: [1, 0.16666666666666666, 0],
							max_ball_speed: [0.055, 0.0425, 0.04],
							player1: {
								nickname: 'wonyang',
								score: 1,
								attack_type: 0,
								power_up_cnt: 0,
								key_cnt: 8.5,
								attack_pos: 3
							},
							player2: {
								nickname: 'jeongmin',
								score: 5,
								attack_type: 0,
								power_up_cnt: 0,
								key_cnt: 32.666666666666664,
								attack_pos: 1
							},
							graph: {
								player1: {
									score_trend: [0, 1, 1, 1, 1, 1, 1],
									score_pos: [[2.965, 0.552]]
								},
								player2: {
									score_trend: [0, 0, 1, 2, 3, 4, 5],
									score_pos: [
										[-2.99, -1.857],
										[-2.978, 1.171],
										[-2.96, -1.07],
										[-2.997, -0.144],
										[-2.985, -1.261]
									]
								}
							}
						}
					];

					myRecordContent.mount(data);
					myRecordContent.addEventListeners();
				} else if (selectedTabContentId === 'user-search') {
					// user-search 탭을 클릭했을 때 유저 검색을 렌더링
					// mock-data
					const data = [
						{
							profileImg: 'image/default-profile.png',
							nickname: 'jeongrol'
						},
						{
							profileImg: 'image/default-profile.png',
							nickname: 'wonyang'
						},
						{
							profileImg: 'image/default-profile.png',
							nickname: 'jihylim'
						},
						{
							profileImg: 'image/default-profile.png',
							nickname: 'jeongmin'
						},
						{
							profileImg: 'image/default-profile.png',
							nickname: 'joyoo'
						}
					];

					userSearchContent.mount(data);
					userSearchContent.addEventListeners();
				}
			});
		});

		// 로그아웃 버튼에 대한 이벤트 리스너도 여기에 추가할 수 있습니다.
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

		// 모달 열기
		profileModal.style.display = 'block';
	}
}

export const profileModal = new ProfileModal();
