#include <common>

uniform sampler2D uTexture;
uniform vec2 uDimensions;

varying vec2 vUv;
varying vec3 vNorm;
varying float vInstanceID;

vec2 getSubUV(vec2 _dimensions, vec2 _uv, float _index) {
    float index = _index * (1.0 / _dimensions.x);
    vec2 uv = _uv;
    uv /= _dimensions;
    uv.y += (1.0 / _dimensions.y) * (_dimensions.y - 1.0);
    uv.x += floor(fract(index) * _dimensions.x) / _dimensions.x;
    uv.y -= floor(fract(index / _dimensions.y) * _dimensions.y) / _dimensions.y;
    return uv;
}

vec2 rotateUV(vec2 uv, float r, vec2 origin) {
    float c = cos(r);
    float s = sin(r);
    mat2 m = mat2(c, -s, s, c);
    vec2 st = uv - origin;
    st = m * st;
    return st + origin;
}
