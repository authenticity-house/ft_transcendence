const html = String.raw;

function appendRatingText(ratingChange) {
	if (ratingChange.length < 10) return html``;

	// 레이팅 점수 최대값 100자리 정수로 올림, 최솟값 100자리 정수로 내림
	const ratingMax = Math.ceil(Math.max(...ratingChange) / 100) * 100;
	const ratingMin = Math.floor(Math.min(...ratingChange) / 100) * 100;
	return html`
		<div class="rating-change-text-wrapper">${ratingMax}</div>
		<div class="rating-change-text-wrapper">${ratingMin}</div>
	`;
}

function getWidthHeight(widthRem, heightRem) {
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

function getTextPosition() {
	const textParent = document.querySelector('.rating-change-text-container');
	const scoreParentRect = textParent.getBoundingClientRect();
	const parentY = scoreParentRect.y;
	const position = [];

	let halfHeight;
	const textWrapper = document.querySelectorAll('.rating-change-text-wrapper');
	textWrapper.forEach((child) => {
		const childRect = child.getBoundingClientRect();
		halfHeight = childRect.height / 2;
		const childY = childRect.y + halfHeight;
		const relativeY = childY - parentY;
		const number = parseInt(child.textContent, 10);
		position.unshift([number, relativeY]);
	});
	if (position.length !== 2) return [-1, -1, -1];
	const oneRating =
		(position[0][1] - position[1][1]) / (position[1][0] - position[0][0]);
	return [position[1][0], position[1][1], oneRating];
}

function drawCircle(ctx, x, y, color) {
	ctx.beginPath();
	ctx.strokeStyle = color;
	ctx.lineCap = 'round';
	ctx.arc(x, y, 2, 0, 2 * Math.PI);
	ctx.stroke();
	ctx.closePath();
}

function drawLine(ctx, x1, y1, x2, y2, color) {
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

function drawRatingChange(ratingChange) {
	const canvas = document.querySelector('.rating-change-canvas');
	// canvas width 34rem, height 24rem을 px단위로 변환
	const [canvasWidth, canvasHeight] = getWidthHeight(34, 24);
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;
	// 레이팅 최대 최소 좌표 가져오기 (canvas y좌표 활용)
	const [maxNumber, maxNumberY, ratingGapY] = getTextPosition();
	// 레이팅 최대 최소 좌표 이용해서 ratingChange 데이터 값들 canvas에 그리기
	const widthCount = ratingChange.length + 1;
	const widthDivide = canvas.width / widthCount;
	if (maxNumber !== -1) {
		const ctx = canvas.getContext('2d');
		for (let i = 0; i < ratingChange.length - 1; i += 1) {
			const x1 = (i + 1) * widthDivide;
			const x2 = (i + 2) * widthDivide;
			const y1 = (maxNumber - ratingChange[i]) * ratingGapY + maxNumberY;
			const y2 = (maxNumber - ratingChange[i + 1]) * ratingGapY + maxNumberY;
			drawCircle(ctx, x1, y1, '#ffd164');
			drawCircle(ctx, x2, y2, '#ffd164');
			drawLine(ctx, x1, y1, x2, y2, '#ffd164');
		}
	}
}

function drawAttackTendency(attackTendency) {
	const canvas = document.querySelector('.attack-tendency-canvas');
	// canvas width 20rem, height 20rem을 px단위로 변환
	const [canvasWidth, canvasHeight] = getWidthHeight(20, 20);
	canvas.width = canvasWidth;
	canvas.height = canvasHeight;

	const fontSize = canvasWidth / 20 + 6;

	const ctx = canvas.getContext('2d');
	let totalValue = 0;
	attackTendency.forEach((tendency) => {
		totalValue += tendency.value;
	});
	const centerX = canvas.width / 2;
	const centerY = canvas.height / 2;
	const radius = Math.min(canvas.width, canvas.height) / 2;
	let startAngle = -Math.PI / 2;

	attackTendency.forEach((slice) => {
		const angle = (slice.value / totalValue) * 2 * Math.PI;
		const sliceMiddleAngle = startAngle + angle / 2;
		// 색상 채우기
		ctx.beginPath();
		ctx.fillStyle = slice.color;
		ctx.moveTo(centerX, centerY);
		ctx.arc(centerX, centerY, radius, startAngle, startAngle + angle);
		ctx.closePath();
		ctx.fill();
		startAngle += angle;
		// 텍스트 그리기
		if (slice.value !== 0) {
			const textX = centerX + (radius / 2) * Math.cos(sliceMiddleAngle);
			const textY = centerY + (radius / 2) * Math.sin(sliceMiddleAngle);
			ctx.fillStyle = '#000';
			ctx.font = `${fontSize}px GongGothicLight`;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText(slice.title, textX, textY);
		}
	});
}

export { appendRatingText, drawRatingChange, drawAttackTendency };
