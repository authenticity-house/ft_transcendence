import MyFriendRequestNode from '../../MyFriendRequestNode.js';
import UserNode from '../../UserNode.js';

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

	addEventListeners() {}
}

export const myFriendContent = new MyFriendContent();
