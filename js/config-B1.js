import * as THREE from "./libs/three.module.js";
import { OrbitControls } from "./libs/OrbitControls.js";
import { GLTFLoader } from "./libs/GLTFLoader.js";

import { EffectComposer } from './libs/EffectComposer.js';
import { RenderPass } from './libs/RenderPass.js';
import { ShaderPass } from './libs/ShaderPass.js';
import { CopyShader } from './libs/CopyShader.js';


let init, modelLoad,composer;

let gltfpath = "assets/model/watch.glb";
let strapMat,glassMat,frameMat,timeIndex,dailMat;

const envMap = new THREE.CubeTextureLoader()
  .setPath("./assets/env/")
  .load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]);
  envMap.encoding = THREE.sRGBEncoding;

$(document).ready(function () {
  let detect = detectWebGL();
  if (detect == 1) {
    init = new sceneSetup(35, 1, 5000, 4, 0, 13, 0x919191);
    modelLoad = new objLoad();
    modelLoad.watchModel();
  } else if (detect == 0) {
    alert("PLEASE ENABLE WEBGL IN YOUR BROWSER....");
  } else if (detect == -1) {
    alert(detect);
    alert("YOUR BROWSER DOESNT SUPPORT WEBGL.....");
  }
  strapMat = new THREE.MeshStandardMaterial({
    envMap : envMap,
    reflectivity:.4,
    envMapIntensity:3,
    map: textureLoad("assets/tex/brown/gold_Base_color.jpg"),
    aoMap : textureLoad("assets/tex/brown/AO.png"),
    aoMapIntensity:.7,
    normalMap: textureLoad("assets/tex/brown/NormalMap.png"),
    normalScale: new THREE.Vector3( 0.4, 0.4),
    roughnessMap : textureLoad("assets/tex/brown/Roughness.jpg"),
    displacementMap :textureLoad("assets/tex/brown/displacement_map.jpg"),
    displacementScale : .001,
    roughness : 1,
    metalness : .5,
    combine: THREE.MixOperation,
    side: THREE.DoubleSide,
  });
  glassMat = new THREE.MeshPhongMaterial({
    envMap : envMap,
    reflectivity:.7,
    opacity:.2,
    transparent:true,
    combine: THREE.MixOperation,
    side: THREE.DoubleSide,
  });
  frameMat = new THREE.MeshStandardMaterial({
    envMap : envMap,
    envMapIntensity:1.5,
    // map: textureLoad("assets/tex/brown/gold_Base_color.jpg"),
    // aoMap : textureLoad("assets/tex/brown/AO.png"),
    // aoMapIntensity:.5,
    lightMap: textureLoad("assets/tex/brown/AO.png"),
    lightMapIntensity : .5,
    normalMap: textureLoad("assets/tex/brown/NormalMap.png"),
    normalScale: new THREE.Vector3( 0.4, 0.4),
    roughnessMap : textureLoad("assets/tex/brown/Roughness.jpg"),
    // displacementMap :textureLoad("assets/tex/brown/displacement_map.jpg"),
    // displacementScale : .001,
    // color:0xababab,
    roughness : .5,
    metalness : 1,
    // normalMap: textureLoad("assets/tex/brown/NormalMap.png"),
    // normalScale: new THREE.Vector3( 0.4, 0.4),
    // roughnessMap : textureLoad("assets/tex/brown/Roughness.jpg"),
    // displacementMap :textureLoad("assets/tex/brown/displacement_map.jpg"),
    // displacementScale : .001,
    combine: THREE.MixOperation,
    side: THREE.DoubleSide,
  });
  timeIndex = new THREE.MeshStandardMaterial({
    color:0x8f5928,
     envMap : envMap,
  reflectivity : 1,
    // emissive : 1,
     envMapIntensity:1,
    
    //  aoMap : textureLoad("assets/tex/brown/AO.png"),
    //  aoMapIntensity:3,
    // lightMap: textureLoad("assets/tex/brown/AO.png"),
    // lightMapIntensity : .5,
    //  roughnessMap : textureLoad("assets/tex/brown/Roughness.jpg"),
     roughness : .4,
     metalness : .7,
    combine: THREE.MixOperation,
    side: THREE.DoubleSide,
  });
  dailMat = new THREE.MeshPhongMaterial({
    //  color:0xde6014,
     envMap : envMap,
     reflectivity : .1,
      envMapIntensity:1,
     map: textureLoad("assets/tex/brown/gold_Base_color.jpg"),
      aoMap : textureLoad("assets/tex/brown/AO.png"),
      aoMapIntensity:.5,
    // lightMap: textureLoad("assets/tex/brown/AO.png"),
    // lightMapIntensity : .5,
    //  roughnessMap : textureLoad("assets/tex/brown/Roughness.jpg"),
    // roughness : .5,
    // metalness : 1,
    combine: THREE.MixOperation,
    side: THREE.DoubleSide,
  });
});
function detectWebGL() {
  // Check for the WebGL rendering context
  if (!!window.WebGLRenderingContext) {
    var canvas = document.createElement("canvas"),
      names = ["webgl", "experimental-webgl", "moz-webgl", "webkit-3d"],
      context = false;

    for (var i in names) {
      try {
        context = canvas.getContext(names[i]);
        if (context && typeof context.getParameter === "function") {
          // WebGL is enabled.
          return 1;
        }
      } catch (e) {}
    }

    // WebGL is supported, but disabled.
    return 0;
  }

  // WebGL not supported.
  return -1;
}
let material = {
  cube: new THREE.MeshLambertMaterial({
    //   map:THREE.ImageUtils.loadTexture("assets/Road texture.png"),
    color: 0xffffff,
    combine: THREE.MixOperation,
    side: THREE.DoubleSide,
  }),
};
class sceneSetup {
  constructor(FOV, near, far, x, y, z, ambientColor) {
    this.container = document.getElementById("canvas");
    this.scene = new THREE.Scene();
    this.addingCube();
    this.camera(FOV, near, far, x, y, z);
    this.ambientLight(ambientColor);
    // this.initLines();
    this.render();
  }
  camera(FOV, near, far, x, y, z) {
    this.cameraMain = new THREE.PerspectiveCamera(
      FOV,
      this.container.offsetWidth / this.container.offsetHeight,
      near,
      far
    );
    this.cameraMain.position.set(x, y, z);
    // this.cameraMain.lookAt(this.camPoint);
    this.cameraMain.lookAt(0, 0, 0);
    this.scene.add(this.cameraMain);
    this.rendering();
  }
  rendering() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor(0xffffff);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(
      this.container.offsetWidth,
      this.container.offsetHeight
    );
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;//THREE.CineonToneMapping;//THREE.Uncharted2ToneMapping;//THREE.ReinhardToneMapping;//THREE.LinearToneMapping;
    this.renderer.toneMappingExposure = 1.5;
    this.container.appendChild(this.renderer.domElement);
    this.controls = new OrbitControls(
      this.cameraMain,
      this.renderer.domElement
    );
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.07;
    // this.controls.constraint.smoothZoom = true;
    // this.controls.constraint.zoomDampingFactor = 0.2;
    // this.controls.constraint.smoothZoomSpeed = 5.0;
    //    this.controls.minDistance = 10;
    //    this.controls.maxDistance = 1000;
    // this.controls.maxPolarAngle = Math.PI/2 * 115/120;
    // this.controls.minPolarAngle = 140/120;
    //   this.controls.minAzimuthAngle = -280/120;
    // this.controls.maxAzimuthAngle = -115/120;
  }
  addingCube() {
    this.geo = new THREE.BoxBufferGeometry(0.01, 0.01, 0.01);
    this.mat = material.cube;
    this.camPoint = new THREE.Mesh(this.geo, this.mat);
    this.scene.add(this.camPoint);
    this.camPoint.position.set(0, 0, 0);
  }
  ambientLight(ambientColor) {
    this.ambiLight = new THREE.AmbientLight(0xffffff);
    this.light = new THREE.HemisphereLight(0xffffff, 0x000000, 1);
    this.scene.add(this.light);
    // this.scene.add(this.ambiLight);
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    this.directionalLight.position.set(0,0,5);
    this.directionalLightHelper = new THREE.DirectionalLightHelper( this.directionalLight, 5 );
    //  this.scene.add(this.directionalLightHelper);
    
  }
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.controls.update();
    this.renderer.render(this.scene, this.cameraMain);
  }
  render() {
    this.animate();
  }
}
let textureLoad = (texturePath) => {
  let texture = new THREE.TextureLoader().load(texturePath);
  texture.encoding = THREE.sRGBEncoding;
  texture.flipY = false;
  return texture;
};
window.addEventListener("resize", onWindowResize, false);

function onWindowResize() {
  init.cameraMain.aspect =
    init.container.offsetWidth / init.container.offsetHeight;
  init.renderer.setSize(
    init.container.offsetWidth,
    init.container.offsetHeight
  );
  init.cameraMain.updateProjectionMatrix();
}

class objLoad {
  constructor() {}
  watchModel() {
    this.loader = new GLTFLoader();
    this.loader.load(gltfpath, (gltf) => {
      this.mesh = gltf.scene;
      gltf.scene.traverse(function (node) {
        if (node.type === "Mesh") {
            if(node.name == 'strape'){
                node.material = strapMat;
            }else if(node.name == 'glass'){
                node.material = glassMat;
            }else if(node.name == 'frame'){
               node.material = frameMat;
            }else if(node.name == 'time_index' || node.name == 'police_text'){
                node.material = timeIndex;
             }else if(node.name == 'Dail'){
                node.material = dailMat;
                // node.visible = true;
             }else if(node.name == 'date'){
                node.material = new THREE.MeshLambertMaterial({
                    color:0x00000,
                });
             }     
        }
      });
      this.mesh.position.set(0, 0, 0);
      //  mesh.name = name;
      this.mesh.scale.set(100, 100, 100);
      init.scene.add(this.mesh);
    });
  }
}
