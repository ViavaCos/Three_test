import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// 创建场景、相机、渲染器并挂在至浏览器窗口
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  100, window.innerWidth / window.innerHeight, 0.1, 1000
)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// 1.渲染器开启阴影贴图
renderer.shadowMap.enabled = true

// 创建一个球
const createBall = () => {
  const sphereGeo = new THREE.SphereGeometry(1, 20, 20)
  // const material = new THREE.MeshBasicMaterial()
  const material = new THREE.MeshStandardMaterial()
  const sphere = new THREE.Mesh(sphereGeo, material)

  // 2.投射阴影
  sphere.castShadow = true
  scene.add(sphere)

  // 创建一个平面
  const geometry = new THREE.PlaneGeometry(50, 50)
  const planeMaterial = new THREE.MeshStandardMaterial()
  const plane = new THREE.Mesh(geometry, planeMaterial)
  plane.position.set(0, -1, 0)
  plane.rotation.x = -Math.PI / 2

  // 3.接受阴影
  plane.receiveShadow = true
  scene.add(plane)

  // 环境光
  const light = new THREE.AmbientLight(0xffffff, 1)
  scene.add(light)

  // 聚光灯
  const spotLight = new THREE.SpotLight(0xffffff, 2)
  // spotLight.position.set(0, 11, 5)
  spotLight.position.set(-5, 5, 15)
  spotLight.decay = 0; // 纵向沿着光照距离的缩减量

  spotLight.angle = Math.PI / 8 // 散射角度
  spotLight.penumbra = 0.1 // 聚光锥的半影缩减百分比
  spotLight.distance = 30;
  spotLight.shadow.radius = 10
  spotLight.shadow.mapSize.set(256, 256) // 阴影映射的宽高
  // spotLight.target.position.set(0, 0, 0)

  spotLight.castShadow = true // 4.开启阴影
  spotLight.shadow.mapSize.width = 512;
  spotLight.shadow.mapSize.height = 512;
  spotLight.shadow.camera.near = 0.5;
  spotLight.shadow.camera.far = 100;
  scene.add(spotLight)

  const spotLightHelper = new THREE.SpotLightHelper(spotLight, 'lightgreen')
  scene.add(spotLightHelper)
}

const animate = () => {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

// 开启轨道控制器
new OrbitControls(camera, renderer.domElement)
// 设置相机位置
camera.position.set(0, 0, 50);

createBall()
animate();
