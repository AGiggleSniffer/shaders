import { loadShader, createProgram } from "./gl-helpers.js";

async function run() {
	/** @type {HTMLCanvasElement} */
	const canvas = document.getElementById("glCanvas");
	const gl = canvas.getContext("webgl");

	// Set canvas size
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	gl.viewport(0, 0, canvas.width, canvas.height);

	// Load shaders
	const vertShader = await loadShader(
		gl,
		gl.VERTEX_SHADER,
		"src/shaders/test.vert",
	);

	const fragShader = await loadShader(
		gl,
		gl.FRAGMENT_SHADER,
		"src/shaders/test.frag",
	);

	// Create program
	const program = createProgram(gl, vertShader, fragShader);
	gl.useProgram(program);

	// Fullscreen quad setup
	const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
	const buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	// Variables
	const positionLoc = gl.getAttribLocation(program, "a_position");
	gl.enableVertexAttribArray(positionLoc);
	gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

	// Uniforms
	const uResolution = gl.getUniformLocation(program, "u_resolution");
	gl.uniform2f(uResolution, canvas.width, canvas.height);

	const uTime = gl.getUniformLocation(program, "u_time");

	// Handle window resize
	window.addEventListener("resize", () => {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		gl.uniform2f(uResolution, canvas.width, canvas.height);
		gl.viewport(0, 0, canvas.width, canvas.height);
	});

	// Render loop
	const start = Date.now();
	function render() {
		const duration = Date.now() - start;
		gl.uniform1f(uTime, duration);

		// Clear and Render
		gl.clearColor(0, 0, 0, 1);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		setTimeout(render, 200);
	}

	render();
}

// Start the application
window.addEventListener("DOMContentLoaded", run);
