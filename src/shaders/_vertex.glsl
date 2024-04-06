vUv = uv;
vNorm = normal;
vInstanceID = aInstanceID;

vec4 position = instanceMatrix[3];
float toCenter = length(position.xz);

float mouseTrail = sdSegment(position.xz, uPos0, uPos1);
mouseTrail = smoothstep(uMouseSizeMin, uMouseSizeMax, mouseTrail);

transformed *= 1. + (1. - mouseTrail) * uMouseScale * uMouseAnimate;

float start = toCenter * 0.02;
float end = start + (toCenter + 1.5) * 0.06;
float anim = map(clamp(uAnimate, start, end), start, end, 0., 1.);

transformed.y += (- uMouseDisplacement * (1. - mouseTrail)) * uMouseAnimate;

transformed.xyz *= cubicInOut(anim);
transformed.y += cubicOut(1. - anim) * 1.;
transformed.y += sin(toCenter + uTime * 2.) * uWaveStrength;

vec4 mvPosition = vec4(transformed, 1.0);

    #ifdef USE_INSTANCING

mvPosition = instanceMatrix * mvPosition;

    #endif

mvPosition = modelViewMatrix * mvPosition;

gl_Position = projectionMatrix * mvPosition;