import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'


// 创建场景
const scene = new THREE.Scene()
// 创建照相机
const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.innerHeight, 0.1, 1000
)
// 创建渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

renderer.shadowMap.enabled = true;

// 创建小球
const createBall = () => {
  const sphereGeo = new THREE.SphereGeometry(1, 20, 20)
  const material = new THREE.MeshBasicMaterial()
  const littleBall = new THREE.Mesh(sphereGeo, material)

  littleBall.castShadow = true;
  littleBall.position.set(0, 0, 10)

  scene.add(littleBall)
}

const createDirectLight = () => {
  const directLight = new THREE.DirectionalLight(0xffffff, 1)
  scene.add(directLight)
}

const createFloor = () => {
  const planeGeo = new THREE.PlaneGeometry(40, 40)
  const material = new THREE.MeshBasicMaterial({ color: '#ccc' });

  const floor = new THREE.Mesh(planeGeo, material)
  floor.receiveShadow = true;

  scene.add(floor)
}

const openControls = () => {
  new OrbitControls(camera, renderer.domElement)
}

const animate = () => {
  requestAnimationFrame(animate)

  renderer.render(scene, camera)
}

camera.position.set(0, 0, 50)

createDirectLight()
createBall()
createFloor()
openControls()
animate();