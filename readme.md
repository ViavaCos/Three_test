# THREE_TEST
> Some test code with three.js 

## Start 
```bash
# node version should >= 18.0.0, current repo use 20.0.0
cd Three_test

npx vite
```

## 创建一个旋转的立方体 
```javascript
import * as THREE from 'three'

// 1. 创建场景
const scene = new THREE.Scene();
/**
 * 2. 创建相机
 * PerspectiveCamera(视野角度, 长宽比, 近截面, 远截面)
 */
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
// 3. 创建渲染器
const renderer = new THREE.WebGLRenderer();

// 4. 设置渲染尺寸并将渲染器加入到页面中
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement)

// 创建立方体
const geometry = new THREE.BoxGeometry(1, 1, 1);
// 创建材质
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
// 为立方体设置材质
const cube = new THREE.Mesh(geometry, material)

// 在场景中加入立方体；默认会加入到场景中的(0, 0, 0)坐标
scene.add(cube)

// 设置相机的位置
camera.position.z = 5;

// 创建循环渲染（动画循环）并执行
function animate(){
  requestAnimationFrame(animate)

  // 使立方体持续旋转
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera)
}

animate();
```

## 导入fbx模型文件
```javascript
import * as THREE from 'three'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'

const scene = new THREE.Scene()

const importAirplane = () => {
  const modelPath = '../static/airplane.fbx';
  const loader = new FBXLoader()

  loader.load(modelPath, (data) => {
    scene.add(data)
  }, (event) => {
    console.log(event.loaded / event.total * 100 + "% loaded.");
  }, (err) => {
    console.log(err);
  })
}
```

## 导入gltf/glb模型文件
```javascript
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const scene = new THREE.Scene()

const importAirplane = () => {
  const modelPath = '../static/airplane.glb';
  const loader = new GLTFLoader()

  loader.load(modelPath, (data) => {
    // 和fbx不同的是，它的scene在返回数据的第二层
    data = data.scene;

    data.traverse((child) => {
      // 为模型的每一个子元素都设置投射阴影
      child.castShadow = true

      // 解决颜色暗淡无光的问题（似乎仅适用于.glb的文件）
      if (child.isMesh) {
        child.material.emissive =  child.material.color;
        child.material.emissiveMap = child.material.map ;
        // child.material.shadowSide = THREE.BackSide
      }
    })

    scene.add(data)
  }, (event) => {
    console.log(event.loaded / event.total * 100 + "% loaded.");
  }, (err) => {
    console.log(err);
  })
}
```


## 创建一个球体并赋予其阴影和投影
```javascript
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

const createBall = () => {
  const sphereGeo = new THREE.SphereGeometry(1, 20, 20)
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
  spotLight.position.set(0, 11, 5)
  // spotLight.position.set(-5, 5, 15)
  spotLight.decay = 0; // 纵向沿着光照距离的缩减量

  spotLight.angle = Math.PI / 8 // 散射角度
  spotLight.penumbra = 0.1 // 聚光锥的半影缩减百分比
  spotLight.distance = 30;
  spotLight.shadow.radius = 10
  spotLight.shadow.mapSize.set(256, 256) // 阴影映射的宽高
  // spotLight.target.position.set(0, 0, 0)

  spotLight.castShadow = true // 4.开启阴影
  spotLight.shadow.mapSize.width = 4096; // 设置影子的像素大小，越小越模糊
  spotLight.shadow.mapSize.height = 4096;
  spotLight.shadow.camera.near = 0.5;
  spotLight.shadow.camera.far = 100;
  scene.add(spotLight)

  // 打开聚光灯助手
  // const spotLightHelper = new THREE.SpotLightHelper(spotLight, 'lightgreen')
  // scene.add(spotLightHelper)
}
```
