/**
 *  ERROR: 模型加载后显示不出来...
 */
import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"

// 1.创建场景、摄像机和渲染器
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()

renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// 2.加载资源
const loader = new FBXLoader()
// const assetPath = '../static/airplane.fbx'; // 资源地址
// const assetPath = '../static/plant.FBX'; // 资源地址
const assetPath = '../static/iPhone.fbx'; // 资源地址

// const loader = new GLTFLoader()
// const assetPath = '../static/airplane.glb'

camera.position.z = 5;

// 加载资源成功
const onLoad = (data) => {
  // data.scale.set(1, 1, 1)
  // data.position.set(0, 0, 0)

  scene.add(data)
}

// 加载资源的过程
const onProgress = (event) => {
  console.log((event.loaded / event.total * 100) + '% loaded')
}

// 加载资源失败
const onError = (error) => {
  console.log("Load assets failed: ", + error)
}
loader.load(assetPath, onLoad, onProgress, onError)


// scene.background = new THREE.Color(0xf2f5f9)

// 3.循环渲染
function animate(){
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

animate();
