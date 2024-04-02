const html = String.raw;

export function profileModal() {
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
										id="nav-tab"
										role="tablist"
										aria-orientation="vertical"
									>
										<button
											class="nav-link active"
											id="my-record-tab"
											data-toggle="tab"
											role="tab"
											aria-controls="my-record"
											aria-selected="true"
										>
											내 기록
										</button>
										<button
											class="nav-link"
											id="match-record-tab"
											data-toggle="tab"
											role="tab"
											aria-controls="match-record"
											aria-selected="true"
										>
											경기 기록
										</button>
										<button
											class="nav-link"
											id="user-search-tab"
											data-toggle="tab"
											role="tab"
											aria-controls="user-search"
											aria-selected="true"
										>
											유저 검색
										</button>
										<button
											class="nav-link"
											id="my-friend-tab"
											data-toggle="tab"
											role="tab"
											aria-controls="my-friend"
											aria-selected="true"
										>
											내 친구
										</button>
										<button
											class="nav-link"
											id="stats-tab"
											data-toggle="tab"
											role="tab"
											aria-controls="stats"
											aria-selected="true"
										>
											통계
										</button>
									</div>
									<div id="logout-container">
										<button
											id="logout-button"
											class="btn btn-danger display-light28"
											type="button"
										>
											로그아웃
										</button>
									</div>
								</div>
								<!-- 선택된 뷰의 내용을 표시하는 부분 -->
								<div class="col-9">
									<div class="tab-content" id="nav-tabContent">
										<div
											class="tab-pane fade show active"
											id="my-record"
											role="tabpanel"
											aria-labelledby="my-record-tab"
										>
											내 기록
										</div>
										<div
											class="tab-pane fade"
											id="match-record"
											role="tabpanel"
											aria-labelledby="match-record-tab"
										>
											경기 기록
										</div>
										<div
											class="tab-pane fade"
											id="user-search"
											role="tabpanel"
											aria-labelledby="user-search-tab"
										>
											유저 검색
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
