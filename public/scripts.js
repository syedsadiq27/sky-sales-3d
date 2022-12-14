import * as THREE from "../libs/three.module.js";
import { GLTFLoader } from "../libs/GLTFLoader.js";
import { OrbitControls } from "../libs/OrbitControls.js";
import { materialLoader } from "../libs/material.js";
import { RGBELoader } from "/libs/RGBELoader.js";

const GltfLoader = new GLTFLoader();

let textureMap = {
  Gold: {
    url: "./textures/v1/gold_strap.jpg",
  },
  Brown: {
    url: "./textures/v1/brown_strap.jpg",
  },
  Black: {
    url: "./textures/v1/black_strap.jpg",
  },
  Blue: {
    url: "./textures/v1/black_strap.jpg",
  },
  BlackDail: {
    url: "./textures/v1/brown_strap.jpg",
  },
};

const envMap = new THREE.CubeTextureLoader()
  .setPath("./textures/envMap/")
  .load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]);

// //cosole.log("env",envMap);

const glassMat = new THREE.MeshPhongMaterial({
  side: THREE.DoubleSide,
  envMap: envMap,
  envMapIntensity: 2,
  opacity: 0.3,
  reflectivity: 0.5,
  transparent: true,
});

const findMaterial = (name) => {
  const materials = window.database.loadedMaterials;
  var keyValue;

  Object.entries(materials).forEach(([key, value]) => {
    //cosole.log(value.name, name);
    if (value.name == name) {
      keyValue = key;
    }
  });

  return materials[keyValue] || null;
};

window.onload = () => {
  var iconArray = [
    {
      name: "Gold",
      image: "./textures/icons/strap/Gold.png",
    },
    {
      name: "Black",
      image: "./textures/icons/strap/Black.png",
    },
    {
      name: "Brown",
      image: "./textures/icons/strap/Maroon.png",
    },
  ];

  var dailArray = [
    {
      name: "Blue",
      image: "./textures/icons/dial/BlueDial.png",
    },
    {
      name: "BlackDail",
      image: "./textures/icons/dial/BlackDial.png",
    },
    {
      name: "Gold",
      image: "./textures/icons/dial/GoldDial.png",
    },
  ];

  // const materials = {

  // };

  const strapConfigDiv = document.getElementById("strapConfig");
  const dailConfigDiv = document.getElementById("dailConfig");
  const frameConfigDiv = document.getElementById("frameConfig");

  const strapConigSection = document.createElement("section");
  const frameConfigSection = document.createElement("section");
  const dailConfigSection = document.createElement("section");
  strapConigSection.classList.add("person");
  frameConfigSection.classList.add("person");
  dailConfigSection.classList.add("person");

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
      console.log(strapConigSection);
      // strapConigSection.forEach(item => item.classList.remove("activeBorder"))
      // e.target.classList.add("activeBorder");

      window.database.configSelections.strap = e.target.id;
      scene.traverse(function (child) {
        //cosole.log(child.name);
        if (child.isMesh) {
          if (child.name === "strape") {
            const texture = new THREE.TextureLoader().load(
              textureMap[e.target.id].url
            );
            texture.encoding = THREE.sRGBEncoding;
            texture.flipY = false;
            child.material.map = texture;
            child.material.needsUpdate = true;
          }

          if (child.name === "glass") {
            child.material = glassMat;
            //cosole.log(child);
          }
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
      //cosole.log("you clicked", e);
      //cosole.log("you clicked", e);
      // console.log("you clicked", e, entry);
      // console.log(e.target.id);
      window.database.configSelections.dail = e.target.id;
      scene.traverse(function (child) {
        //cosole.log(child.name);
        if (child.isMesh) {
          if (child.name === "Dail") {
            const texture = new THREE.TextureLoader().load(
              textureMap[e.target.id].url
            );
            texture.encoding = THREE.sRGBEncoding;
            texture.flipY = false;
            child.material.map = texture;
            child.material.needsUpdate = true;
          }

          if (child.name === "glass") {
            child.material = glassMat;
            //cosole.log(child);
          }
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

  // 3D Scene Setup

  const container = document.getElementById("3d-canvas");
  const twodcontainer = document.getElementById("2d-image");
  // //cosole.log(twodcontainer.getBoundingClientRect().height);
  container.style.width = container.parentElement.getBoundingClientRect().width;
  container.style.height = "549px";

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    35,
    container.offsetWidth / container.offsetHeight,
    0.1,
    1000
  );

  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(0xffffff);
  renderer.setSize(container.offsetWidth, container.offsetHeight);

  renderer.toneMapping = THREE.ReinhardToneMapping;
  renderer.toneMappingExposure = 2.2;
  renderer.gammaFactor = 2.2;
  renderer.gammaInput = true;
  renderer.gammaOutput = true;

  // scene.environment = envMap;

  // var envMap = new THREE.TextureLoader().load("envMap.png");
  // envMap.mapping = THREE.SphericalReflectionMapping;
  // material.envMap = envMap;

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.minZoom = 1;
  controls.maxZoom = 10;

  controls.minDistance = 0.14;
  controls.maxDistance = 0.2;

  // controls.autoRotate = true

  container.appendChild(renderer.domElement);

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
  }

  // Loading Models data

  const fileImporter = (uniqueName) => {
    // const scene = useCanvasStore.getState().scene;

    //cosole.log("adding", uniqueName);
    const obj = scene.getObjectByName(uniqueName);
    if (obj) {
      console.error(`Can't add duplicate object to scene adding ${uniqueName}`);
      return;
    }

    const rules = window.database.response.rules;
    const modelRules = rules && rules[uniqueName];
    const url = modelRules?.__path;
    importFile(url, uniqueName);
  };

  const importFile = (url, uniqueName) => {
    const extension = url?.split(".")?.pop()?.toLowerCase();
    let loader = GltfLoader;

    switch (extension) {
      case "gltf":
      case "glb":
        loader = GltfLoader;
        break;
      case "fbx":
        loader = GltfLoader;
        break;
      default: {
        console.error(
          `File extensions of type ${extension} is not supported yet. If you think this extension is supported, please contact the admin or support team!`
        );
        return;
      }
    }

    if (scene)
      loader.load(url, function (gltf) {
        // const visible = modelConfig?.editableObjects?.includes(uniqueName)
        //   ? true
        //   : false;
        if (gltf.scene) {
          addObjectsToScene(gltf.scene, uniqueName);
        } else {
          addObjectsToScene(gltf, uniqueName);
        }

        // render();
      });
  };

  const addObjectsToScene = (obj, uniqueName, visible = true) => {
    const modelRules = window.database.response?.rules[uniqueName];
    // const modelRules = rules && rules[uniqueName];
    var ggroup = new THREE.Group();
    ggroup.name = uniqueName;
    modelRules
      ? (ggroup.userData = modelRules)
      : (ggroup.userData = {
          // values to keep
          __editable: true,
          __editableName: uniqueName,
          __editableType: "group",

          // propertyId: propertyId,
          // propertyValueId: propertyValueId,
          objectId: uniqueName.replace("u", ""),
          lock: false,
          editableTransform: {},
          default: {},
          children: {},
        });

    // TODO remove the codes for Cleanup codes
    // ggroup.userData.propertyId = propertyId;
    // ggroup.userData.propertyValueId = propertyValueId;
    ggroup.userData.objectId = uniqueName.replace("u", "");
    // Cleanup codes end

    obj.children.forEach((child) => {
      var childClone = child.clone();
      ggroup.add(childClone);
      childClone.userData = ggroup.userData.children[child.name];
      ggroup.add(childClone);
    });
    ggroup.applyMatrix4(
      new THREE.Matrix4().compose(
        obj.position,
        obj.quaternion,
        new THREE.Vector3(1, 1, 1)
      )
    );

    ggroup.traverse((mesh) => {
      const objUserData = ggroup.userData?.children[mesh.name];
      // //cosole.log(objUserData?.material?.[0].name);
      const material = findMaterial(objUserData?.material?.[0]?.name);

      if (material) {
        mesh.material = material;
      }

      if (objUserData?.color) {
        mesh.userData.color = objUserData.color;
      } else {
        mesh.userData = { ...mesh.userData, color: [] };
      }
      if (objUserData?.name) mesh.userData.name = objUserData.name;
      if (objUserData?.visible !== undefined) {
        mesh.visible = objUserData?.visible;
        mesh.userData.visible = objUserData?.visible;
      }
      if (
        objUserData?.decoration ||
        mesh.name.toLowerCase().includes("decoration")
      ) {
        // const decorationMeshes = useCustomizerStore.getState().decorationMeshes;
        const material = new THREE.MeshPhongMaterial({
          opacity: 0,
          transparent: true,
        });
        material.needsUpdate = true;
        mesh.material = material;

        // decorationMeshes.push(mesh);

        // useCustomizerStore.setState({ decorationMeshes });
      }
      // Adding shadows
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      if (mesh instanceof THREE.Mesh) {
        const objUserData = ggroup.userData?.children[mesh.name];

        mesh.userData.material = [];
        mesh.material.userData.defaults = {};

        mesh.material.userData.defaults = {
          map: mesh.material.map?.uuid,
          normalMap: mesh.material.normalMap?.uuid,
          displacementMap: mesh.material.displacementMap?.uuid,
          bumpMap: mesh.material.bumpMap?.uuid,
        };
        mesh.userData.defaultColor =
          "#" + mesh?.material?.color?.getHexString();
        if (objUserData?.material?.length > 0) {
          // //cosole.log(objUserData.material[0].uuid);
          // mesh.material = materialLoader(
          //   objUserData.material[0],
          //   mesh.material.clone()
          // );
        }

        // if (mesh.name == "glass") {
        //   mesh.material = glassMat;
        // }
        mesh.material.side = THREE.DoubleSide;
        mesh.material.needsUpdate = true;
      }

      ggroup.receiveShadow = true;
      ggroup.castShadow = true;
    });

    ggroup.visible = visible;
    scene && scene.add(ggroup);
  };

  const addLightsToScene = (
    object,
    uniqueName,
    editableType,
    position,
    type = "respose"
  ) => {
    // const scene = useCanvasStore.getState().scene;

    // Restrict duplicate entries of Light while loading
    const objectExists = scene?.getObjectByName(uniqueName);
    if (objectExists) {
      console.warn(
        `Lights alrady exsists, skiping the addtion of light ${uniqueName}`
      );
      return;
    }

    object.name = uniqueName;
    object.userData = {
      __editable: true,
      __editableName: uniqueName,
      __editableType: editableType,
    };

    object.position
      .set(position.x / 80, position.y / 80, position.z / 80)
      .normalize();
    // object.applyMatrix4(
    //   new THREE.Matrix4().compose(
    //     position,
    //     new THREE.Quaternion(),
    //     new THREE.Vector3(1, 1, 1),
    //   ),
    // );

    if (scene) {
      scene.add(object);
    }
  };
  const render = () => {
    // requestAnimationFrame(render);
    renderer.render(scene, camera);
  };

  const setCameraData = (camraData) => {
    //cosole.log(camraData);
    camera.name = camraData.uniqueName;
    const { x, y, z } = camraData;
    camera.position.set(x / 80, y, z / 80);
    render();

    //   {
    //     "type": "Perspective",
    //     "x": 20,
    //     "y": 20,
    //     "z": 20,
    //     "fov": 45,
    //     "near": 0.01,
    //     "far": 1000,
    //     "uniqueName": "camera"
    // }
  };

  const loadEnv = (envData) => {
    //   {
    //     "color": {},
    //     "image": {
    //         "id": 3797,
    //         "downloadURL": null,
    //         "media_type": "Environment Map",
    //         "mediaFormat": "application/octet-stream",
    //         "Image_Alternate_Name": "thatch_chapel_1k.hdr",
    //         "__typename": "ProductMediaData"
    //     },
    //     "uniqueName": "envMap",
    //     "envBackground": false
    // }

    new RGBELoader().load(
      "textures/envMap/thatch_chapel_1k.hdr",
      function (texture, textureData) {
        scene.environment = texture;
        render();
      }
    );
  };

  // Querty Call

  axios
    .post(
      "https://product-3ddd-plus-server-f4b4o225iq-ue.a.run.app/179/auth-commerce",
      {
        client_secret_key: "f1e55008-4f37-487c-b2d6-ecd8b493d34b",
        clientkey: "201ukw5n9df",
        scope: "scope 1",
      }
    )
    .then((res) => {
      //cosole.log(res.data.access_Token);
      window.database = {
        accessToken: res.data.access_Token,
        scene: scene,
        configSelections: {
          strap: "Brown",
          dail: "BlackDail",
          frame: "#bf8d71",
        },
      };
      const config = {
        headers: { Authorization: `Bearer ${res.data.access_Token}` },
      };

      const instance = axios.create({
        baseURL:
          "https://product-3ddd-plus-server-f4b4o225iq-ue.a.run.app/179/",
        timeout: 5000,
        headers: { Authorization: "Bearer " + res.data.access_Token },
      });

      instance.get("/host/getCommerceViewById/1895").then((res) => {
        window.database.response = res.data;
        // //cosole.log(res);

        const materialJSON = JSON.parse(res.data.materials);
        const loadedMaterials = {};

        Object.entries(materialJSON).forEach(([key, value]) => {
          loadedMaterials[key] = materialLoader(value);
        });

        //cosole.log("loadedMaterials", loadedMaterials);

        window.database.loadedMaterials = loadedMaterials;

        window.database.configrations = {
          color: res.data.displayData[0].values[0].selections.frame.color,
        };

        const configrations =
          res?.data?.displayData[0]?.values[0]?.selections?.frame?.color;
        configrations.forEach((entry) => {
          // console.log(item);
          // const [key, value] = entry;
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
            window.database.configSelections.frame = e.target.id;
            scene.traverse(function (child) {
              if (child.isMesh) {
                if (
                  child.name === "frame" ||
                  child.name === "time_index" ||
                  child.name === "police_text"
                ) {
                  child.material.color.setHex(entry.replace("#", "0x"));
                  child.material.color.convertSRGBToLinear();
                }
                if (
                  entry == "#c0c0c0" &&
                  (child.name === "time_index" || child.name === "police_text")
                ) {
                  // console.log("inside...");
                  child.material = child.material.clone();
                  child.material.color.setHex("0x000000");
                  child.material.color.convertSRGBToLinear();
                }
              }
            });
          }
        });

        frameConfigDiv.appendChild(frameConfigSection);

        res.data.editableObjects.forEach((item) => fileImporter(item));
        const lightsData = res.data.productSettings.light;
        const camraData = res.data.productSettings.camera;

        setCameraData(camraData);
        loadEnv(res.data.productSettings.environmentmap);

        Object.entries(lightsData).forEach(([key, value]) => {
          if (key === "Ambient") {
            value.forEach((item) => {
              const light = new THREE.AmbientLight(
                item.color.replace("#", "0x"),
                item.intensity
              );
              addLightsToScene(
                light,
                item.uniqueName,
                "ambientLight",
                new THREE.Vector3()
              );
            });
          }
          if (key === "Spot") {
            value.forEach((item) => {
              const light = new THREE.SpotLight(
                new THREE.Color(item.color.replace("#", "0x")),
                item.intensity
              );
              const position = new THREE.Vector3(item.x, item.y, item.z);
              addLightsToScene(light, item.uniqueName, "spotLight", position);
            });
          }
          if (key === "Point") {
            value.forEach((item) => {
              const light = new THREE.PointLight(
                new THREE.Color(item.color.replace("#", "0x")),
                item.intensity,
                100
              );
              const position = new THREE.Vector3(item.x, item.y, item.z);
              addLightsToScene(light, item.uniqueName, "pointLight", position);
            });
          }
          if (key === "Directional") {
            value.forEach((item) => {
              const light = new THREE.DirectionalLight(
                new THREE.Color(item.color.replace("#", "0x")),
                item.intensity
              );
              const position = new THREE.Vector3(item.x, item.y, item.z);
              addLightsToScene(
                light,
                item.uniqueName,
                "directionalLight",
                position
              );
            });
          }
          if (key === "Hemisphere") {
            value.forEach((item) => {
              const light = new THREE.HemisphereLight(
                new THREE.Color(item.color.replace("#", "0x")),
                new THREE.Color(item.groundColor.replace("#", "0x")),
                item.intensity
              );
              // const position = new Vector3(item.x, item.y, item.z);
              addLightsToScene(
                light,
                item.uniqueName,
                "hemisphereLight",
                new THREE.Vector3()
              );
            });
          }
        });

        // //cosole.log(JSON.parse(res.data.materials))
      });
    });
  animate();
};

function hideElem() {
  var x = document.getElementById("myImg");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}
