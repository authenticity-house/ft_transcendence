import GameSettingDetailedComponent from '../../../components/gameSettingDetailed/GameSettingDetailedComponent.js';

class OnlineGameSettingDetailed {
	constructor() {
		this.setting = new GameSettingDetailedComponent();
	}

	template(initial) {
		return this.setting.template(initial, 'online');
	}

	addEventListeners() {
		this.setting.addEventListeners();
	}
}
export default new OnlineGameSettingDetailed();
