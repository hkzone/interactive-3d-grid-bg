import * as THREE from 'three';

export class Rendering {
  constructor(canvas) {
    this.canvas = canvas;

    this.vp = {
      canvas: {
        width: canvas.offsetWidth,
        height: canvas.offsetHeight,
        dpr: Math.min(window.devicePixelRatio, 2),
      },
      scene: {
        width: 1,
        height: 1,
      },
      screen: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    };
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas,
      stencil: false,
    });

    this.renderer.setSize(this.vp.canvas.width, this.vp.canvas.height, false);
    this.renderer.setPixelRatio(this.vp.canvas.dpr);

    this.camera = new THREE.PerspectiveCamera(
      5,
      this.vp.canvas.width / this.vp.canvas.height,
      0.1,
      10000
    );

    this.scene = new THREE.Scene();

    this.clock = new THREE.Clock();

    this.vp.scene = this.getViewSizeAtDepth();

    this.disposed = false;
  }
  dispose() {}
  getViewSizeAtDepth(depth = 0) {
    const fovInRadians = (this.camera.fov * Math.PI) / 180;
    const height = Math.abs(
      (this.camera.position.z - depth) * Math.tan(fovInRadians / 2) * 2
    );
    return { width: height * this.camera.aspect, height };
  }
  init() {}
  render() {
    this.renderer.render(this.scene, this.camera);
  }
  onResize = () => {
    let canvas = this.canvas;
    this.vp.canvas.width = canvas.offsetWidth;
    this.vp.canvas.height = canvas.offsetHeight;
    this.vp.canvas.dpr = Math.min(window.devicePixelRatio, 2);

    this.vp.scene.width = window.innerWidth;
    this.vp.scene.height = window.innerHeight;

    this.renderer.setSize(this.vp.canvas.width, this.vp.canvas.height, false);
    this.camera.aspect = this.vp.canvas.width / this.vp.canvas.height;
    this.camera.updateProjectionMatrix();

    this.vp.scene = this.getViewSizeAtDepth();
  };
}
