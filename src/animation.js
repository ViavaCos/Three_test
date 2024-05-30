import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'


const animationHub = {}; // 动画集合

// 创建场景
const scene = new THREE.Scene()
// 创建相机
const camera = new THREE.PerspectiveCamera(
  45, window.innerWidth / window.innerHeight, 0.1, 1000
)

// 打开相机助手
// const cameraHelper = new THREE.CameraHelper(camera)
// scene.add(cameraHelper)

// 显示坐标轴 new THREE.AxesHelper(size)
// x:红色 y:绿色 z:蓝色
const axesHelper = new THREE.AxesHelper(10)
scene.add(axesHelper)

// 创建渲染器
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true; // 打开阴影贴图
// 设置像素比例
renderer.setPixelRatio(window.devicePixelRatio)
// 设置尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight)
// 将渲染器挂载到实际dom上
document.body.appendChild(renderer.domElement)


// 设置场景的背景颜色
scene.background = new THREE.Color(0xa0a0a0)
// 添加线性雾
scene.fog = new THREE.Fog(0xa0a0a0, 10, 50)

// 加载机器人模型
const loadBot = () => {
  const modelPath = '../static/Xbot.glb'
  const loader = new GLTFLoader()

  loader.load(modelPath, (modelData) => {
    // 将模型加入到场景中
    scene.add(modelData.scene)

    // 打开骨架助手
    const skeleton = new THREE.SkeletonHelper(modelData.scene)
    skeleton.visible = false
    scene.add(skeleton)

    modelData.scene.traverse((child) => {
      if(child.isMesh) {
        // 给每个子项都开启阴影
        child.castShadow = true;
        
        // 处理颜色暗淡问题，但是这里有其它光源照亮 因此无需此代码
        // child.material.emissive = child.material.color
        // child.material.emissiveMap = child.material.map
      }
    })


    // 创建动画控制器
    const mixer = new THREE.AnimationMixer(modelData.scene)
    modelData.animations.forEach(clip => {
      const action = mixer.clipAction(clip)
      // action.weight = 1.0;

      if(['sad_pose', 'sneak_pose'].includes(clip.name)) {
        action.setEffectiveTimeScale(0.1)
      }

      // 存储3d模型里的动画
      animationHub[clip.name] = action;

      console.log(1008600, { clip, action, animationHub });
    })

    createGUI()

    mixer.addEventListener('finished', () => {
      console.log(1008600, 'end');
    })

    const clock = new THREE.Clock();

    function animate(){
      requestAnimationFrame(animate)
      const delta = clock.getDelta()
      if(mixer) mixer.update(delta)

      renderer.render(scene, camera)
    }
    animate();

  }, (event) => {
    console.log(event.loaded / event.total * 100 + '% loaded.')
  }, (err) => {
    console.log(err);
  })
}

// 创建环境光
const createEnvironmentLight = () => {
  const envLight = new THREE.AmbientLight(0xffffff, 1)
  scene.add(envLight)
}

// 创建半球光
const createHalfBallLight = () => {
  const halfBallLight = new THREE.HemisphereLight(0xffffff, 0x8d8d8d, 3)
  halfBallLight.position.set(0, 20, 0)
  scene.add(halfBallLight)
}

// 创建平行光
const createDirectLight = () => {
  const directLight = new THREE.DirectionalLight(0xffffff, 3)
  
  directLight.position.set(3, 10, 10)

  directLight.castShadow = true
  directLight.shadow.camera.top = 2;
  directLight.shadow.camera.bottom = -2
  directLight.shadow.camera.left = -2
  directLight.shadow.camera.right = 2
  directLight.shadow.camera.near = 0.1
  directLight.shadow.camera.far = 40

  scene.add(directLight)
}

// 创建地板
const createFloor = () => {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshPhongMaterial({
      color: 0xcbcbcb,
      depthWrite: false,
    })
  )

  mesh.rotation.x = -Math.PI / 2 // 旋转90°
  mesh.receiveShadow = true // 接收阴影

  scene.add(mesh)
}

// 当前动画类型记录
const currentAnimate = {
  action: '',
}

// 创建GUI
const createGUI = () => {
  const gui = new GUI()
  const animateFolder = gui.addFolder("动画")

  // 收起
  // animateFolder.close();

  // 展开（默认） 
  // animateFolder.open();

  animateFolder.add(
    currentAnimate, 'action', Object.keys(animationHub)
  ).name('模型动画').onChange(key => {
    console.log(1008600, { key });
    executeAnimateWithKey(key)
  }).setValue('idle')

  bindKeyBoard()
}

// 根据键名执行动画
const executeAnimateWithKey = (keyName) => {
  Object.values(animationHub).forEach(i => {
    i.stop();
  })

  if(animationHub[keyName]) {
    animationHub[keyName].play();
  }
}

// 绑定键盘
const bindKeyBoard = () => {
  document.addEventListener('keyup', (event) => {
    console.log(1008600, { event }, event.key);

    // run
    if(event.key === 'W') {
      executeAnimateWithKey('run')
      return;
    }

    // walk
    if(event.key === 'w') {
      executeAnimateWithKey('walk')
      return;
    }

    // stop
    if(event.key === 's') {
      executeAnimateWithKey('idle')
      return;
    }
  })
}

// 创建轨道控制器
const createControls = () => {
  new OrbitControls(camera, renderer.domElement)
}

// 循环渲染
const animate = () => {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
}

function init () {
  // 调整相机位置
  camera.position.set(5, 5, 5)

  loadBot()

  // createEnvironmentLight()
  createHalfBallLight()
  createDirectLight();
  
  createFloor()

  createControls()

  animate();
}


init();