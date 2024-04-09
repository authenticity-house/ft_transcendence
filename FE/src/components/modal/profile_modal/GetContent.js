import { myFriendContent } from './MyFriendContent.js';
import { myRecordContent } from './MyRecordContent.js';
import { userSearchContent } from './UserSearchContent.js';
import { statsContent } from './StatsContent.js';

export function getContent(id) {
	if (id === 'match-record') {
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
	} else if (id === 'user-search') {
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
			},
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
			},
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
			},
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
			},
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
	} else if (id === 'my-friend') {
		// my-friend 탭을 클릭했을 때 친구 목록을 렌더링
		// mock-data
		const data = {
			friends: [
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
			],
			friendRequestsSent: [
				'jeongrol',
				'wonyang',
				'jeongrol',
				'wonyang',
				'jeongrol',
				'wonyang',
				'jeongrol',
				'wonyang',
				'jeongrol',
				'wonyang',
				'jeongrol',
				'wonyang',
				'jeongrol',
				'wonyang',
				'jeongrol',
				'wonyang',
				'jeongrol',
				'wonyang',
				'jeongrol',
				'wonyang',
				'jeongrol',
				'wonyang',
				'jeongrol',
				'wonyang',
				'jeongrol',
				'wonyang',
				'jihylim'
			],
			friendRequestsReceived: ['jeongmin', 'joyoo']
		};

		myFriendContent.mount(data);
		myFriendContent.addEventListeners();
	} else if (id === 'stats') {
		const data = {
			ratingChange: [
				1000, 1050, 1100, 1050, 1100, 1150, 1100, 1150, 1200, 1150, 1200, 1250
			],
			attackTendency: [
				{ title: '공격형', value: 50, color: '#ff5d84' },
				{ title: '전체형', value: 30, color: '#ffd164' },
				{ title: '방어형', value: 20, color: '#5ad7ff' }
			]
		};
		const toolTip = statsContent.mount(data);
		statsContent.addEventListeners(toolTip);
	}
}
