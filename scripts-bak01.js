import * as THREE from "./libs/three.module.js";
import { GLTFLoader } from "./libs/GLTFLoader.js";
import { OrbitControls } from "./libs/OrbitControls.js";
import { materialLoader } from "./libs/material.js";

const GltfLoader = new GLTFLoader();
let refCube;
let textureMap = {
  Gold: {
    url: "./textures/gold_Base_color.jpg",
  },
  Silver: {
    url: "./textures/silver_Base_color.jpg",
  },
  Black: {
    url: "./textures/black_Base_color.jpg",
  },
};

window.onload = () => {
  refCube = new THREE.CubeTextureLoader()
    .setPath("./env/")
    .load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]);

  const textureLoader = (data) => {
    const _T = new THREE.TextureLoader().load(data);
    _T.encoding = THREE.sRGBEncoding;
    _T.flipY = false;
    return _T;
  };

  const frameMat = new THREE.MeshStandardMaterial({
    envMap: refCube,
    envMapIntensity: 2,
    //  color: new THREE.Color( 0xad7c51 ),
    map: textureLoader("./textures/gold_Base_color.jpg"),
    metalnessMap: textureLoader("./textures/gold_Base_color.jpg"),
    // lightMap:textureLoader("./textures/Ambient Occlusion Map.jpg"),
    normalMap: textureLoader("./textures/silver_Normal_OpenGL.jpg"),
    normalScale: new THREE.Vector2(1, 1),
    aoMap: new THREE.TextureLoader().load(
      "./textures/Ambient Occlusion Map.jpg"
    ),
    aoMapIntensity: 1,
    metalness: 1,
    roughness: 0.2,
    combine: THREE.MixOperation,
    side: THREE.DoubleSide,
  });
  var iconArray = [
    {
      name: "Gold",
      image: "./image/watch2.png",
    },
    {
      name: "Black",
      image: "./image/watch2.png",
    },
    {
      name: "Silver",
      image: "./image/watch2.png",
    },
  ];

  // textures/Ambient Occlusion Map.jpg
  // textures/black_Base_color.jpg
  // textures/black_Metallic.jpg
  // textures/black_Normal_OpenGL.jpg
  // textures/black_Roughness.jpg
  // textures/glass_Opacity.jpg
  // textures/gold_Base_color.jpg
  // textures/gold_Metallic.jpg
  // textures/gold_Normal_OpenGL.jpg
  // textures/gold_Roughness.jpg
  // textures/silver_Base_color.jpg
  // textures/silver_Metallic.jpg
  // textures/silver_Normal_OpenGL.jpg
  // textures/silver_Roughness.jpg

  const materials = {
    strapMat: new THREE.MeshStandardMaterial({
      envMap: refCube,
      envMapIntensity: 2,
      map: textureLoader("./textures/gold_Base_color.jpg"),
      lightMap: textureLoader("./textures/Ambient Occlusion Map.jpg"),
      normalMap: textureLoader("./textures/silver_Normal_OpenGL.jpg"),
      normalScale: new THREE.Vector2(1, 1),
      metalnessMap: textureLoader("./textures/gold_Metallic.jpg"),
      roughnessMap: textureLoader("./textures/gold_Roughness.jpg"),
      aoMap: new THREE.TextureLoader().load(
        "./textures/Ambient Occlusion Map.jpg"
      ),
      aoMapIntensity: 1,
      metalness: 0.7,
      roughness: 0.7,
      combine: THREE.MixOperation,
      side: THREE.DoubleSide,
    }),
    gold: new THREE.MeshStandardMaterial({
      envMap: refCube,
      envMapIntensity: 2,
      map: textureLoader("./textures/gold_Base_color.jpg"),
      lightMap: textureLoader("./textures/Ambient Occlusion Map.jpg"),
      normalMap: textureLoader("./textures/silver_Normal_OpenGL.jpg"),
      normalScale: new THREE.Vector2(1, 1),
      aoMap: new THREE.TextureLoader().load(
        "./textures/Ambient Occlusion Map.jpg"
      ),
      metalnessMap: textureLoader("./textures/gold_Metallic.jpg"),
      roughnessMap: textureLoader("./textures/gold_Roughness.jpg"),
      aoMapIntensity: 1,
      metalness: 0.7,
      roughness: 0.7,
      combine: THREE.MixOperation,
      side: THREE.DoubleSide,
    }),
    s: new THREE.MeshStandardMaterial({
      envMap: refCube,
      envMapIntensity: 2,
      map: textureLoader("./textures/gold_Base_color.jpg"),
      lightMap: textureLoader("./textures/Ambient Occlusion Map.jpg"),
      normalMap: textureLoader("./textures/silver_Normal_OpenGL.jpg"),
      normalScale: new THREE.Vector2(1, 1),
      aoMap: new THREE.TextureLoader().load(
        "./textures/Ambient Occlusion Map.jpg"
      ),
      metalnessMap: textureLoader("./textures/gold_Metallic.jpg"),
      roughnessMap: textureLoader("./textures/gold_Roughness.jpg"),
      aoMapIntensity: 1,
      metalness: 0.7,
      roughness: 0.7,
      combine: THREE.MixOperation,
      side: THREE.DoubleSide,
    }),

    // gold: new THREE.MeshStandardMaterial(),
    // silver: new THREE.MeshStandardMaterial(),
    // black: new THREE.MeshStandardMaterial(),
  };

  const mydiv = document.getElementById("demo2");

  const section = document.createElement("section");
  section.classList.add("person");

  Object.entries(iconArray).forEach((entry) => {
    const [key, value] = entry;
    // console.log(key, value);
    var elem = document.createElement("img");
    elem.setAttribute("id", value.name);
    elem.classList.add("img");
    elem.setAttribute("src", value.image);
    elem.setAttribute("height", "88");
    elem.setAttribute("width", "88");
    elem.setAttribute("border", "1px solid #767676");
    elem.addEventListener("click", handleClick);
    section.appendChild(elem);

    function handleClick(e) {
      console.log("you clicked", e);
      scene.traverse(function (child) {
        if (child.isMesh) {
          console.log("CHILD--->", child.name);
          if (
            child.name === "Strap" ||
            child.name === "Rim" ||
            child.name === "Duckle" ||
            child.name === "Mesh_10001" ||
            child.name === "Mesh_10001_1"
          ) {
            const texture = new THREE.TextureLoader().load(
              textureMap[e.target.id].url
            );
            texture.encoding = THREE.sRGBEncoding;
            texture.flipY = false;
            child.material.map = texture;
            child.material.needsUpdate = true;
          }
        }
      });
    }
  });

  mydiv.appendChild(section);

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
  console.log(twodcontainer.getBoundingClientRect().height);
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

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;

  container.appendChild(renderer.domElement);

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
  }

  // Loading Models data

  const fileImporter = (uniqueName) => {
    // const scene = useCanvasStore.getState().scene;

    console.log("adding", uniqueName);
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
      mesh.frustumCulled = true;
      const objUserData = ggroup.userData?.children[mesh.name];

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
      // Adding shadows
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      if (mesh instanceof THREE.Mesh) {
        const objUserData = ggroup.userData?.children[mesh.name];
        console.log("MESH->NAME", mesh.name);
        if (mesh.name === "Strap") {
          //  mesh.visible = false;
          mesh.material = materials.strapMat;
        } else if (
          mesh.name === "Duckle" ||
          mesh.name === "Mesh_10001" ||
          mesh.name === "Rim"
        ) {
          mesh.visible = true;
          mesh.material = frameMat;
          mesh.material.needsUpdate = true;
          // mesh.visible = false;
        } else {
          mesh.visible = false;
        }

        /* mesh.userData.material = [];
        mesh.material.userData.defaults = {};*/

        /*mesh.material.userData.defaults = {
          map: mesh.material.map?.uuid,
          normalMap: mesh.material.normalMap?.uuid,
          displacementMap: mesh.material.displacementMap?.uuid,
          bumpMap: mesh.material.bumpMap?.uuid,
        };*/

        /*if (objUserData?.material?.length > 0) {
          console.log('--->objUserData',objUserData)*/
        /*mesh.material = materialLoader(
            objUserData.material[0],
            mesh.material.clone()
          );*/
        //   }
        // mesh.material.side = THREE.DoubleSide;
        //mesh.material.needsUpdate = true;*/
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

    object.position.set(position.x, position.y, position.z).normalize();
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
    console.log(camraData);
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
      console.log(res.data.access_Token);
      window.database = {
        accessToken: res.data.access_Token,
      };
      const config = {
        headers: { Authorization: `Bearer ${res.data.access_Token}` },
      };

      const instance = axios.create({
        baseURL:
          "https://product-3ddd-plus-server-f4b4o225iq-ue.a.run.app/179/",
        timeout: 1000,
        headers: { Authorization: "Bearer " + res.data.access_Token },
      });

      instance.get("/host/getCommerceViewById/1879").then((res) => {
        window.database.response = res.data;
        console.log(res);

        res.data.editableObjects.forEach((item) => fileImporter(item));
        const lightsData = res.data.productSettings.light;
        const camraData = res.data.productSettings.camera;

        setCameraData(camraData);

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
              const light = new THREE.HemisphereLight("#ffffff", "#000000", 3);
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
