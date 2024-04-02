const html = String.raw;

export function pongImage() {
	return html`<div style="position:absolute; top: 25rem; left: 18.5rem">
		<img
			class="img_pink_neon"
			src="./image/left_pong.svg"
			style="width: 28rem;"
		/>
		<div style="position:absolute; top:0rem; left: 15em">
			<img
				class="img_blue_neon"
				src="./image/right_pong.svg"
				style="width: 28rem"
			/>
		</div>
	</div>`;
}
