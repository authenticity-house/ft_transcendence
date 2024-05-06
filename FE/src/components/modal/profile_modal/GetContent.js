import { myFriendContent } from './MyFriendContent.js';
import { myRecordContent } from './MyRecordContent.js';
// import { userSearchContent } from './UserSearchContent.js';
import { statsContent } from './StatsContent.js';
import { myInfoContent } from './MyInfoContent.js';
import apiEndpoints from '../../../constants/apiConfig.js';
import { getCookie } from '../../../utils/getCookie.js';
import { friendInfoContent } from './FriendInfoContent.js';
import { friendRecordContent } from './FriendRecordContent.js';

const csrfToken = getCookie('csrftoken');

export function getContent(id, userPk) {
	if (id === 'my-info') {
		// my-info 탭을 클릭했을 때 내 정보를 렌더링
		fetch(apiEndpoints.MY_INFO_URL, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrfToken
			},
			mode: 'same-origin'
		})
			.then((res) => {
				if (res.status === 200) {
					res.json().then((data) => {
						myInfoContent.mount(data);
						myInfoContent.addEventListener();
					});
				}
			})
			.catch((err) => {
				console.log(err);
			});

		fetch(apiEndpoints.STATS_SUMMARY_URL, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrfToken
			},
			mode: 'same-origin'
		})
			.then((res) => {
				if (res.status === 200) {
					res.json().then((data) => {
						myInfoContent.mountStats(data);
					});
				} else if (res.status === 403) {
					alert('로그인이 필요합니다.');
					window.location.reload();
				} else if (res.status === 404) {
					myInfoContent.mountStats({
						total_count: 0,
						wins_count: 0,
						losses_count: 0,
						winning_rate: 0,
						rating: 0
					});
				}
			})
			.catch((err) => {
				console.log(err);
			});
	} else if (id === 'match-record') {
		// my-record 탭을 클릭했을 때 경기 기록을 렌더링
		fetch(apiEndpoints.MATCH_RECORD_URL, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrfToken
			},
			mode: 'same-origin'
		})
			.then((res) => {
				if (res.status === 200) {
					res.json().then((data) => {
						myRecordContent.mount(data);
						myRecordContent.addEventListeners();
					});
				}
			})
			.catch((err) => {
				console.log(err);
			});
	} else if (id === 'user-search') {
		// user-search 탭을 클릭했을 때 유저 검색을 렌더링
	} else if (id === 'my-friend') {
		// my-friend 탭을 클릭했을 때 친구 목록을 렌더링
		myFriendContent.fetchFriends();
		myFriendContent.fetchFriendRequestsSent();
		myFriendContent.fetchFriendRequestsReceived();
	} else if (id === 'stats') {
		fetch(`${apiEndpoints.MY_STATS_URL}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrfToken
			},
			mode: 'same-origin'
		}).then((res) => {
			if (res.status === 200) {
				res
					.json()
					.then((data) => {
						const toolTip = statsContent.mount(data);
						statsContent.addEventListeners(toolTip);
					})
					.catch((err) => {
						console.log(err);
					});
			}
		});
	} else if (id === 'friend-info') {
		fetch(`${apiEndpoints.FRIEND_PROFILE_URL}${userPk}/`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrfToken
			},
			mode: 'same-origin'
		})
			.then((res) => {
				if (res.status === 200) {
					res.json().then((data) => {
						friendInfoContent.mount(data);
						friendInfoContent.addEventListeners(data);
					});
				}
			})
			.catch((err) => {
				console.log(err);
			});

		fetch(`${apiEndpoints.STATS_SUMMARY_URL}${userPk}/`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrfToken
			},
			mode: 'same-origin'
		})
			.then((res) => {
				if (res.status === 200) {
					res.json().then((data) => {
						friendInfoContent.mountStats(data);
					});
				} else if (res.status === 403) {
					alert('로그인이 필요합니다.');
					window.location.reload();
				} else if (res.status === 404) {
					friendInfoContent.mountStats({
						total_count: 0,
						wins_count: 0,
						losses_count: 0,
						winning_rate: 0,
						rating: 0
					});
				}
			})
			.catch((err) => {
				console.log(err);
			});
	} else if (id === 'friend-match-record') {
		fetch(`${apiEndpoints.MATCH_RECORD_URL}${userPk}/`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': csrfToken
			},
			mode: 'same-origin'
		})
			.then((res) => {
				if (res.status === 200) {
					res.json().then((data) => {
						friendRecordContent.mount(data);
						friendRecordContent.addEventListeners();
					});
				} else if (res.status === 204) {
					friendRecordContent.mount([]);
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}
}
