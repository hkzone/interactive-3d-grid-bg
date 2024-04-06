vec2 uv = vUv;
uv = rotateUV(vUv, PI / 2., vec2(0.5));
vec4 color;

vec2 faceUV = uv;

// Top face
if (vNorm == vec3(0, 1, 0)) {
vec2 subUv = getSubUV(uDimensions, uv, vInstanceID);
color = texture2D(uTexture, subUv);
}

// Edge color for the sides 

else {
if (abs(vNorm.x) > 0.9) {
faceUV = rotateUV(uv, - PI / 2., vec2(0.5));

if (vNorm.x > 0.9) faceUV.y = 1. - faceUV.y; //right edge face
else faceUV.x = 1. - faceUV.x;  //left  edge face

vec2 edgeUV = getSubUV(uDimensions, faceUV, vInstanceID);

float index = uDimensions.y - floor(vInstanceID / uDimensions.y) - 1.;
edgeUV.y = vNorm.x > 0.9 ? 0.5 : 1.;
edgeUV.y = vNorm.x > 0.9 ? 1. / uDimensions.y * index : 1. / uDimensions.y * (index + 1.); // display only edge of the texture

color = texture2D(uTexture, edgeUV);

}

if (abs(vNorm.z) > 0.9) {
faceUV = rotateUV(uv, PI, vec2(0.5));

//bottom edge face
if (vNorm.z > 0.9) faceUV.y = 1. - faceUV.y;

//top edge face
else faceUV.x = 1. - faceUV.x;

vec2 edgeUV = getSubUV(uDimensions, faceUV, vInstanceID);

float index = mod(vInstanceID, uDimensions.y);
edgeUV.x = vNorm.z > 0.9 ? 1. / uDimensions.x * index : 1. / uDimensions.x * (index + 1.); // display only edge of the texture

color = texture2D(uTexture, edgeUV);
}

}

// color = vec4(vInstanceID/(uDimensions.x*uDimensions.y),0.,0.,1.);
vec4 diffuseColor = color;