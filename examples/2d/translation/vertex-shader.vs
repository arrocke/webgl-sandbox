attribute vec2 a_position;

uniform vec2 u_resolution;
uniform vec2 u_translation;

void main() {
    // translate the position
    vec2 position = a_position + u_translation;

    // convert the position from pixels to clipspace
    vec2 clipspace = 2.0 * position / u_resolution - 1.0;

    gl_Position = vec4(clipspace, 0, 1);
}
