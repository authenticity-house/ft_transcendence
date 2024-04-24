import GameSettingDetailedComponent from '../../../components/gameSettingDetailed/GameSettingDetailedComponent.js';

class GameSettingDetailed {
	constructor() {
		this.setting = new GameSettingDetailedComponent();
	}

	template(initial) {
		return this.setting.template(initial, 'local');
	}

	addEventListeners() {
		this.setting.addEventListeners();
	}
}
export default new GameSettingDetailed();
