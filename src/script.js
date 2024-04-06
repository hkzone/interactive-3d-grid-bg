import './style.css';
import { gsap } from 'gsap';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';

import { Rendering } from './rendering';
import { getMousePos } from './utils';
import vertexHeadShader from './shaders/_vertexHead.glsl';
import vertexShader from './shaders/_vertex.glsl';
import fragmentHeadShader from './shaders/_fragmentHead.glsl';
import fragmentShader from './shaders/_fragment.glsl';

// ************************************************************************** //
// ********************** Setup Rendering and Controls ********************** //
// ************************************************************************** /

const rendering = new Rendering(document.querySelector('#canvas'));
const controls = new OrbitControls(rendering.camera, rendering.canvas);
controls.enableDamping = true;

// ************************************************************************** //
// ****************************** Camera Setup ****************************** //
// ************************************************************************** //

rendering.camera.position.x = 36.1;
rendering.camera.position.y = 79.38;
rendering.camera.position.z = -12.13;
rendering.camera.lookAt(new THREE.Vector3(0.3, 0, 0));

// ************************************************************************** //
// ***************************** Lighting Setup ***************************** //
// ************************************************************************** //

rendering.scene.add(new THREE.HemisphereLight(0x9f9f9f, 0xffffff, 1));
rendering.scene.add(new THREE.AmbientLight(0xffffff, 1));
const d2 = new THREE.DirectionalLight(0x909090, 1);
rendering.scene.add(d2);
d2.position.set(0.2, 0.5, 0.2);
d2.position.multiplyScalar(10);

const d1 = new THREE.DirectionalLight(0xffffff, 1);
rendering.scene.add(d1);
d1.position.set(-0.1, 0.5, -0.1);
d1.position.multiplyScalar(10);

// ************************************************************************** //
// ***************************** Shadow Mapping ***************************** //
// ************************************************************************** //
rendering.renderer.shadowMap.enabled = true;

d1.castShadow = true;

d1.shadow.camera.left = -11;
d1.shadow.camera.right = 11;
d1.shadow.camera.bottom = -11;
d1.shadow.camera.top = 11;
d1.shadow.camera.far = 9;

d1.shadow.mapSize.width = 2048;
d1.shadow.mapSize.height = 2048;

// const helper = new THREE.CameraHelper(d1.shadow.camera);
// rendering.scene.add(helper);

// ************************************************************************** //
// ************************* Load Background Texture ************************ //
// ************************************************************************** //
const textureLoader = new THREE.TextureLoader();
textureLoader.load('/bg.webp', (texture) => {
  texture.colorSpace = THREE.SRGBColorSpace;
  uniforms.uTexture.value = texture;
});

// ************************************************************************** //
// ******************************** Uniforms ******************************** //
// ************************************************************************** //

const uniforms = {
  uTime: new THREE.Uniform(),
  uPos0: new THREE.Uniform(new THREE.Vector2()),
  uPos1: new THREE.Uniform(new THREE.Vector2()),
  uAnimate: new THREE.Uniform(),
  uTexture: new THREE.Uniform(null),
  uDimensions: new THREE.Uniform(new THREE.Vector2()),
  uMouseSizeMin: new THREE.Uniform(0.1),
  uMouseSizeMax: new THREE.Uniform(1.8),
  uMouseDisplacement: new THREE.Uniform(1.5),
  uMouseScale: new THREE.Uniform(1),
  uWaveStrength: new THREE.Uniform(0.5),
  uMouseAnimate: new THREE.Uniform(0),
};

// ************************************************************************** //
// ****************** Function To Setup Instanced Mesh Grid ***************** //
// ************************************************************************** //
function createGeometry() {
  // Remove old mesh from the scene and dispose of its geometry and material
  if (mesh) {
    rendering.scene.remove(mesh);
    mesh.geometry.dispose();
    mesh.material.dispose();
  }

  //Create new geometry
  const { width, height } = rendering.getViewSizeAtDepth(
    Math.abs(rendering.camera.position.y)
  );
  const { grid } = options;
  const ratio = width > height ? 1 + (height / width) * 0.3 : 1.3;
  const size = (Math.max(width, height) / grid) * ratio;

  const gridSize = grid * size;
  const geometry = new THREE.BoxGeometry(size, size, size);
  const material = new THREE.MeshPhysicalMaterial();
  mesh = new THREE.InstancedMesh(geometry, material, grid * grid);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  uniforms.uDimensions.value.set(grid, grid);

  const dummy = new THREE.Object3D();
  let i = 0;
  for (let x = 0; x < grid; x++)
    for (let y = 0; y < grid; y++) {
      dummy.position.set(
        x * size - gridSize / 2 + size / 2,
        0,
        y * size - gridSize / 2 + size / 2
      );
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      i++;
    }

  mesh.instanceMatrix.needsUpdate = true;

  // Assign instance IDs
  const instanceIDs = new Float32Array(grid * grid);
  for (let i = 0; i < grid * grid; i++) {
    instanceIDs[i] = grid - 1 - (i % grid) + Math.floor(i / grid) * grid;
  }

  // Create buffer attribute for instanceIDs
  geometry.setAttribute(
    'aInstanceID',
    new THREE.InstancedBufferAttribute(instanceIDs, 1, false)
  );

  // ************************** Shader Customization ************************** //

  mesh.material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader.replace(
      'void main() {',
      vertexHeadShader
    );
    shader.vertexShader = shader.vertexShader.replace(
      '#include <project_vertex>',
      vertexShader
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <common>',
      fragmentHeadShader
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      `vec4 diffuseColor = vec4( diffuse, opacity );`,
      fragmentShader
    );

    shader.uniforms = {
      ...shader.uniforms,
      ...uniforms,
    };
  };

  // ************* Custom Depth Material Configuration for Shadows ************ //

  mesh.customDepthMaterial = new THREE.MeshDepthMaterial();
  mesh.customDepthMaterial.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader.replace(
      'void main() {',
      vertexHeadShader
    );
    shader.vertexShader = shader.vertexShader.replace(
      '#include <project_vertex>',
      vertexShader
    );

    shader.uniforms = {
      ...shader.uniforms,
      ...uniforms,
    };
  };
  mesh.customDepthMaterial.depthPacking = THREE.RGBADepthPacking;

  //Adding the Instance Mesh to Scene
  rendering.scene.add(mesh);
}

// ************************* Create The Initial Grid ************************ //
let mesh;
const options = { grid: 48 };
createGeometry();

// ************************************************************************** //
// ********************* Handle the window resize event ********************* //
// ************************************************************************** //
function onWindowResize() {
  // Update the rendering view and camera
  rendering.onResize();

  // Recreate geometry
  createGeometry();
}

window.addEventListener('resize', onWindowResize);

// ************************************************************************** //
// ****************** Mouse Events Handling and Raycasting ****************** //
// ************************************************************************** //

const hitPlane = new THREE.Mesh(
  new THREE.PlaneGeometry(),
  new THREE.MeshBasicMaterial()
);
hitPlane.rotation.x = -Math.PI / 2;
hitPlane.scale.setScalar(20);
hitPlane.updateWorldMatrix();

const raycaster = new THREE.Raycaster();

const mouse = new THREE.Vector2();
const v2 = new THREE.Vector2();

let mouseInitiated = false;

window.addEventListener('mousemove', (ev) => {
  if (!mouseInitiated) {
    mouseInitiated = true;
    uniforms.uMouseAnimate.value = 1;
  }

  let { x, y } = getMousePos(ev);

  x = 2 * (x / window.innerWidth - 0.5);
  y = -2 * (y / window.innerHeight - 0.5);

  v2.set(x, y);

  raycaster.setFromCamera(v2, rendering.camera);

  const intersects = raycaster.intersectObject(hitPlane);

  if (intersects.length > 0) {
    const first = intersects[0];

    mouse.x = first.point.x;
    mouse.y = first.point.z;
  }
});

// ************************************************************************** //
// ********************************** Debug ********************************* //
// ************************************************************************** //

const gui = new GUI({
  width: 250,
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'h') {
    gui.show(gui._hidden);
  }
});

// gui
//   .add(rendering.camera.position, 'x', -100, 100)
//   .name('Camera X Position')
//   .onChange(() => {
//     rendering.camera.lookAt(new THREE.Vector3(0.3, 0, 0));
//   });
// gui
//   .add(rendering.camera.position, 'y', -100, 100)
//   .name('Camera Y Position')
//   .onChange(() => {
//     rendering.camera.lookAt(new THREE.Vector3(0.3, 0, 0));
//   });
// gui
//   .add(rendering.camera.position, 'z', -100, 100)
//   .name('Camera Z Position')
//   .onChange(() => {
//     rendering.camera.lookAt(new THREE.Vector3(0.3, 0, 0));
//   });

gui
  .add(options, 'grid', 2, 200, 2)
  .name('Grid Size')
  .onFinishChange(createGeometry);
gui.add(uniforms.uMouseSizeMin, 'value', 0, 1, 0.01).name('uMouseSizeMin');
gui.add(uniforms.uMouseSizeMax, 'value', 0.1, 10, 0.01).name('uMouseSizeMax');
gui
  .add(uniforms.uMouseDisplacement, 'value', 0, 10, 0.01)
  .name('uMouseDisplacement');
gui.add(uniforms.uMouseScale, 'value', 0, 10, 0.01).name('uMouseScale');
gui.add(uniforms.uWaveStrength, 'value', 0, 3, 0.01).name('uWaveStrength');

// ************************************************************************** //
// **************************** Startup Animation *************************** //
// ************************************************************************** //
const t1 = gsap.timeline();
t1.to(uniforms.uAnimate, { value: 1, duration: 3, ease: 'linear' });

// ************************************************************************** //
// ************************ Main Render Loop Function *********************** //
// ************************************************************************** //
const v3 = new THREE.Vector2();
const vel = new THREE.Vector2();

const tick = (t) => {
  v3.copy(mouse);
  v3.sub(uniforms.uPos0.value);
  v3.multiplyScalar(0.08);
  uniforms.uPos0.value.add(v3);

  v3.copy(uniforms.uPos0.value);
  v3.sub(uniforms.uPos1.value);
  v3.multiplyScalar(0.05); // target velocity

  v3.sub(vel);
  v3.multiplyScalar(0.08);

  vel.add(v3);
  uniforms.uPos1.value.add(vel);

  uniforms.uTime.value = t;
  rendering.render();
};

gsap.ticker.add(tick);
