import {
  Color,
  CubeTextureLoader,
  FrontSide,
  Matrix3,
  Matrix4,
  MeshBasicMaterial,
  MeshDepthMaterial,
  MeshLambertMaterial,
  MeshMatcapMaterial,
  MeshNormalMaterial,
  MeshPhongMaterial,
  MeshStandardMaterial,
  MeshToonMaterial,
  NormalBlending,
  RawShaderMaterial,
  RGBAFormat,
  ShaderMaterial,
  ShadowMaterial,
  sRGBEncoding,
  TextureLoader,
  Vector2,
  Vector3,
  Vector4,
} from "./three.module.js";

// const _newURL   =
// const _oldURL   =

// export const URLMapping = url => {
//   return url.replace(_oldURL, _newURL);
// };

const cubeEnvMap = new CubeTextureLoader()
  .setPath("./textures/envMap/")
  .load(["px.png", "nx.png", "py.png", "ny.png", "pz.png", "nz.png"]);

export const materialExporter = (mat) => {
  const material = mat.clone();
  let meta;
  const isRoot = meta === undefined || typeof meta === "string";

  if (isRoot) {
    meta = {
      textures: {},
      images: {},
    };
  }

  const JSON = {};

  JSON.uuid = mat.uuid;
  JSON.type = material.type;

  if (material.name !== "") JSON.name = material.name;

  if (material.color && material.color.isColor)
    JSON.color = "0x" + material.color.convertLinearToSRGB().getHexString();

  if (material.roughness !== undefined) JSON.roughness = material.roughness;
  if (material.metalness !== undefined) JSON.metalness = material.metalness;

  if (material.sheen !== undefined) JSON.sheen = material.sheen;
  if (material.sheenTint && material.sheenTint.isColor)
    JSON.sheenTint = material.sheenTint.getHexString();
  if (material.sheenRoughness !== undefined)
    JSON.sheenRoughness = material.sheenRoughness;
  if (material.emissive && material.emissive.isColor)
    JSON.emissive =
      "0x" + material.emissive.convertLinearToSRGB().getHexString();
  if (material.emissiveIntensity && material.emissiveIntensity !== 1)
    JSON.emissiveIntensity = material.emissiveIntensity;

  if (material.specular && material.specular.isColor)
    JSON.specular = material.specular.convertLinearToSRGB().getHexString();
  if (material.specularIntensity !== undefined)
    JSON.specularIntensity = material.specularIntensity;
  if (material.specularTint && material.specularTint.isColor)
    JSON.specularTint = material.specularTint.getHexString();
  if (material.shininess !== undefined) JSON.shininess = material.shininess;
  if (material.clearcoat !== undefined) JSON.clearcoat = material.clearcoat;
  if (material.clearcoatRoughness !== undefined)
    JSON.clearcoatRoughness = material.clearcoatRoughness;

  if (material.clearcoatMap && material.clearcoatMap.isTexture) {
    JSON.clearcoatMap = material.clearcoatMap.toJSON(meta).uuid;
  }

  if (
    material.clearcoatRoughnessMap &&
    material.clearcoatRoughnessMap.isTexture
  ) {
    JSON.clearcoatRoughnessMap =
      material.clearcoatRoughnessMap.toJSON(meta).uuid;
  }

  if (material.clearcoatNormalMap && material.clearcoatNormalMap.isTexture) {
    JSON.clearcoatNormalMap = material.clearcoatNormalMap.toJSON(meta).uuid;
    JSON.clearcoatNormalScale = material.clearcoatNormalScale.toArray();
  }

  JSON.aoMapIntensity = material.aoMapIntensity;

  JSON.bumpScale = material.bumpScale;

  if (material.envMapIntensity !== undefined)
    JSON.envMapIntensity = material.envMapIntensity;
  if (material.reflectivity !== undefined)
    JSON.reflectivity = material.reflectivity;

  if (material.transmission !== undefined)
    JSON.transmission = material.transmission;
  if (material.transmissionMap && material.transmissionMap.isTexture)
    JSON.transmissionMap = material.transmissionMap.toJSON(meta).uuid;
  if (material.thickness !== undefined) JSON.thickness = material.thickness;
  if (material.thicknessMap && material.thicknessMap.isTexture)
    JSON.thicknessMap = material.thicknessMap.toJSON(meta).uuid;
  if (material.attenuationDistance !== undefined)
    JSON.attenuationDistance = material.attenuationDistance;
  if (material.attenuationTint !== undefined)
    JSON.attenuationTint = material.attenuationTint.getHexString();

  if (material.size !== undefined) JSON.size = material.size;
  if (material.shadowSide !== null) JSON.shadowSide = material.shadowSide;
  if (material.sizeAttenuation !== undefined)
    JSON.sizeAttenuation = material.sizeAttenuation;

  if (material.blending !== NormalBlending) JSON.blending = material.blending;
  if (material.side !== FrontSide) JSON.side = material.side;
  if (material.vertexColors) JSON.vertexColors = true;

  if (material.opacity < 1) JSON.opacity = material.opacity;
  if (material.format !== RGBAFormat) JSON.format = material.format;
  if (material.transparent === true) JSON.transparent = material.transparent;

  JSON.depthFunc = material.depthFunc;
  JSON.depthTest = material.depthTest;
  JSON.depthWrite = material.depthWrite;
  JSON.colorWrite = material.colorWrite;

  JSON.stencilWrite = material.stencilWrite;
  JSON.stencilWriteMask = material.stencilWriteMask;
  JSON.stencilFunc = material.stencilFunc;
  JSON.stencilRef = material.stencilRef;
  JSON.stencilFuncMask = material.stencilFuncMask;
  JSON.stencilFail = material.stencilFail;
  JSON.stencilZFail = material.stencilZFail;
  JSON.stencilZPass = material.stencilZPass;

  if (material.rotation && material.rotation !== 0)
    JSON.rotation = material.rotation;

  if (material.polygonOffset === true) JSON.polygonOffset = true;
  if (material.polygonOffsetFactor !== 0)
    JSON.polygonOffsetFactor = material.polygonOffsetFactor;
  if (material.polygonOffsetUnits !== 0)
    JSON.polygonOffsetUnits = material.polygonOffsetUnits;

  if (material.linewidth && material.linewidth !== 1)
    JSON.linewidth = material.linewidth;
  if (material.dashSize !== undefined) JSON.dashSize = material.dashSize;
  if (material.gapSize !== undefined) JSON.gapSize = material.gapSize;
  if (material.scale !== undefined) JSON.scale = material.scale;

  if (material.dithering === true) JSON.dithering = true;

  if (material.alphaTest > 0) JSON.alphaTest = material.alphaTest;
  if (material.alphaToCoverage === true)
    JSON.alphaToCoverage = material.alphaToCoverage;
  if (material.premultipliedAlpha === true)
    JSON.premultipliedAlpha = material.premultipliedAlpha;

  if (material.wireframe === true) JSON.wireframe = material.wireframe;
  if (material.wireframeLinewidth > 1)
    JSON.wireframeLinewidth = material.wireframeLinewidth;
  if (material.wireframeLinecap !== "round")
    JSON.wireframeLinecap = material.wireframeLinecap;
  if (material.wireframeLinejoin !== "round")
    JSON.wireframeLinejoin = material.wireframeLinejoin;

  if (material.flatShading === true) JSON.flatShading = material.flatShading;

  if (material.visible === false) JSON.visible = false;

  if (material.toneMapped === false) JSON.toneMapped = false;

  JSON.userData = material.userData;

  if (JSON.userData.defaults) delete JSON.userData.defaults;
  if (JSON.userData.defauls) delete JSON.userData.defauls;

  return JSON;
};

export const materialLoader = (json, defaultMatetrial) => {
  const textures = json.textures;

  function getTexture(name) {
    if (textures[name] === undefined) {
      console.warn("THREE.MaterialLoader: Undefined texture", name);
    }

    return textures[name];
  }

  let material;

  if (defaultMatetrial && defaultMatetrial.type !== json.type) {
    switch (json.type) {
      case "MeshBasicMaterial":
        material = new MeshBasicMaterial();
        break;
      case "MeshDepthMaterial":
        material = new MeshDepthMaterial();
        break;
      case "MeshNormalMaterial":
        material = new MeshNormalMaterial();
        break;
      case "MeshLambertMaterial":
        material = new MeshLambertMaterial();
        break;
      case "MeshMatcapMaterial":
        material = new MeshMatcapMaterial();
        break;
      case "MeshPhongMaterial":
        material = new MeshPhongMaterial();
        break;
      case "MeshToonMaterial":
        material = new MeshToonMaterial();
        break;
      case "MeshStandardMaterial":
        material = new MeshStandardMaterial();
        break;
      case "RawShaderMaterial":
        material = new RawShaderMaterial();
        break;
      case "ShaderMaterial":
        material = new ShaderMaterial();
        break;
      case "ShadowMaterial":
        material = new ShadowMaterial();
        break;
      default:
        material = new MeshStandardMaterial();
    }
    if (defaultMatetrial.hasOwnProperty("color")) {
      material.color = defaultMatetrial.color;
    }
    if (defaultMatetrial.hasOwnProperty("map")) {
      material.map = defaultMatetrial.map;
    }
    if (defaultMatetrial.hasOwnProperty("vertexColors")) {
      material.vertexColors = defaultMatetrial.vertexColors;
    }
  } else if (defaultMatetrial) {
    material = defaultMatetrial;
  } else {
    switch (json.type) {
      case "MeshBasicMaterial":
        material = new MeshBasicMaterial();
        break;
      case "MeshDepthMaterial":
        material = new MeshDepthMaterial();
        break;
      case "MeshNormalMaterial":
        material = new MeshNormalMaterial();
        break;
      case "MeshLambertMaterial":
        material = new MeshLambertMaterial();
        break;
      case "MeshMatcapMaterial":
        material = new MeshMatcapMaterial();
        break;
      case "MeshPhongMaterial":
        material = new MeshPhongMaterial();
        break;
      case "MeshToonMaterial":
        material = new MeshToonMaterial();
        break;
      case "MeshStandardMaterial":
        material = new MeshStandardMaterial();
        break;
      case "RawShaderMaterial":
        material = new RawShaderMaterial();
        break;
      case "ShaderMaterial":
        material = new ShaderMaterial();
        break;
      case "ShadowMaterial":
        material = new ShadowMaterial();
        break;
      default:
        material = new MeshStandardMaterial();
    }
  }

  var textureLoader = new TextureLoader();

  if (json.userData?.map) {
    const loadMapping = (property, mappingValue) => {
      var Map = textureLoader.load(mappingValue.url);
      Map.encoding = sRGBEncoding;
      if (mappingValue.flipY !== undefined) Map.flipY = mappingValue.flipY;

      if (material.hasOwnProperty(property)) material[property] = Map;
    };
    var mappingUserData = json.userData.map;

    if (mappingUserData.alphaMap)
      loadMapping("alphaMap", mappingUserData.alphaMap);
    if (mappingUserData.aoMap) loadMapping("aoMap", mappingUserData.aoMap);
    if (mappingUserData.bumpMap)
      loadMapping("bumpMap", mappingUserData.bumpMap);
    if (mappingUserData.displacementMap)
      loadMapping("displacementMap", mappingUserData.displacementMap);
    if (mappingUserData.emissiveMap)
      loadMapping("emissiveMap", mappingUserData.emissiveMap);
    if (mappingUserData.lightMap)
      loadMapping("lightMap", mappingUserData.lightMap);
    if (mappingUserData.map) loadMapping("map", mappingUserData.map);
    if (mappingUserData.metalnessMap)
      loadMapping("metalnessMap", mappingUserData.metalnessMap);
    if (mappingUserData.normalMap)
      loadMapping("normalMap", mappingUserData.normalMap);
    if (mappingUserData.roughnessMap)
      loadMapping("roughnessMap", mappingUserData.roughnessMap);
    if (mappingUserData.specularMap)
      loadMapping("specularMap", mappingUserData.specularMap);
    if (mappingUserData.envMap) material.envMap = cubeEnvMap;
  }

  if (json.uuid !== undefined) material.uuid = json.uuid;
  if (json.name !== undefined) material.name = json.name;
  if (json.color !== undefined && material.color !== undefined)
    material.color.setHex(json.color).convertSRGBToLinear();
  if (json.roughness !== undefined)
    material.roughness = parseFloat(json.roughness);
  if (json.metalness !== undefined)
    material.metalness = parseFloat(json.metalness);
  if (json.sheen !== undefined) material.sheen = new Color().setHex(json.sheen);
  if (json.emissive !== undefined && material.emissive !== undefined)
    material.emissive.setHex(json.emissive).convertSRGBToLinear();
  if (json.specular !== undefined && material.specular !== undefined)
    material.specular.setHex(json.specular);
  if (json.shininess !== undefined) material.shininess = json.shininess;
  if (json.clearcoat !== undefined) material.clearcoat = json.clearcoat;
  if (json.clearcoatRoughness !== undefined)
    material.clearcoatRoughness = json.clearcoatRoughness;
  if (json.fog !== undefined) material.fog = json.fog;
  if (json.flatShading !== undefined) material.flatShading = json.flatShading;
  if (json.blending !== undefined) material.blending = json.blending;
  if (json.combine !== undefined) material.combine = json.combine;
  if (json.side !== undefined) material.side = json.side;
  if (json.opacity !== undefined) material.opacity = json.opacity;
  if (json.transparent !== undefined) material.transparent = json.transparent;
  if (json.alphaTest !== undefined) material.alphaTest = json.alphaTest;
  if (json.depthTest !== undefined) material.depthTest = json.depthTest;
  if (json.depthWrite !== undefined) material.depthWrite = json.depthWrite;
  if (json.colorWrite !== undefined) material.colorWrite = json.colorWrite;

  if (json.stencilWrite !== undefined)
    material.stencilWrite = json.stencilWrite;
  if (json.stencilWriteMask !== undefined)
    material.stencilWriteMask = json.stencilWriteMask;
  if (json.stencilFunc !== undefined) material.stencilFunc = json.stencilFunc;
  if (json.stencilRef !== undefined) material.stencilRef = json.stencilRef;
  if (json.stencilFuncMask !== undefined)
    material.stencilFuncMask = json.stencilFuncMask;
  if (json.stencilFail !== undefined) material.stencilFail = json.stencilFail;
  if (json.stencilZFail !== undefined)
    material.stencilZFail = json.stencilZFail;
  if (json.stencilZPass !== undefined)
    material.stencilZPass = json.stencilZPass;

  if (json.wireframe !== undefined) material.wireframe = json.wireframe;
  if (json.wireframeLinewidth !== undefined)
    material.wireframeLinewidth = json.wireframeLinewidth;
  if (json.wireframeLinecap !== undefined)
    material.wireframeLinecap = json.wireframeLinecap;
  if (json.wireframeLinejoin !== undefined)
    material.wireframeLinejoin = json.wireframeLinejoin;

  if (json.rotation !== undefined) material.rotation = json.rotation;

  if (json.linewidth !== 1) material.linewidth = json.linewidth;
  if (json.dashSize !== undefined) material.dashSize = json.dashSize;
  if (json.gapSize !== undefined) material.gapSize = json.gapSize;
  if (json.scale !== undefined) material.scale = json.scale;

  if (json.polygonOffset !== undefined)
    material.polygonOffset = json.polygonOffset;
  if (json.polygonOffsetFactor !== undefined)
    material.polygonOffsetFactor = json.polygonOffsetFactor;
  if (json.polygonOffsetUnits !== undefined)
    material.polygonOffsetUnits = json.polygonOffsetUnits;

  if (json.skinning !== undefined) material.skinning = json.skinning;
  if (json.morphTargets !== undefined)
    material.morphTargets = json.morphTargets;
  if (json.morphNormals !== undefined)
    material.morphNormals = json.morphNormals;
  if (json.dithering !== undefined) material.dithering = json.dithering;

  if (json.vertexTangents !== undefined)
    material.vertexTangents = json.vertexTangents;

  if (json.visible !== undefined) material.visible = json.visible;

  if (json.toneMapped !== undefined) material.toneMapped = json.toneMapped;

  if (json.userData !== undefined || material.userData !== undefined)
    material.userData = { ...json?.userData, ...material?.userData };

  if (json.vertexColors !== undefined) {
    if (typeof json.vertexColors === "number") {
      material.vertexColors = json.vertexColors > 0 ? true : false;
    } else {
      material.vertexColors = json.vertexColors;
    }
  }

  if (json.uniforms !== undefined) {
    for (const name in json.uniforms) {
      const uniform = json.uniforms[name];

      material.uniforms[name] = {};

      switch (uniform.type) {
        case "t":
          material.uniforms[name].value = getTexture(uniform.value);
          break;

        case "c":
          material.uniforms[name].value = new Color().setHex(uniform.value);
          break;

        case "v2":
          material.uniforms[name].value = new Vector2().fromArray(
            uniform.value
          );
          break;

        case "v3":
          material.uniforms[name].value = new Vector3().fromArray(
            uniform.value
          );
          break;

        case "v4":
          material.uniforms[name].value = new Vector4().fromArray(
            uniform.value
          );
          break;

        case "m3":
          material.uniforms[name].value = new Matrix3().fromArray(
            uniform.value
          );
          break;

        case "m4":
          material.uniforms[name].value = new Matrix4().fromArray(
            uniform.value
          );
          break;

        default:
          material.uniforms[name].value = uniform.value;
      }
    }
  }

  if (json.defines !== undefined) material.defines = json.defines;
  if (json.vertexShader !== undefined)
    material.vertexShader = json.vertexShader;
  if (json.fragmentShader !== undefined)
    material.fragmentShader = json.fragmentShader;

  if (json.extensions !== undefined) {
    for (const key in json.extensions) {
      material.extensions[key] = json.extensions[key];
    }
  }

  if (json.shading !== undefined) material.flatShading = json.shading === 1;

  if (json.size !== undefined) material.size = json.size;
  if (json.sizeAttenuation !== undefined)
    material.sizeAttenuation = json.sizeAttenuation;

  if (json.bumpScale !== undefined) material.bumpScale = json.bumpScale;

  if (json.normalMapType !== undefined)
    material.normalMapType = json.normalMapType;
  if (json.normalScale !== undefined) {
    let normalScale = json.normalScale;

    if (Array.isArray(normalScale) === false) {
      normalScale = [normalScale, normalScale];
    }

    material.normalScale = new Vector2().fromArray(normalScale);
  }

  if (json.emissiveIntensity !== undefined)
    material.emissiveIntensity = parseFloat(json.emissiveIntensity);

  if (json.envMapIntensity !== undefined)
    material.envMapIntensity = parseFloat(json.envMapIntensity);

  if (json.reflectivity !== undefined)
    material.reflectivity = json.reflectivity;
  if (json.refractionRatio !== undefined)
    material.refractionRatio = json.refractionRatio;

  if (json.lightMapIntensity !== undefined)
    material.lightMapIntensity = json.lightMapIntensity;

  if (json.aoMapIntensity !== undefined)
    material.aoMapIntensity = json.aoMapIntensity;

  if (json.clearcoatNormalScale !== undefined)
    material.clearcoatNormalScale = new Vector2().fromArray(
      json.clearcoatNormalScale
    );

  if (json.transmission !== undefined)
    material.transmission = json.transmission;

  return material;
};
