import GameSettingDetailedComponent from '../../../components/gameSettingDetailed/GameSettingDetailedComponent.js';

class ModifyGameSetting {
	constructor() {
		this.setting = new GameSettingDetailedComponent();
	}

	template(initial) {
		return this.setting.template(initial, 'modify');
	}

	addEventListeners() {
		this.setting.addEventListeners();
		const confirmButton = document.querySelector(
			'.horizontalButton button:nth-child(2)'
		);
		confirmButton.addEventListener('click', () => {
			console.log('버튼클리이익');
		});
	}
}
export default new ModifyGameSetting();
