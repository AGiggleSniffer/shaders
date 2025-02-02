/** @param {WebGLRenderingContext} gl */
export async function loadShader(gl, type, url) {
	const response = await fetch(url);
	const source = await response.text();
	return compileShader(gl, type, source);
}

/** @param {WebGLRenderingContext} gl */
function compileShader(gl, type, source) {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		throw new Error(
			`Shader compilation error: ${gl.getShaderInfoLog(shader)}`,
		);
	}

	return shader;
}

/** @param {WebGLRenderingContext} gl */
export function createProgram(gl, vertexShader, fragmentShader) {
	const program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		throw new Error(`Program link error: ${gl.getProgramInfoLog(program)}`);
	}

	return program;
}
