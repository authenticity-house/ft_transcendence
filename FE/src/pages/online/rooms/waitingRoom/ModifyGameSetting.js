import GameSettingDetailedComponent from '../../../../components/gameSettingDetailed/GameSettingDetailedComponent.js';

class ModifyGameSetting {
	constructor() {
		this.setting = new GameSettingDetailedComponent();
		this.onConfirmCallback = null;
	}

	template(initial) {
		this.data = initial;
		this.data.total_score /= 5;

		return this.setting.template(this.data, 'modify');
	}

	addEventListeners() {
		this.setting.addEventListeners();

		const confirmButton = document.querySelector(
			'.horizontalButton button:nth-child(2)'
		);

		confirmButton.addEventListener('click', () => {
			if (this.onConfirmCallback) {
				const data = this.setting.getModifiedData();
				data.total_score *= 5;
				this.onConfirmCallback(data);
			}
		});
	}

	setOnConfirmCallback(callback) {
		this.onConfirmCallback = callback;
	}
}

export default new ModifyGameSetting();
