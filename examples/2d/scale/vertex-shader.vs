attribute vec2 a_position;

uniform vec2 u_resolution;
uniform vec2 u_translation;
uniform vec2 u_rotation;
uniform vec2 u_scale;

void main() {
    // scale the position
    vec2 position1 = a_position * u_scale;

    // rotate the position
    vec2 position2 = vec2(
        position1.x * u_rotation.y + position1.y * u_rotation.x,
        position1.y * u_rotation.y - position1.x * u_rotation.x
    );

    // translate the position
    vec2 position3 = position2 + u_translation;

    // convert the position from pixels to clipspace
    vec2 clipspace = 2.0 * position3 / u_resolution - 1.0;

    gl_Position = vec4(clipspace, 0, 1);
}
