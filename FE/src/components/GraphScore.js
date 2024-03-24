const html = String.raw;

class GraphScore {
	static appendScoresToYAxis(maxScore) {
		const scoreText = document.querySelector(
			'.score-trend-canvas-text-container'
		);

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

	static getScoreTextPosition() {
		const scoreParent = document.querySelector(
			'.score-trend-canvas-text-container'
		);
		const scoreParentRect = scoreParent.getBoundingClientRect();
		const parentY = scoreParentRect.y;
		const position = [];

		let halfHeight;
		const scoreTextWrappers = document.querySelectorAll(
			'.score-trend-canvas-text-wrapper'
		);
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

	static appendScoreTrendGraph(leftScoreTrend, rightScoreTrend) {
		const position = this.getScoreTextPosition();
		const canvas = document.querySelector('.score-trend-canvas-draw-container');
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

	static appendScorePositionGraph(leftPosition, rightPosition) {
		const canvas = document.querySelector('.score-position-canvas');
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
export default GraphScore;
