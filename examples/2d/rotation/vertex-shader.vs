attribute vec2 a_position;

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform vec2 u_rotation;

void main() {
    // rotate the position
    vec2 position1 = vec2(
        a_position.x * u_rotation.y + a_position.y * u_rotation.x,
        a_position.y * u_rotation.y - a_position.x * u_rotation.x
    );

    // translate the position
    vec2 position2 = position1 + u_translation;

    // convert the position from pixels to clipspace
    vec2 clipspace = 2.0 * position2 / u_resolution - 1.0;

    gl_Position = vec4(clipspace, 0, 1);
}
