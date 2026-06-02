import * as THREE from 'three';

export default class SceneManager {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;

    this.onWindowResize = this.onWindowResize.bind(this);
    this.animate = this.animate.bind(this);
  }

  init() {
    if (this.scene && this.camera && this.renderer) {
      return;
    }

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x11161d);

    this.setupCamera();
    this.setupRenderer();
    this.setupLights();

    window.addEventListener('resize', this.onWindowResize);
  }

  setupCamera() {
    this.camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );

    this.camera.position.set(0, 8.5, 8.5);
    this.camera.lookAt(0, 0, 0);

    // OrbitControls varsa (ör. ileride eklerseniz):
    // controls.minDistance = 7;
    // controls.maxDistance = 14;
    // controls.target.set(0, 0, 0);
    // Not: Bu projede controls kullanılmıyor.
  }

  setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.64);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.28);

    directionalLight.position.set(4, 9, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 40;
    directionalLight.shadow.camera.left = -7.5;
    directionalLight.shadow.camera.right = 7.5;
    directionalLight.shadow.camera.top = 7.5;
    directionalLight.shadow.camera.bottom = -7.5;
    directionalLight.shadow.bias = -0.00035;
    directionalLight.shadow.radius = 4;

    this.scene.add(ambientLight);
    this.scene.add(directionalLight);
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.domElement.style.position = 'fixed';
    this.renderer.domElement.style.inset = '0';
    this.renderer.domElement.style.display = 'block';

    document.body.appendChild(this.renderer.domElement);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  animate() {
    requestAnimationFrame(this.animate);
    this.render();
  }
}
