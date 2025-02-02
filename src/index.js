import { loadShader, createProgram } from "./gl-helpers.js";

async function init() {
	const canvas = document.getElementById("glCanvas");
	
	/** @type {WebGLRenderingContext} */
	const gl = canvas.getContext("webgl");

	// Set canvas size
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	gl.viewport(0, 0, canvas.width, canvas.height);

	try {
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

		const positionLoc = gl.getAttribLocation(program, "a_position");
		gl.enableVertexAttribArray(positionLoc);
		gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

		// Initial render
		gl.clearColor(0, 0, 0, 1);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

		// Handle window resize
		window.addEventListener("resize", () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
			gl.viewport(0, 0, canvas.width, canvas.height);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		});
	} catch (error) {
		console.error("WebGL initialization failed:", error);
	}
}

// Start the application
window.addEventListener("DOMContentLoaded", init);
