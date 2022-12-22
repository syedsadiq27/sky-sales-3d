import * as THREE from "./libs/three.module.js";
import { OrbitControls } from "./libs/OrbitControls.js";
import { GLTFLoader } from "./libs/GLTFLoader.js";
// import { TGALoader } from './libs/TGALoader.js';
// import { EffectComposer } from './libs/EffectComposer.js';
// import { RenderPass } from './libs/RenderPass.js';
// import { ShaderPass } from './libs/ShaderPass.js';
// import { CopyShader } from './libs/CopyShader.js';
// import { SSAOPass  } from './libs/SAOPass.js';
let init, modelLoad, composer;
let gltfpath = "assets/model/watch.glb";
let strapMat,
  glassMat,
  frameMat,
  timeIndex,
  dailMat,
  reverseMetal,
  strapInnerMat;
const fontFamily = [
  { value: "timesnewroman", label: "Times New Roman" },
  { value: "Copperplate", label: "Copperplate" },
  { value: "Papyrus", label: "Papyrus" },
  { value: "CourierNew", label: "Courier New" },
  { value: "BrushScriptMT", label: "Brush Script MT" },
  { value: "LucidaHandwriting", label: "Lucida Handwriting" },
  { value: "garamond", label: "Garamond" },
  { value: "LucidaConsole", label: "Lucida Console" },
  { value: "Georgia", label: "Georgia" },
  { value: "Arial", label: "Arial" },
  { value: "Monaco", label: "Monaco" },
];
const envMap = new THREE.CubeTextureLoader()
  .setPath("assets/env/")
  .load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]);
envMap.encoding = THREE.sRGBEncoding;
$(document).ready(function () {
  const strapConfigDiv = document.getElementById("strapConfig");
  const dailConfigDiv = document.getElementById("dailConfig");
  const frameConfigDiv = document.getElementById("frameConfig");
  const strapConigSection = document.createElement("section");
  const frameConfigSection = document.createElement("section");
  const dailConfigSection = document.createElement("section");
  strapConigSection.classList.add("person");
  frameConfigSection.classList.add("person");
  dailConfigSection.classList.add("person");
  const configrations = ["#C0C0C0", "#8f573f"];
  configrations.forEach((entry) => {
    var elem = document.createElement("div");
    elem.setAttribute("id", entry);
    elem.style.height = "70px";
    elem.style.width = "70px";
    elem.style.margin = "1rem";
    elem.style.background = entry;
    // elem.setAttribute("id", entry)
    elem.addEventListener("click", handleClick);
    frameConfigSection.appendChild(elem);
    function handleClick(e) {
      init.scene.traverse(function (child) {
        if (child.isMesh) {
          if (child.name === "Frame") {
            if (entry == "#C0C0C0") {
              child.material.color.setHex("0xffffff");
              child.material.envMapIntensity = 1.5;
              child.material.roughness = 0.7;
              child.material.metalness = 1;
            } else {
              child.material.color.setHex("0xa65f41");
              child.material.envMapIntensity = 1;
              child.material.roughness = 0.9;
              child.material.metalness = 0.8;
            }
            // child.material.color.convertSRGBToLinear();
          }
        }
      });
    }
  });
  frameConfigDiv.appendChild(frameConfigSection);
  let textureMap = {
    Gold: {
      url: "./assets/tex/newTexture/jpg/Watch_low_BaseColor_Red.jpg",
    },
    Black: {
      url: "./assets/tex/newTexture/jpg/Watch_low_BaseColor_Black.jpg",
    },
    Brown: {
      url: "./assets/tex/newTexture/jpg/Watch_low_BaseColor.jpg",
    },
  };
  var iconArray = [
    {
      name: "Gold",
      image: "assets/icons/strap/Gold.png",
    },
    {
      name: "Black",
      image: "assets/icons/strap/Black.png",
    },
    {
      name: "Brown",
      image: "assets/icons/strap/Maroon.png",
    },
  ];
  let dialTextureMap = {
    Blue: {
      url: "./assets/tex/newTexture/jpg/blueDial-01.jpg",
    },
    BlackDail: {
      url: "./assets/tex/newTexture/jpg/blackDial.jpg",
    },
    Gold: {
      url: "./assets/tex/newTexture/jpg/dialMap.jpg",
    },
  };
  var dailArray = [
    {
      name: "Blue",
      image: "assets/icons/dial/BlueDial.png",
    },
    {
      name: "BlackDail",
      image: "assets/icons/dial/BlackDial.png",
    },
    {
      name: "Gold",
      image: "assets/icons/dial/white.png",
    },
  ];
  Object.entries(iconArray).forEach((entry) => {
    const [key, value] = entry;
    var elem = document.createElement("img");
    elem.setAttribute("id", value.name);
    elem.classList.add("img");
    elem.setAttribute("src", value.image);
    elem.setAttribute("height", "88");
    elem.setAttribute("width", "88");
    // if(window?.database?.configSelections?.strap == value.name){
    //   elem.setAttribute("border", "1px solid #767676");
    // }
    elem.addEventListener("click", handleClick);
    strapConigSection.appendChild(elem);
    function handleClick(e) {
      // strapConigSection.forEach(item => item.classList.remove("activeBorder"))
      // e.target.classList.add("activeBorder");
      // window.database.configSelections.strap = e.target.id;
      init.scene.traverse(function (child) {
        if (child.isMesh) {
          if (child.name === "strap") {
            const texture = new THREE.TextureLoader().load(
              textureMap[e.target.id].url
            );
            texture.encoding = THREE.sRGBEncoding;
            texture.flipY = false;
            child.material.map = texture;
            child.material.needsUpdate = true;
          }
          // if (child.name === "glass") {
          //   child.material = glassMat;
          //   //cosole.log(child);
          // }
        }
      });
    }
  });
  Object.entries(dailArray).forEach((entry) => {
    const [key, value] = entry;
    var elem = document.createElement("img");
    elem.setAttribute("id", value.name);
    elem.classList.add("img");
    elem.setAttribute("src", value.image);
    elem.setAttribute("height", "88");
    elem.setAttribute("width", "88");
    elem.setAttribute("border", "1px solid #767676");
    elem.addEventListener("click", handleClick);
    dailConfigSection.appendChild(elem);
    function handleClick(e) {
      init.scene.traverse(function (child) {
        //cosole.log(child.name);
        if (child.isMesh) {
          if (child.name === "Dial") {
            const texture = new THREE.TextureLoader().load(
              dialTextureMap[e.target.id].url
            );
            texture.encoding = THREE.sRGBEncoding;
            texture.flipY = false;
            child.material.map = texture;
            child.material.needsUpdate = true;
          }
          // if (child.name === "glass") {
          //   child.material = glassMat;
          //   //cosole.log(child);
          // }
        }
      });
    }
  });
  strapConfigDiv.appendChild(strapConigSection);
  dailConfigDiv.appendChild(dailConfigSection);
  function toogleContainer(value) {
    const twoD = document.getElementById("2d-image");
    const threeD = document.getElementById("3d-canvas");
    if (value === "show-image") {
      twoD.style.display = "block";
      threeD.style.display = "none";
    } else if (value === "show-3d") {
      twoD.style.display = "none";
      threeD.style.display = "block";
    }
  }
  function imageClick() {
    toogleContainer("show-image");
  }
  function previewClick() {
    toogleContainer("show-3d");
  }
  toogleContainer("show-3d");
  document.getElementById("myImg").addEventListener("click", imageClick);
  document
    .getElementById("threeDPrview")
    .addEventListener("click", previewClick);
  const textbox = document.getElementById("demo");
  const input = document.createElement("input");
  const fontSize = document.createElement("input");
  const color = document.createElement("input");
  const fontSlider = document.createElement("input");
  const hOffsetSlider = document.createElement("input");
  const vOffsetSlider = document.createElement("input");
  fontSlider.setAttribute("id", "fontSize");
  fontSlider.setAttribute("type", "range");
  fontSlider.setAttribute("min", "1");
  fontSlider.setAttribute("max", "100");
  fontSlider.setAttribute("value", "50");
  hOffsetSlider.setAttribute("id", "hOffset");
  hOffsetSlider.setAttribute("type", "range");
  hOffsetSlider.setAttribute("min", "-50");
  hOffsetSlider.setAttribute("max", "50");
  hOffsetSlider.setAttribute("value", "0");
  vOffsetSlider.setAttribute("id", "vOffset");
  vOffsetSlider.setAttribute("type", "range");
  vOffsetSlider.setAttribute("min", "-50");
  vOffsetSlider.setAttribute("max", "50");
  vOffsetSlider.setAttribute("value", "0");
  color.type = "color";
  fontSize.type = "number";
  const select = document.createElement("select");
  input.setAttribute("id", "text");
  select.setAttribute("id", "font");
  color.setAttribute("id", "color");
  fontFamily.forEach((fontItem) => {
    const option = document.createElement("option");
    option.setAttribute("value", fontItem.value);
    let optionText = document.createTextNode(fontItem.label);
    option.appendChild(optionText);
    select.appendChild(option);
  });
  input.addEventListener("input", changeText);
  select.addEventListener("change", changeText);
  color.addEventListener("input", changeText);
  fontSlider.addEventListener("input", changeText);
  hOffsetSlider.addEventListener("input", changeText);
  vOffsetSlider.addEventListener("input", changeText);
  const inputDiv = document.createElement("div");
  inputDiv.setAttribute("class", "field-group");
  const inputLabel = `<lable> Text </label>`;
  const fontDiv = document.createElement("div");
  fontDiv.setAttribute("class", "field-group");
  const fontLabel = `<lable> Font </label>`;
  const colorDiv = document.createElement("div");
  colorDiv.setAttribute("class", "field-group");
  const colorLabel = `<lable> Color </label>`;
  const fontSizeDiv = document.createElement("div");
  fontSizeDiv.setAttribute("class", "field-group");
  const fontSizeLabel = `<lable> Size </label>`;
  const hOffsetDiv = document.createElement("div");
  hOffsetDiv.setAttribute("class", "field-group");
  const hOffsetLabel = `<lable> H. Offset </label>`;
  const vOffsetDiv = document.createElement("div");
  vOffsetDiv.setAttribute("class", "field-group");
  const vOffsetLabel = `<lable> V. Offset </label>`;
  inputDiv.innerHTML = inputLabel;
  inputDiv.appendChild(input);
  fontDiv.innerHTML = fontLabel;
  fontDiv.appendChild(select);
  colorDiv.innerHTML = colorLabel;
  colorDiv.appendChild(color);
  fontSizeDiv.innerHTML = fontSizeLabel;
  fontSizeDiv.appendChild(fontSlider);
  hOffsetDiv.innerHTML = hOffsetLabel;
  hOffsetDiv.appendChild(hOffsetSlider);
  vOffsetDiv.innerHTML = vOffsetLabel;
  vOffsetDiv.appendChild(vOffsetSlider);
  textbox.appendChild(inputDiv);
  textbox.appendChild(fontDiv);
  textbox.appendChild(colorDiv);
  textbox.appendChild(fontSizeDiv);
  textbox.appendChild(hOffsetDiv);
  textbox.appendChild(vOffsetDiv);
  // 3D Scene Setup
  const container = document.getElementById("3d-canvas");
  const twodcontainer = document.getElementById("2d-image");
  container.style.width = container.parentElement.getBoundingClientRect().width;
  container.style.height = "549px";
  let detect = detectWebGL();
  if (detect == 1) {
    init = new sceneSetup(35, 1, 5000, 4, 0, 20, 0x919191);
    modelLoad = new objLoad();
    modelLoad.watchModel();
  } else if (detect == 0) {
    alert("PLEASE ENABLE WEBGL IN YOUR BROWSER....");
  } else if (detect == -1) {
    alert(detect);
    alert("YOUR BROWSER DOESNT SUPPORT WEBGL.....");
  }
  strapMat = new THREE.MeshStandardMaterial({
    envMap: envMap,
    reflectivity: 0.5,
    envMapIntensity: 3,
    map: textureLoad("assets/tex/newTexture/jpg/Watch_low_BaseColor.jpg"),
    aoMap: textureLoad("assets/tex/newTexture/jpg/Watch_low_AO.jpg"),
    aoMapIntensity: 0.3,
    normalMap: textureLoad("assets/tex/newTexture/jpg/Watch_low_Normal.jpg"),
    normalScale: new THREE.Vector3(0.1, 0.1),
    roughnessMap: textureLoad(
      "assets/tex/newTexture/jpg/Watch_low_Roughness.jpg"
    ),
    displacementMap: textureLoad(
      "assets/tex/newTexture/jpg/Watch_low_Height.jpg"
    ),
    displacementScale: 0.003,
    roughness: 0.7,
    metalness: 0.5,
    combine: THREE.MixOperation,
    side: THREE.DoubleSide,
  });
  glassMat = new THREE.MeshPhongMaterial({
    depthWrite: true,
    envMap: envMap,
    reflectivity: 1,
    opacity: 0.2,
    transparent: true,
    combine: THREE.MixOperation,
    side: THREE.DoubleSide,
  });
  frameMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    envMap: envMap,
    envMapIntensity: 1.5,
    lightMap: textureLoad("assets/tex/brown/AO.png"),
    lightMapIntensity: 0.5,
    lightMap: textureLoad("assets/tex/newTexture/jpg/Watch_low_AO.jpg"),
    lightMapIntensity: 0.5,
    roughnessMap: textureLoad("assets/tex/brown/Roughness.jpg"),
    roughness: 0.7,
    metalness: 1,
    combine: THREE.MixOperation,
    side: THREE.DoubleSide,
  });
  timeIndex = new THREE.MeshPhongMaterial({
    color: 0x471601, //0x661f01,//0x3b1d0e,
    envMap: envMap,
    reflectivity: 0.4,
    combine: THREE.MixOperation,
    side: THREE.DoubleSide,
  });
  dailMat = new THREE.MeshPhongMaterial({
    envMap: envMap,
    reflectivity: 0.1,
    envMapIntensity: 1,
    map: textureLoad("assets/tex/brown/gold_Base_color.jpg"),
    aoMap: textureLoad("assets/tex/brown/AO.png"),
    aoMapIntensity: 0.5,
    combine: THREE.MixOperation,
    side: THREE.DoubleSide,
  });
  reverseMetal = new THREE.MeshStandardMaterial({
    envMap: envMap,
    reflectivity: 1,
    envMapIntensity: 0.5,
    map: textureLoad("assets/tex/newTexture/jpg/back-text.jpg"),
    roughness: 0.3,
    metalness: 0.5,
    combine: THREE.MixOperation,
    side: THREE.DoubleSide,
  });
});
function changeText(e) {
  var textvalue = document.getElementById("text").value;
  var fontSize = document.getElementById("fontSize").value;
  const fontLabel = document.getElementById("font").value || "Times New Roman";
  const decoColor = document.getElementById("color").value || "FFFFFF";
  const horizontalPosition = document.getElementById("hOffset").value || 0;
  const verticalPosition = document.getElementById("vOffset").value || 0;
  const color = new THREE.Color(0xffffff);
  color.setHex(decoColor.replace("#", "0x"));
  color.convertSRGBToLinear();
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d", { alpha: true });
  context.translate(50, 150);
  context.scale(1, -1);
  context.textBaseline = "middle";
  context.textAlign = "center";
  context.font = fontSize + "px " + fontLabel;
  context.fillStyle = "#" + color.getHexString();
  context.fillText(textvalue, canvas.width / 2, canvas.height / 2, 400);
  var canvasDisplacement = document.createElement("canvas");
  var ctxDisplacement = canvasDisplacement.getContext("2d", { alpha: true });
  ctxDisplacement.width = 400;
  ctxDisplacement.height = 400;
  ctxDisplacement.translate(50, 150);
  ctxDisplacement.scale(1, -1);
  ctxDisplacement.textBaseline = "middle";
  ctxDisplacement.textAlign = "center";
  ctxDisplacement.fillStyle = "#ff0000";
  ctxDisplacement.fillRect(
    0,
    0,
    canvasDisplacement.width,
    canvasDisplacement.height
  );
  ctxDisplacement.font = 50 + "px " + fontLabel;
  ctxDisplacement.fillStyle = decoColor;
  ctxDisplacement.fillText(textvalue, canvas.width / 2, canvas.height / 2, 400);
  if (canvasDisplacement && canvas) {
    var textureDisplacement = new THREE.Texture(canvasDisplacement);
    textureDisplacement.opacity = 1;
    textureDisplacement.needsUpdate = true;
    var texture = new THREE.CanvasTexture(canvas);
    texture.opacity = 1;
    texture.flipY = true;
    texture.encoding = THREE.sRGBEncoding;
    texture.offset.x = horizontalPosition * -0.01;
    texture.offset.y = verticalPosition * -0.01;
    texture.needsUpdate = true;
    init.scene.traverse((node) => {
      if (node.isMesh && node.name === "Decoration") {
        node.material = new THREE.MeshPhongMaterial({
          transparent: true,
          map: texture,
          // displacementMap: textureDisplacement,
          // displacementBias: -0.005,
          // displacementScale: 0.05,
        });
      }
    });
  }
}
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
    // this.container = document.getElementById("canvas");
    this.container = document.getElementById("3d-canvas");
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
    this.renderer.shadowMap.enabled = true;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(
      this.container.offsetWidth,
      this.container.offsetHeight
    );
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping; //THREE.CineonToneMapping;//THREE.Uncharted2ToneMapping;//THREE.ReinhardToneMapping;//THREE.LinearToneMapping;
    this.renderer.toneMappingExposure = 1.5;
    this.container.appendChild(this.renderer.domElement);
    this.controls = new OrbitControls(
      this.cameraMain,
      this.renderer.domElement
    );
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.07;
    // this.controls.enableDamping = true;
    // this.controls.dampingFactor = 0.07;
    // this.controls.minZoom = 15;
    // this.controls.maxZoom = 30;
    this.controls.minDistance = 15;
    this.controls.maxDistance = 30;
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
    this.light = new THREE.HemisphereLight(0xffeeb1, 0x080820, 2);
    this.scene.add(this.light);
    // this.scene.add(this.ambiLight);
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    this.directionalLight.position.set(0, 1, 5);
    this.scene.add(this.directionalLight);
    // this.directionalLightHelper = new THREE.DirectionalLightHelper( this.directionalLight, 5 );
    //  this.scene.add(this.directionalLightHelper);
    this.spotLight = new THREE.SpotLight(0xffa95c, 4);
    this.spotLight.castShadow = true;
    this.spotLight.shadow.bias = -0.0001;
    this.spotLight.shadow.mapSize.width = 1024 * 4;
    this.spotLight.shadow.mapSize.height = 1024 * 4;
    // this.scene.add(this.spotLight);
  }
  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.controls.update();
    this.renderer.render(this.scene, this.cameraMain);
    // this.composer.render();
    /*this.spotLight.position.set(
      this.cameraMain.x + 10,
      this.cameraMain.y + 10,
      this.cameraMain.z + 10
    );*/
  }
  render() {
    this.animate();
  }
}
let textureLoad = (texturePath) => {
  let texture = new THREE.TextureLoader().load(texturePath);
  texture.encoding = THREE.sRGBEncoding;
  texture.flipY = false;
  texture.anisotropy = 32;
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
          node.castShadow = true;
          node.receiveShadow = true;
          if (node.name == "strap") {
            node.material = strapMat;
          } else if (node.name == "Frame" || node.name == "reverseMetalOuter") {
            node.material = frameMat;
          } else if (node.name == "timeIndex") {
            node.material = timeIndex;
          } else if (node.name == "Dial") {
            node.material = new THREE.MeshPhongMaterial({
              map: textureLoad("./assets/tex/newTexture/jpg/dialMap.jpg"),
              aoMap: textureLoad("assets/tex/newTexture/jpg/Watch_low_AO.jpg"),
              aoMapIntensity: 1.23,
              envMap: envMap,
              reflectivity: 0.4,
              combine: THREE.MixOperation,
              side: THREE.DoubleSide,
            });
          } else if (node.name == "glass") {
            node.visible = false;
            node.material = glassMat;
          } else if (node.name == "reverseMetalInner") {
            node.material = reverseMetal;
          } else if (node.name === "Decoration") {
            node.material = new THREE.MeshPhongMaterial({
              transparent: true,
              opacity: 0,
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
