attribute vec2 a_position;

uniform vec2 u_resolution;

void main() {
    // convert the position from pixels to clipspace
    vec2 clipspace = 2.0 * a_position / u_resolution - 1.0;

    gl_Position = vec4(clipspace, 0, 1);
}
