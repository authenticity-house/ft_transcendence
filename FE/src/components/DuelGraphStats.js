const html = String.raw;

class DuelGraphStats {
	static getScoreTrendHTML(matchData) {
		return html`
			<div class="score-trend-container">
				<div class="score-trend-title display-light24">득점 추이</div>
				<div class="score-trend-canvas-container">
					<div class="score-trend-canvas-text-container display-light10"></div>
					<canvas class="score-trend-canvas-draw-container"></canvas>
				</div>
				<div class="score-trend-player-name-container display-light16">
					<div class="score-trend-player-name-wrapper">
						<div class="score-player-name-margin-right">
							${matchData.leftPlayer}
						</div>
						<div class="score-player-color-yellow"></div>
					</div>
					<div class="score-trend-player-name-wrapper">
						<div class="score-player-name-margin-right">
							${matchData.rightPlayer}
						</div>
						<div class="score-player-color-blue"></div>
					</div>
				</div>
			</div>
		`;
	}

	static getScorePositionHTML(matchData) {
		return html`
			<div class="score-position-container">
				<div class="score-position-title display-light24">득점 위치</div>
				<canvas class="score-position-canvas"></canvas>
				<div class="score-position-player-name-container display-light16">
					<div class="score-position-player-left-wrapper">
						<div class="score-player-name-margin-right">
							${matchData.leftPlayer}
						</div>
						<div class="score-player-color-yellow"></div>
					</div>
					<div class="score-position-player-right-wrapper">
						<div class="score-player-color-blue"></div>
						<div class="score-player-name-margin-left">
							${matchData.rightPlayer}
						</div>
					</div>
				</div>
			</div>
		`;
	}

	static appendScoresToYAxis(maxScore, graphContainer) {
		const scoreText = graphContainer
			? graphContainer.querySelector('.score-trend-canvas-text-container')
			: document.querySelector('.score-trend-canvas-text-container');

		let scoreTextWrappers = '';
		for (let score = maxScore; score >= 0; score -= 1) {
			scoreTextWrappers += `<div class="score-trend-canvas-text-wrapper">${score}</div>`;
		}
		const htmlString = html`${scoreTextWrappers}`;
		const fragment = document
			.createRange()
			.createContextualFragment(htmlString);
		scoreText.appendChild(fragment);
	}

	static getScoreTextPosition(graphContainer) {
		const scoreParent = graphContainer
			? graphContainer.querySelector('.score-trend-canvas-text-container')
			: document.querySelector('.score-trend-canvas-text-container');
		const scoreParentRect = scoreParent.getBoundingClientRect();
		const parentY = scoreParentRect.y;
		const position = [];

		let halfHeight;
		const scoreTextWrappers = graphContainer
			? graphContainer.querySelectorAll('.score-trend-canvas-text-wrapper')
			: document.querySelectorAll('.score-trend-canvas-text-wrapper');
		scoreTextWrappers.forEach((child) => {
			const childRect = child.getBoundingClientRect();
			halfHeight = childRect.height / 2;
			const childY = childRect.y + halfHeight;
			const relativeY = childY - parentY;
			position.unshift(relativeY);
		});
		return position;
	}

	static drawScoreTrendCircle(ctx, x, y, color) {
		ctx.beginPath();
		ctx.strokeStyle = color;
		ctx.lineCap = 'round';
		ctx.arc(x, y, 2, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.closePath();
	}

	static drawLine(ctx, x1, y1, x2, y2, color) {
		ctx.beginPath();
		ctx.strokeStyle = color;
		if (color === '#ffffff') ctx.setLineDash([5, 5]);
		ctx.lineWidth = 2;
		ctx.lineCap = 'round';
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
		ctx.closePath();
	}

	static getWidthHeight(widthRem, heightRem) {
		const windowWidth = window.innerWidth;

		let canvasWidth = 0;
		let canvasHeight = 0;
		if (windowWidth > 2560) {
			canvasWidth = widthRem * 16;
			canvasHeight = heightRem * 16;
		} else if (windowWidth > 1920) {
			canvasWidth = widthRem * 10;
			canvasHeight = heightRem * 10;
		} else if (windowWidth > 1440) {
			canvasWidth = widthRem * 8;
			canvasHeight = heightRem * 8;
		} else if (windowWidth > 1024) {
			canvasWidth = widthRem * 6;
			canvasHeight = heightRem * 6;
		} else if (windowWidth > 768) {
			canvasWidth = widthRem * 4;
			canvasHeight = heightRem * 4;
		} else if (windowWidth > 425) {
			canvasWidth = widthRem * 3;
			canvasHeight = heightRem * 3;
		} else {
			canvasWidth = widthRem * 2;
			canvasHeight = heightRem * 2;
		}
		return [canvasWidth, canvasHeight];
	}

	static appendScoreTrendGraph(
		leftScoreTrend,
		rightScoreTrend,
		graphContainer
	) {
		const position = this.getScoreTextPosition(graphContainer);
		const canvas = graphContainer
			? graphContainer.querySelector('.score-trend-canvas-draw-container')
			: document.querySelector('.score-trend-canvas-draw-container');

		// canvas : 33.5rem , 36rem
		const [responsiveWidth, reponsiveHeight] = this.getWidthHeight(33.5, 36);
		canvas.width = responsiveWidth;
		canvas.height = reponsiveHeight;

		const widthCount = leftScoreTrend.length + 1;
		const widthDivide = canvas.width / widthCount;

		const ctx = canvas.getContext('2d');

		for (let i = 0; i < leftScoreTrend.length - 1; i += 1) {
			// left
			const x1 = (i + 1) * widthDivide;
			const x2 = (i + 2) * widthDivide;
			let y1 = position[leftScoreTrend[i]];
			let y2 = position[leftScoreTrend[i + 1]];

			this.drawScoreTrendCircle(ctx, x1, y1, '#ffd164');
			this.drawScoreTrendCircle(ctx, x2, y2, '#ffd164');
			this.drawLine(ctx, x1, y1, x2, y2, '#ffd164');

			// right
			y1 = position[rightScoreTrend[i]];
			y2 = position[rightScoreTrend[i + 1]];
			this.drawScoreTrendCircle(ctx, x1, y1, '#5ad7ff');
			this.drawScoreTrendCircle(ctx, x2, y2, '#5ad7ff');
			this.drawLine(ctx, x1, y1, x2, y2, '#5ad7ff');
		}
	}

	static drawScorePoisitionCircle(ctx, x, y, color) {
		ctx.beginPath();
		ctx.strokeStyle = color;
		ctx.lineCap = 'round';
		ctx.arc(x, y, 6, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.fillStyle = color;
		ctx.fill();
		ctx.closePath();
	}

	static appendScorePositionGraph(leftPosition, rightPosition, graphContainer) {
		const canvas = graphContainer
			? graphContainer.querySelector('.score-position-canvas')
			: document.querySelector('.score-position-canvas');
		// canvas : 28rem, 35.6rem
		const [responsiveWidth, reponsiveHeight] = this.getWidthHeight(33.5, 36);
		canvas.width = responsiveWidth;
		canvas.height = reponsiveHeight;

		const ctx = canvas.getContext('2d');
		const canvasHeight = canvas.height;
		const canvasWidth = canvas.width;
		const canvasYrange = 4;
		// leftPosition
		leftPosition.forEach((position) => {
			let y = position[1];
			y *= -1;
			const canvasY = (canvasHeight * (y + 2)) / canvasYrange;
			const color = '#ffd164';
			const canvasX = canvasWidth - 5;
			this.drawScorePoisitionCircle(ctx, canvasX, canvasY, color);
		});
		// rightPosition
		rightPosition.forEach((position) => {
			let y = position[1];
			y *= -1;
			const canvasY = (canvasHeight * (y + 2)) / canvasYrange;
			const color = '#5ad7ff';
			const canvasX = 5;
			this.drawScorePoisitionCircle(ctx, canvasX, canvasY, color);
		});
		// center line
		this.drawLine(
			ctx,
			canvasWidth / 2,
			0,
			canvasWidth / 2,
			canvasHeight,
			'#ffffff'
		);
	}
}

export default DuelGraphStats;
