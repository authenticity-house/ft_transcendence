import apiEndpoints from '../../../constants/apiConfig.js';
import { getCookie } from '../../../utils/getCookie.js';
import MyFriendRequestNode from '../../MyFriendRequestNode.js';
import UserNode from '../../UserNode.js';
import { profileModal } from './ProfileModal.js';

const html = String.raw;

class MyFriendContent {
	template() {
		return html`
			<div class="my-friend-content-container">
				<div class="my-friend-list-container">
					<span class="display-medium44 yellow_neon_10">친구 목록</span>
					<div class="my-friend container">
						<div class="my-friend-row row"></div>
					</div>
				</div>
				<div class="my-friend-request-container">
					<div class="my-friend-request-sent-container">
						<span class="display-medium44 yellow_neon_10">보낸 요청</span>
						<div class="my-friend-request-sent"></div>
					</div>
					<div class="my-friend-request-received-container">
						<span class="display-medium44 yellow_neon_10">받은 요청</span>
						<div class="my-friend-request-received"></div>
					</div>
				</div>
			</div>
		`;
	}

	mount(data) {
		this.data = data;

		let myFriends = '';
		let myFriendRequestsSent = '';
		let myFriendRequestsReceived = '';

		for (let i = 0; i < data.friends.length; i += 1) {
			const myFriendNode = new UserNode(data.friends[i]);
			myFriends += `
				<button class="user-node-button" data-bs-target="#friend-profile-modal" data-bs-toggle="modal">
			`;
			myFriends += myFriendNode.template();
			myFriends += '</button>';
		}

		for (let i = 0; i < data.friendRequestsSent.length; i += 1) {
			const myFriendRequestSentNode = new MyFriendRequestNode({
				nickname: data.friendRequestsSent[i],
				sent: true
			});
			myFriendRequestsSent += myFriendRequestSentNode.template();
		}

		for (let i = 0; i < data.friendRequestsReceived.length; i += 1) {
			const myFriendRequestReceivedNode = new MyFriendRequestNode({
				nickname: data.friendRequestsReceived[i],
				sent: false
			});
			myFriendRequestsReceived += myFriendRequestReceivedNode.template();
		}

		const myFriend = document.querySelector('.my-friend-row');
		const myFriendRequestSent = document.querySelector(
			'.my-friend-request-sent'
		);
		const myFriendRequestReceived = document.querySelector(
			'.my-friend-request-received'
		);

		myFriend.innerHTML = myFriends;
		myFriendRequestSent.innerHTML = myFriendRequestsSent;
		myFriendRequestReceived.innerHTML = myFriendRequestsReceived;
	}

	mountFriends(data) {
		let myFriends = '';

		for (let i = 0; i < data.length; i += 1) {
			const myFriendNode = new UserNode(data[i]);
			myFriends += `
				<button id="friend-profile-button-${data[i].pk}" class="user-node-button" data-bs-target="#friend-profile-modal" data-bs-toggle="modal">
			`;
			myFriends += myFriendNode.template();
			myFriends += '</button>';
		}

		const myFriend = document.querySelector('.my-friend-row');
		myFriend.innerHTML = myFriends;
	}

	mountFriendRequestsSent(data) {
		let myFriendRequestsSent = '';

		for (let i = 0; i < data.length; i += 1) {
			const myFriendRequestSentNode = new MyFriendRequestNode({
				nickname: data[i].nickname,
				sent: true
			});
			myFriendRequestsSent += myFriendRequestSentNode.template(data[i].pk);
		}

		const myFriendRequestSent = document.querySelector(
			'.my-friend-request-sent'
		);
		myFriendRequestSent.innerHTML = myFriendRequestsSent;
	}

	mountFriendRequestsReceived(data) {
		let myFriendRequestsReceived = '';

		for (let i = 0; i < data.length; i += 1) {
			const myFriendRequestReceivedNode = new MyFriendRequestNode({
				nickname: data[i].nickname,
				sent: false
			});
			myFriendRequestsReceived += myFriendRequestReceivedNode.template(
				data[i].pk
			);
		}

		const myFriendRequestReceived = document.querySelector(
			'.my-friend-request-received'
		);
		myFriendRequestReceived.innerHTML = myFriendRequestsReceived;
	}

	addFriendsEventListeners() {
		const myFriendNodes = document.querySelectorAll('.user-node-button');

		myFriendNodes.forEach((myFriendNode) => {
			myFriendNode.addEventListener('click', () => {
				const userPk = myFriendNode.id.split('-')[3];
				profileModal.openFriendModal(userPk);
			});
		});
	}

	addFriendRequestsSentEventListeners() {
		const myFriendRequestSentNodes = document.querySelectorAll(
			'.my-friend-request-node-cancel'
		);

		// 친구 요청 취소
		myFriendRequestSentNodes.forEach((myFriendRequestSentNode) => {
			myFriendRequestSentNode.addEventListener('click', () => {
				const userPk = myFriendRequestSentNode.id.split('-')[4];
				fetch(`${apiEndpoints.MY_FRIEND_REQUEST_SENT_URL}${userPk}/`, {
					method: 'DELETE',
					headers: {
						'Content-Type': 'application/json',
						'X-CSRFToken': getCookie('csrftoken')
					}
				})
					.then((res) => {
						if (res.status !== 204)
							throw new Error('친구 요청 취소에 실패했습니다.');
					})
					.then(() => {
						// 친구 요청 보낸 목록 다시 불러오기
						this.fetchFriendRequestsSent();
					})
					.catch((error) => {
						alert(error);
					});
			});
		});
	}

	addFriendRequestsReceivedEventListeners() {
		const myFriendRequestReceivedAcceptNodes = document.querySelectorAll(
			'.my-friend-request-node-accept'
		);
		const myFriendRequestReceivedRejectNodes = document.querySelectorAll(
			'.my-friend-request-node-reject'
		);

		// 친구 요청 수락
		myFriendRequestReceivedAcceptNodes.forEach(
			(myFriendRequestReceivedAcceptNode) => {
				myFriendRequestReceivedAcceptNode.addEventListener('click', () => {
					const userPk = myFriendRequestReceivedAcceptNode.id.split('-')[4];
					fetch(`${apiEndpoints.MY_FRIEND_REQUEST_RECEIVED_URL}${userPk}/`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							'X-CSRFToken': getCookie('csrftoken')
						}
					})
						.then((res) => {
							if (res.status !== 204)
								throw new Error('친구 요청 수락에 실패했습니다.');
						})
						.then(() => {
							// 친구 요청 받은 목록 다시 불러오기
							this.fetchFriendRequestsReceived();
							// 친구 목록 다시 불러오기
							this.fetchFriends();
						})
						.catch((error) => {
							alert(error);
						});
				});
			}
		);

		// 친구 요청 거절
		myFriendRequestReceivedRejectNodes.forEach(
			(myFriendRequestReceivedRejectNode) => {
				myFriendRequestReceivedRejectNode.addEventListener('click', () => {
					const userPk = myFriendRequestReceivedRejectNode.id.split('-')[4];
					fetch(`${apiEndpoints.MY_FRIEND_REQUEST_RECEIVED_URL}${userPk}/`, {
						method: 'DELETE',
						headers: {
							'Content-Type': 'application/json',
							'X-CSRFToken': getCookie('csrftoken')
						}
					})
						.then((res) => {
							if (res.status !== 204)
								throw new Error('친구 요청 거절에 실패했습니다.');
						})
						.then(() => {
							// 친구 요청 받은 목록 다시 불러오기
							this.fetchFriendRequestsReceived();
						})
						.catch((error) => {
							alert(error);
						});
				});
			}
		);
	}

	fetchFriends() {
		fetch(apiEndpoints.MY_FRIEND_URL, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': getCookie('csrftoken')
			},
			mode: 'same-origin'
		}).then((res) => {
			if (res.status === 200) {
				res.json().then((data) => {
					this.mountFriends(data);
					this.addFriendsEventListeners();
				});
			}
		});
	}

	fetchFriendRequestsSent() {
		fetch(apiEndpoints.MY_FRIEND_REQUEST_SENT_URL, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': getCookie('csrftoken')
			},
			mode: 'same-origin'
		}).then((res) => {
			if (res.status === 200) {
				res.json().then((data) => {
					this.mountFriendRequestsSent(data);
					this.addFriendRequestsSentEventListeners();
				});
			}
		});
	}

	fetchFriendRequestsReceived() {
		fetch(apiEndpoints.MY_FRIEND_REQUEST_RECEIVED_URL, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'X-CSRFToken': getCookie('csrftoken')
			},
			mode: 'same-origin'
		}).then((res) => {
			if (res.status === 200) {
				res.json().then((data) => {
					this.mountFriendRequestsReceived(data);
					this.addFriendRequestsReceivedEventListeners();
				});
			}
		});
	}
}

export const myFriendContent = new MyFriendContent();
