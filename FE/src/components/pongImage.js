const html = String.raw;

function generatePongImageStyle(str) {
	switch (str) {
		case 'online':
			return { top: '34rem', left: '18.5rem', width: '28rem' };
		case 'onlineTournament':
			return { top: '38.9rem', left: '22rem', width: '21rem' };
		default:
			return { top: '25rem', left: '18.5rem', width: '28rem' };
	}
}

export function pongImage(str) {
	const { top, left, width } = generatePongImageStyle(str);

	return html`<div style="position:absolute; top: ${top}; left: ${left}">
		<img
			class="img_pink_neon"
			src="./image/left_pong.svg"
			style="width: ${width};"
		/>
		<div style="position:absolute; top:0rem; left: 15em">
			<img
				class="img_blue_neon"
				src="./image/right_pong.svg"
				style="width: ${width}"
			/>
		</div>
	</div>`;
}
