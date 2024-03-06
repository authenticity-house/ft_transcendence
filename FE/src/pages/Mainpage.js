// Create a function to render the Mainpage
export default function Mainpage() {
	// Create a div element
	const div = document.createElement('div');
	// Set the innerHTML of the div
	div.innerHTML = `<h1>Mainpage</h1>`;
	// Append the div to the body
	document.body.appendChild(div);
}
