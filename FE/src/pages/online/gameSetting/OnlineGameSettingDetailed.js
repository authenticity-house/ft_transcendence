import GameSettingDetailedComponent from '../../../components/gameSettingDetailed/GameSettingDetailedComponent.js';
import { changeUrlData } from '../../../index.js';

class OnlineGameSettingDetailed {
	constructor() {
		this.setting = new GameSettingDetailedComponent();
	}

	template(initial) {
		this.battleMode = initial.battle_mode;
		return this.setting.template(initial);
	}

	addEventListeners() {
		this.setting.addEventListeners();
		this.addConfirmEventListener();
	}

	addConfirmEventListener() {
		const confirmButton = document.querySelector(
			'.horizontalButton button:nth-child(2)'
		);
		confirmButton.addEventListener('click', () => {
			const setting = {
				1: 'onlineSetting',
				2: 'onlineSettingTournament'
			};

			changeUrlData(
				setting[this.battleMode],
				this.setting.getModifiedData(),
				'notHistory'
			);
		});
	}
}
export default new OnlineGameSettingDetailed();
