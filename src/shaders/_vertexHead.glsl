attribute float aInstanceID;

  uniform float uTime;
  uniform vec2 uPos0;
  uniform vec2 uPos1;
  uniform float uAnimate;
  uniform float uMouseSizeMin;
  uniform float uMouseSizeMax;
  uniform float uMouseDisplacement;
  uniform float uMouseScale;
  uniform float uWaveStrength;
  uniform float uMouseAnimate;


  varying vec2 vUv;
  varying float vInstanceID;
  varying vec3 vNorm;

  #pragma glslify: ease = require(glsl-easings/cubic-in-out)
  #pragma glslify: ease = require(glsl-easings/cubic-out)

  float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
  }

  float sdSegment( in vec2 p, in vec2 a, in vec2 b )
  {
    vec2 pa = p-a, ba = b-a;
    float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
    return length( pa - ba*h );
  }   

  void main(){