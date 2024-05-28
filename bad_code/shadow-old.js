/**
 * 作废 - 光源不显示
 */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'
import Stats from 'three/examples/jsm/libs/stats.module';

// 创建场景、相机、渲染器
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  100, window.innerWidth / window.innerHeight, 0.1, 1000
);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)


// 创建立方体
const createCube = () => {
  const geometry = new THREE.BoxGeometry(20, 20, 10);
  const material = new THREE.MeshBasicMaterial({ color: "#8B7500" })
  const cube = new THREE.Mesh(geometry, material)

  // 立方体的旋转角度
  cube.rotation.set(0, 0, 0)
  cube.position.set(0, 0, 10)
  scene.add(cube)

  cube.castShadow = true
  cube.receiveShadow = true

  return cube;
}

// 创建地板
const createPlane = () => {
  const planeGeometry = new THREE.PlaneGeometry(100, 100)
  const planeMaterial = new THREE.MeshBasicMaterial()
  const plane = new THREE.Mesh(planeGeometry, planeMaterial)

  plane.position.set(-1, -1, -3)
  plane.rotation.set(0, 0, 0)
  // plane.castShadow = true
  plane.receiveShadow = true

  scene.add(plane)

  return plane
}

// 创建光源
const createLight = () => {
  const directionalLight = new THREE.DirectionalLight('#00FF00', 1)
  directionalLight.position.set(2, 2, 0)
  directionalLight.castShadow = true
  directionalLight.visible = true
  scene.add(directionalLight)

  return directionalLight
}

// 创建聚光灯
const createFocusLight = () => {
  const focusLight = new THREE.HemisphereLight(0xffffff, 0x444444)
  focusLight.intensity = 0.6
  scene.add(focusLight)
  const hemiHelper = new THREE.HemisphereLightHelper(focusLight, 30)
  scene.add(hemiHelper)


  const light = new THREE.DirectionalLight(0xfffffff, 0.8)
  light.position.set(5, 5, 5)
  scene.add(light)
  const directHelper = new THREE.DirectionalLightHelper(light, 30)
  scene.add(directHelper)

  // 聚光灯
  const spotLight = new THREE.SpotLight('green', 0.8)
  spotLight.angle = Math.PI / 8 // 散射角度
  spotLight.penumbra = 0.1 // 聚光锥的半影缩减百分比
  spotLight.decay = 2; // 纵向沿着光照距离的缩减量
  spotLight.distance = 30;
  spotLight.shadow.radius = 10
  spotLight.shadow.mapSize.set(256, 256) // 阴影映射的宽高
  spotLight.position.set(-5, 5, 25)
  spotLight.target.position.set(0, 0, 0)

  spotLight.castShadow = true // 开启阴影
  spotLight.shadow.mapSize.width = 512;
  spotLight.shadow.mapSize.height = 512;
  spotLight.shadow.camera.near = 0.5;
  spotLight.shadow.camera.far = 100;

  spotLight.decay = 0

  scene.add(spotLight)

  const spotHelper = new THREE.SpotLightHelper(spotLight, '#23d96e')
  scene.add(spotHelper)

  return spotLight
}

// 创建点光源
const createPointLight = () => {
  const pointLight = new THREE.PointLight('pink')
  pointLight.position.set(0, 0, 10)
  scene.add(pointLight)

  const pointLightHelper = new THREE.PointLightHelper(pointLight, 10)
  scene.add(pointLightHelper)
}

const stats = new Stats()
document.body.appendChild(stats.dom)

// 创建环境光
const ambient = new THREE.AmbientLight('red', 0.4)
scene.add(ambient)

const createGUI = (light) => {
  const data = {
    color: light.color.getHex(),
    mapsEnabled: true,
    shadowMapSizeWidth: 512,
    shadowMapSizeHeight: 512,
  };
  const torusGeometry = [
    new THREE.TorusGeometry(),
    new THREE.TorusGeometry(),
    new THREE.TorusGeometry(),
    new THREE.TorusGeometry(),
    new THREE.TorusGeometry(),
  ];
  const material = [
    new THREE.MeshBasicMaterial(),
    new THREE.MeshLambertMaterial(),
    new THREE.MeshPhongMaterial(),
    new THREE.MeshPhysicalMaterial({}),
    new THREE.MeshToonMaterial(),
  ];
  const torus = [
    new THREE.Mesh(torusGeometry[0], material[0]),
    new THREE.Mesh(torusGeometry[1], material[1]),
    new THREE.Mesh(torusGeometry[2], material[2]),
    new THREE.Mesh(torusGeometry[3], material[3]),
    new THREE.Mesh(torusGeometry[4], material[4]),
  ];
  
  const texture = new THREE.TextureLoader().load('images/grid_25.jpg');
  material[0].map = texture;
  material[1].map = texture;
  material[2].map = texture;
  material[3].map = texture;
  material[4].map = texture;
  
  torus[0].position.x = -8;
  torus[1].position.x = -4;
  torus[2].position.x = 0;
  torus[3].position.x = 4;
  torus[4].position.x = 8;
  
  torus[0].castShadow = true;
  torus[1].castShadow = true;
  torus[2].castShadow = true;
  torus[3].castShadow = true;
  torus[4].castShadow = true;
  
  torus[0].receiveShadow = true;
  torus[1].receiveShadow = true;
  torus[2].receiveShadow = true;
  torus[3].receiveShadow = true;
  torus[4].receiveShadow = true;
  
  scene.add(torus[0]);
  scene.add(torus[1]);
  scene.add(torus[2]);
  scene.add(torus[3]);
  scene.add(torus[4]);
  const gui = new GUI();

  const lightFolder = gui.addFolder('THREE.Light');
  lightFolder.addColor(data, 'color').onChange(() => {
    light.color.setHex(Number(data.color.toString().replace('#', '0x')));
  });
  lightFolder.add(light, 'intensity', 0, 1, 0.01);
  lightFolder.open();

  const spotLightFolder = gui.addFolder('THREE.SpotLight');
  spotLightFolder.add(light, 'distance', 0, 100, 0.01);
  spotLightFolder.add(light, 'decay', 0, 4, 0.1);
  spotLightFolder.add(light, 'angle', 0, 1, 0.1);
  spotLightFolder.add(light, 'penumbra', 0, 1, 0.1);
  spotLightFolder
    .add(light.shadow.camera, 'near', 0.1, 100)
    .onChange(() => light.shadow.camera.updateProjectionMatrix());
  spotLightFolder
    .add(light.shadow.camera, 'far', 0.1, 100)
    .onChange(() => light.shadow.camera.updateProjectionMatrix());
  spotLightFolder
    .add(data, 'shadowMapSizeWidth', [256, 512, 1024, 2048, 4096])
    .onChange(() => updateShadowMapSize());
  spotLightFolder
    .add(data, 'shadowMapSizeHeight', [256, 512, 1024, 2048, 4096])
    .onChange(() => updateShadowMapSize());
  spotLightFolder.add(light.position, 'x', -50, 50, 0.01);
  spotLightFolder.add(light.position, 'y', -50, 50, 0.01);
  spotLightFolder.add(light.position, 'z', -50, 50, 0.01);
  spotLightFolder.open();

  function updateShadowMapSize() {
    light.shadow.mapSize.width = data.shadowMapSizeWidth;
    light.shadow.mapSize.height = data.shadowMapSizeHeight;
    (light.shadow.map) = null;
  }

  const meshesFolder = gui.addFolder('Meshes');
  meshesFolder.add(data, 'mapsEnabled').onChange(() => {
    material.forEach((m) => {
      if (data.mapsEnabled) {
        m.map = texture;
      } else {
        m.map = null;
      }
      m.needsUpdate = true;
    });
  });
}


const cube1 = createCube();
const plane1 = createPlane();
// const light1 = createLight()
const focusLight = createFocusLight()
// createPointLight();
createGUI(focusLight)




// 设置相机位置
camera.position.set(0, 0, 50);
// 加载阴影
renderer.shadowMap.enabled = true;

// 初始化控制器
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true; // 为控制器添加阻尼效果

// 修改渲染器的背景颜色

function animate(){
  requestAnimationFrame(animate)

  // cube1.rotation.x += 0.01
  // cube1.rotation.y += 0.01

  stats.update()

  renderer.render(scene, camera)
}

animate();