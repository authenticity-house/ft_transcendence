import GameSettingDetailedComponent from '../../../components/gameSettingDetailed/GameSettingDetailedComponent.js';
import { changeUrlData } from '../../../index.js';

class ModifyGameSetting {
	constructor() {
		this.setting = new GameSettingDetailedComponent();
		this.onConfirmCallback = null; // 콜백 함수를 저장할 변수 추가
	}

	template(initial) {
		this.data = initial;
		this.data.total_score /= 5;

		return this.setting.template(this.data, 'modify');
	}

	addEventListeners() {
		// this.setting.setOnConfirmCallback(this.onConfirmCallback.bind(this));

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
		this.onConfirmCallback = callback; // 콜백 함수 등록 메서드
	}
}

export default new ModifyGameSetting();
