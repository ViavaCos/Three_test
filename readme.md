# THREE_TEST
> Some test code with three.js 

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

