attribute vec2 a_position;

uniform vec2 u_resolution;
uniform mat3 u_transformation;

void main() {
    // apply translation
    vec2 position = (u_transformation * vec3(a_position, 1)).xy;

    // convert the position from pixels to clipspace
    vec2 clipspace = 2.0 * position / u_resolution - 1.0;

    gl_Position = vec4(clipspace, 0, 1);
}
