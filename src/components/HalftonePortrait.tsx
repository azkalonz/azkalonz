import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";

const MODEL_URL = "/mark-headshot.glb";
const BASE_PARTICLE_COUNT = 50_000;
const DETAIL_PARTICLE_COUNT = 52_000;
const PARTICLE_COUNT = BASE_PARTICLE_COUNT + DETAIL_PARTICLE_COUNT;
const EMITTER_COUNT = 1_400;
const INTRO_HOLD_DURATION = 0.08;
const INTRO_REVEAL_DURATION = 1.65;
const INTRO_START_DEPTH = -1.4;
const INTRO_START_ROTATION = Math.PI;
const INTRO_START_SCALE = 0.82;
const HOVER_EXIT_DELAY = 420;
const SOLID_GLITCH_DURATION = 0.46;
const SOLID_GLITCH_X = [0, -0.055, 0.032, -0.018, 0.046, -0.024, 0.012, 0];
const SOLID_GLITCH_Y = [0, 0.012, -0.008, 0.005, -0.01, 0.006, -0.003, 0];
const SOLID_ENTER_GLITCH_SIGNAL = [0.18, 1, 0.34, 0.9, 0.52, 1, 0.82, 1];
const SOLID_EXIT_GLITCH_SIGNAL = [1, 0.72, 1, 0.48, 0.9, 0.34, 0.58, 0];
const SOLID_ARTIFACT_MIN_DELAY = 520;
const SOLID_ARTIFACT_DELAY_RANGE = 1_200;
const SOLID_ARTIFACT_MIN_DURATION = 0.2;
const SOLID_ARTIFACT_DURATION_RANGE = 0.22;
const PARTICLE_WORK_BUDGET = 8;
const MODEL_LOAD_IDLE_TIMEOUT = 1_200;
const MODEL_HEIGHT = 3.08;
const ROTATION_DURATION = 14;
const ROTATION_SWAY = Math.PI / 12;
const INITIAL_ROTATION = 0;
const PARTICLE_COLOR = new THREE.Color("#dcece7");
const ACCENT_COLOR = new THREE.Color("#60ff9d");
const KEY_LIGHT_COLOR = new THREE.Color("#f4fff9");
const RIM_LIGHT_COLOR = new THREE.Color("#60ff9d");
const KEY_LIGHT_DIRECTION = new THREE.Vector3(-0.44, 0.48, 1).normalize();
const FILL_LIGHT_DIRECTION = new THREE.Vector3(0.56, -0.08, 0.9).normalize();

const vertexShader = `
  attribute vec3 aNormal;
  attribute float aDetail;
  attribute float aSeed;
  attribute float aSize;
  attribute float aFace;
  attribute float aTone;

  uniform vec3 uFillLightDirection;
  uniform vec3 uArtifactCenterA;
  uniform vec3 uArtifactCenterB;
  uniform vec3 uArtifactCenterC;
  uniform vec3 uArtifactRadii;
  uniform vec3 uArtifactWeights;
  uniform vec3 uKeyLightDirection;
  uniform float uHoverReturn;
  uniform float uIntroProgress;
  uniform float uMotion;
  uniform float uParticleOpacity;
  uniform float uPointScale;
  uniform float uTime;

  varying float vAlpha;
  varying float vArtifactMask;
  varying float vDetail;
  varying float vFace;
  varying float vLight;
  varying float vRearVisibility;
  varying float vRim;
  varying float vSideLight;
  varying float vTone;
  varying float vIntroVisibility;

  void main() {
    vec3 positionAnimated = position;
    vIntroVisibility = smoothstep(0.04, 0.88, uIntroProgress);
    float wave =
      sin(uTime * (0.7 + aSeed * 0.65) + aSeed * 19.0 + position.y * 5.5) *
      (0.006 + aSeed * 0.012) *
      uMotion *
      (1.0 - uHoverReturn);
    positionAnimated += aNormal * wave;

    vec4 viewPosition = modelViewMatrix * vec4(positionAnimated, 1.0);
    vec4 clipPosition = projectionMatrix * viewPosition;

    vec3 viewNormal = normalize(normalMatrix * aNormal);
    vec3 viewDirection = normalize(-viewPosition.xyz);
    float keyLight = max(dot(viewNormal, uKeyLightDirection), 0.0);
    float fillLight = max(dot(viewNormal, uFillLightDirection), 0.0);
    float frontalLight =
      max(dot(viewNormal, normalize(vec3(0.0, 0.08, 1.0))), 0.0);
    float overheadLight =
      max(dot(viewNormal, normalize(vec3(-0.18, 0.82, 0.58))), 0.0);
    float fixedPortraitLight =
      max(dot(viewNormal, normalize(vec3(-0.34, 0.32, 0.89))), 0.0);
    float fixedSideLight =
      max(dot(viewNormal, normalize(vec3(-0.9, 0.06, 0.43))), 0.0);
    float facingVisibility =
      smoothstep(-0.3, 0.32, dot(viewNormal, viewDirection));
    float depthVisibility = smoothstep(-0.42, 0.08, position.z);
    float rearVisibility =
      clamp(max(depthVisibility, facingVisibility * 0.72), 0.0, 1.0);
    float edge = 1.0 - max(dot(viewNormal, viewDirection), 0.0);
    float particleLight =
      clamp(
        0.04 +
          fixedPortraitLight * 0.72 +
          fixedSideLight * 0.35 +
          overheadLight * 0.16 +
          keyLight * 0.22 +
          fillLight * 0.08 +
          frontalLight * 0.06,
        0.04,
        1.22
      );
    float lightSize = mix(
      0.74,
      1.22,
      smoothstep(0.12, 1.08, particleLight)
    );
    float featureDetail = smoothstep(0.08, 0.72, aDetail) * aFace;
    float detailSize = mix(1.14, 0.7, featureDetail);
    float toneSize = mix(0.72, 1.42, smoothstep(0.2, 0.95, aTone));
    float seedSize = mix(0.78, 1.28, aSeed * aSeed);
    float depthScale = clamp(5.8 / max(-viewPosition.z, 0.2), 0.6, 1.8);
    gl_PointSize =
      (0.3 + aSize * 1.14) *
      uPointScale *
      depthScale *
      lightSize *
      detailSize *
      toneSize *
      seedSize *
      mix(1.0, 0.9, aFace);
    gl_Position = clipPosition;

    float surfaceAlpha = 0.38 + aTone * 0.5;
    float faceAlpha = 0.88 - aTone * 0.18;
    vAlpha =
      mix(surfaceAlpha, faceAlpha, aFace) *
      mix(0.58, 1.06, smoothstep(0.18, 1.2, particleLight));
    vec3 artifactDistances = vec3(
      distance(position.xy, uArtifactCenterA.xy),
      distance(position.xy, uArtifactCenterB.xy),
      distance(position.xy, uArtifactCenterC.xy)
    );
    vec3 artifactPatches =
      vec3(1.0) -
      smoothstep(uArtifactRadii * 0.38, uArtifactRadii, artifactDistances);
    float artifactBreakupA =
      step(0.32, fract(position.y * 17.0 + aSeed * 7.0)) *
      step(0.18, fract(position.x * 13.0 - aSeed * 5.0));
    float artifactBreakupB =
      step(0.24, fract(position.x * 19.0 + aSeed * 5.0)) *
      step(0.38, fract(position.y * 11.0 - aSeed * 9.0));
    float artifactBreakupC =
      step(0.28, fract((position.x + position.y) * 15.0 + aSeed * 11.0));
    vec3 artifactBreakup = vec3(
      mix(0.28, 1.0, artifactBreakupA),
      mix(0.22, 0.92, artifactBreakupB),
      mix(0.2, 0.84, artifactBreakupC)
    );
    vec3 artifactMasks =
      artifactPatches * artifactBreakup * uArtifactWeights;
    vArtifactMask = max(
      artifactMasks.x,
      max(artifactMasks.y, artifactMasks.z)
    );
    vDetail = aDetail;
    vFace = aFace;
    vLight = particleLight;
    vRearVisibility = rearVisibility;
    vRim = pow(edge, 2.4) * mix(0.2, 1.0, rearVisibility);
    vSideLight = fixedSideLight;
    vTone = aTone;
  }
`;

const emitterVertexShader = `
  attribute vec3 aNormal;
  attribute float aDetail;
  attribute float aSeed;
  attribute float aSize;
  attribute float aSpeed;
  attribute float aFace;
  attribute float aTone;

  uniform vec3 uFillLightDirection;
  uniform vec3 uArtifactCenterA;
  uniform vec3 uArtifactCenterB;
  uniform vec3 uArtifactCenterC;
  uniform vec3 uArtifactRadii;
  uniform vec3 uArtifactWeights;
  uniform vec3 uKeyLightDirection;
  uniform float uHoverReturn;
  uniform float uIntroProgress;
  uniform float uMotion;
  uniform float uParticleOpacity;
  uniform float uPointScale;
  uniform float uTime;

  varying float vAlpha;
  varying float vArtifactMask;
  varying float vDetail;
  varying float vFace;
  varying float vLight;
  varying float vRearVisibility;
  varying float vRim;
  varying float vSideLight;
  varying float vTone;
  varying float vIntroVisibility;

  void main() {
    float life = fract(aSeed + uTime * (0.035 + aSpeed * 0.035) * uMotion);
    float remaining = 1.0 - life;
    float birth = smoothstep(0.0, 0.08, life);
    float emissionStrength = 1.0 - smoothstep(0.0, 1.0, uHoverReturn);
    float travel = pow(life, 0.82) * (0.26 + aSeed * 0.42);
    vec3 tangent = normalize(cross(aNormal, vec3(0.17, 1.0, 0.31)));
    float curl =
      sin(life * 10.0 + aSeed * 31.0) *
      sin(life * 3.14159) *
      (0.035 + aSeed * 0.055);
    vec3 emittedPosition =
      position +
      aNormal * travel +
      tangent * curl +
      vec3(
        sin(life * 8.0 + aSeed * 17.0),
        cos(life * 6.0 + aSeed * 11.0),
        sin(life * 7.0 + aSeed * 23.0)
      ) * 0.018 * remaining;
    emittedPosition = mix(position, emittedPosition, emissionStrength);

    vec3 positionAnimated = mix(
      position,
      emittedPosition,
      smoothstep(0.7, 1.0, uIntroProgress)
    );
    vIntroVisibility = smoothstep(0.16, 0.94, uIntroProgress);

    vec4 viewPosition = modelViewMatrix * vec4(positionAnimated, 1.0);
    vec4 clipPosition = projectionMatrix * viewPosition;

    vec3 viewNormal = normalize(normalMatrix * aNormal);
    vec3 viewDirection = normalize(-viewPosition.xyz);
    float keyLight = max(dot(viewNormal, uKeyLightDirection), 0.0);
    float fillLight = max(dot(viewNormal, uFillLightDirection), 0.0);
    float frontalLight =
      max(dot(viewNormal, normalize(vec3(0.0, 0.08, 1.0))), 0.0);
    float overheadLight =
      max(dot(viewNormal, normalize(vec3(-0.18, 0.82, 0.58))), 0.0);
    float fixedPortraitLight =
      max(dot(viewNormal, normalize(vec3(-0.34, 0.32, 0.89))), 0.0);
    float fixedSideLight =
      max(dot(viewNormal, normalize(vec3(-0.9, 0.06, 0.43))), 0.0);
    float facingVisibility =
      smoothstep(-0.3, 0.32, dot(viewNormal, viewDirection));
    float depthVisibility = smoothstep(-0.42, 0.08, position.z);
    float rearVisibility =
      clamp(max(depthVisibility, facingVisibility * 0.72), 0.0, 1.0);
    float edge = 1.0 - max(dot(viewNormal, viewDirection), 0.0);
    float particleLight =
      clamp(
        0.06 +
          fixedPortraitLight * 0.62 +
          fixedSideLight * 0.3 +
          overheadLight * 0.14 +
          keyLight * 0.18 +
          fillLight * 0.07 +
          frontalLight * 0.05,
        0.06,
        1.16
      );
    float lightSize = mix(
      0.76,
      1.18,
      smoothstep(0.14, 1.04, particleLight)
    );
    float featureDetail = smoothstep(0.08, 0.72, aDetail) * aFace;
    float detailSize = mix(1.12, 0.72, featureDetail);
    float toneSize = mix(0.76, 1.36, smoothstep(0.2, 0.95, aTone));
    float seedSize = mix(0.82, 1.22, aSeed * aSeed);
    float depthScale = clamp(5.8 / max(-viewPosition.z, 0.2), 0.6, 1.8);
    gl_PointSize =
      (0.28 + aSize * 1.2) *
      uPointScale *
      depthScale *
      mix(birth * pow(remaining, 0.72), 1.0, uHoverReturn) *
      lightSize *
      detailSize *
      toneSize *
      seedSize *
      mix(1.0, 0.92, aFace);
    gl_Position = clipPosition;

    vAlpha =
      mix(birth * pow(remaining, 0.62) * 0.86, 0.72, uHoverReturn) *
      mix(0.68, 1.04, smoothstep(0.22, 1.16, particleLight));
    vec3 artifactDistances = vec3(
      distance(position.xy, uArtifactCenterA.xy),
      distance(position.xy, uArtifactCenterB.xy),
      distance(position.xy, uArtifactCenterC.xy)
    );
    vec3 artifactPatches =
      vec3(1.0) -
      smoothstep(uArtifactRadii * 0.38, uArtifactRadii, artifactDistances);
    float artifactBreakupA =
      step(0.32, fract(position.y * 17.0 + aSeed * 7.0)) *
      step(0.18, fract(position.x * 13.0 - aSeed * 5.0));
    float artifactBreakupB =
      step(0.24, fract(position.x * 19.0 + aSeed * 5.0)) *
      step(0.38, fract(position.y * 11.0 - aSeed * 9.0));
    float artifactBreakupC =
      step(0.28, fract((position.x + position.y) * 15.0 + aSeed * 11.0));
    vec3 artifactBreakup = vec3(
      mix(0.28, 1.0, artifactBreakupA),
      mix(0.22, 0.92, artifactBreakupB),
      mix(0.2, 0.84, artifactBreakupC)
    );
    vec3 artifactMasks =
      artifactPatches * artifactBreakup * uArtifactWeights;
    vArtifactMask = max(
      artifactMasks.x,
      max(artifactMasks.y, artifactMasks.z)
    );
    vDetail = aDetail;
    vFace = aFace;
    vLight = particleLight;
    vRearVisibility = rearVisibility;
    vRim = pow(edge, 2.2) * mix(0.2, 1.0, rearVisibility);
    vSideLight = fixedSideLight;
    vTone = min(1.0, aTone + 0.18);
  }
`;

const fragmentShader = `
  uniform vec3 uAccentColor;
  uniform float uArtifactStrength;
  uniform vec3 uColor;
  uniform vec3 uKeyLightColor;
  uniform vec3 uKeyLightDirection;
  uniform float uParticleOpacity;
  uniform vec3 uRimLightColor;

  varying float vAlpha;
  varying float vArtifactMask;
  varying float vDetail;
  varying float vFace;
  varying float vLight;
  varying float vRearVisibility;
  varying float vRim;
  varying float vSideLight;
  varying float vTone;
  varying float vIntroVisibility;

  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float distanceToCenter = length(center);
    float circle = 1.0 - smoothstep(0.36, 0.5, distanceToCenter);

    if (circle <= 0.01) {
      discard;
    }

    vec2 sphereCoord = center * 2.0;
    float sphereZ = sqrt(max(0.0, 1.0 - dot(sphereCoord, sphereCoord)));
    vec3 spriteNormal = normalize(vec3(sphereCoord, sphereZ));
    vec3 spriteLightDirection = normalize(uKeyLightDirection);
    float spriteDiffuse =
      0.78 + max(dot(spriteNormal, spriteLightDirection), 0.0) * 0.22;
    float spriteHighlight =
      pow(max(dot(spriteNormal, spriteLightDirection), 0.0), 12.0) * 0.16;

    vec3 fieldColor = mix(
      uColor,
      uAccentColor,
      smoothstep(0.68, 1.0, vTone) * mix(0.2, 0.05, vFace)
    );
    float portraitLuminance = mix(1.28, 0.2, smoothstep(0.38, 0.96, vTone));
    vec3 portraitColor = uColor * portraitLuminance;
    vec3 color = mix(fieldColor, portraitColor, vFace);
    color = mix(
      color,
      uAccentColor * 1.28,
      uArtifactStrength * vArtifactMask * 0.72
    );
    float featureInk = smoothstep(0.18, 0.72, vDetail) * vFace;
    color = mix(color, uColor * 1.22, featureInk * 0.48);
    float sideGlow = smoothstep(0.24, 0.96, vSideLight);
    color = mix(color, uAccentColor, sideGlow * mix(0.12, 0.2, vFace));
    float surfaceLight = mix(vLight, 0.2 + vLight * 0.9, vFace);
    color *=
      surfaceLight *
      spriteDiffuse;
    color = mix(
      color,
      uKeyLightColor,
      spriteHighlight * smoothstep(0.48, 1.08, vLight)
    );
    color += uRimLightColor * vRim * 0.1;
    color *= mix(0.22, 1.0, vRearVisibility);
    gl_FragColor = vec4(
      color,
      circle *
        vAlpha *
        vIntroVisibility *
        mix(0.45, 1.0, vRearVisibility) *
        mix(1.0, 1.18, featureInk) *
        min(
          1.0,
          uParticleOpacity + uArtifactStrength * vArtifactMask
        )
    );
  }
`;

type TextureReader = {
  detail: (uv: THREE.Vector2) => number;
  luminance: (uv: THREE.Vector2) => number;
};

const EMPTY_TEXTURE_READER: TextureReader = {
  detail: () => 0,
  luminance: () => 0.5,
};

const createTextureReader = (texture?: THREE.Texture | null): TextureReader => {
  const image = texture?.image as CanvasImageSource | undefined;

  if (!image) {
    return EMPTY_TEXTURE_READER;
  }

  const canvas = document.createElement("canvas");
  const sampleSize = 512;
  canvas.width = sampleSize;
  canvas.height = sampleSize;
  const context = canvas.getContext("2d", { willReadFrequently: true });

  if (!context) {
    return EMPTY_TEXTURE_READER;
  }

  try {
    context.drawImage(image, 0, 0, sampleSize, sampleSize);
    const pixels = context.getImageData(0, 0, sampleSize, sampleSize).data;
    const luminanceMap = new Float32Array(sampleSize * sampleSize);

    for (let index = 0; index < luminanceMap.length; index += 1) {
      const offset = index * 4;
      luminanceMap[index] =
        (pixels[offset] * 0.2126 +
          pixels[offset + 1] * 0.7152 +
          pixels[offset + 2] * 0.0722) /
        255;
    }

    const getCoordinates = (uv: THREE.Vector2) => {
      const wrappedU = ((uv.x % 1) + 1) % 1;
      const sourceV = texture?.flipY ? 1 - uv.y : uv.y;
      const wrappedV = ((sourceV % 1) + 1) % 1;
      const x = Math.min(sampleSize - 1, Math.floor(wrappedU * sampleSize));
      const y = Math.min(sampleSize - 1, Math.floor(wrappedV * sampleSize));

      return [x, y] as const;
    };
    const readLuminance = (x: number, y: number) =>
      luminanceMap[
      THREE.MathUtils.clamp(y, 0, sampleSize - 1) * sampleSize +
      THREE.MathUtils.clamp(x, 0, sampleSize - 1)
      ];

    return {
      detail: (uv: THREE.Vector2) => {
        const [x, y] = getCoordinates(uv);
        const horizontal =
          Math.abs(readLuminance(x + 2, y) - readLuminance(x - 2, y)) +
          Math.abs(readLuminance(x + 1, y) - readLuminance(x - 1, y));
        const vertical =
          Math.abs(readLuminance(x, y + 2) - readLuminance(x, y - 2)) +
          Math.abs(readLuminance(x, y + 1) - readLuminance(x, y - 1));

        return THREE.MathUtils.clamp((horizontal + vertical) * 1.8, 0, 1);
      },
      luminance: (uv: THREE.Vector2) => {
        const [x, y] = getCoordinates(uv);
        return readLuminance(x, y);
      },
    };
  } catch {
    return EMPTY_TEXTURE_READER;
  }
};

const createSelectiveRoughnessMap = (
  texture?: THREE.Texture | null,
): THREE.CanvasTexture | null => {
  const image = texture?.image as CanvasImageSource | undefined;

  if (!image || !texture) {
    return null;
  }

  const canvas = document.createElement("canvas");
  const sampleSize = 512;
  canvas.width = sampleSize;
  canvas.height = sampleSize;
  const context = canvas.getContext("2d", { willReadFrequently: true });

  if (!context) {
    return null;
  }

  try {
    context.drawImage(image, 0, 0, sampleSize, sampleSize);
    const imageData = context.getImageData(0, 0, sampleSize, sampleSize);
    const pixels = imageData.data;
    const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

    for (let offset = 0; offset < pixels.length; offset += 4) {
      const red = pixels[offset] / 255;
      const green = pixels[offset + 1] / 255;
      const blue = pixels[offset + 2] / 255;
      const luminance = red * 0.2126 + green * 0.7152 + blue * 0.0722;
      const maximum = Math.max(red, green, blue);
      const minimum = Math.min(red, green, blue);
      const chroma = maximum - minimum;
      const blueBias = Math.max(0, blue - (red + green) * 0.5);
      const darkness = Math.pow(clamp01((0.27 - luminance) / 0.21), 1.35);
      const neutrality = 1 - clamp01((chroma - 0.025) / 0.16);
      const clothingProtection = 1 - clamp01((blueBias - 0.008) / 0.08);
      const glossMask =
        darkness * (0.58 + neutrality * 0.42) * clothingProtection;
      const roughness = Math.round((1 - glossMask * 0.78) * 255);

      pixels[offset] = roughness;
      pixels[offset + 1] = roughness;
      pixels[offset + 2] = roughness;
      pixels[offset + 3] = 255;
    }

    context.putImageData(imageData, 0, 0);
    const roughnessMap = new THREE.CanvasTexture(canvas);
    roughnessMap.name = "hair-eye-selective-roughness";
    roughnessMap.colorSpace = THREE.NoColorSpace;
    roughnessMap.flipY = texture.flipY;
    roughnessMap.channel = texture.channel;
    roughnessMap.wrapS = texture.wrapS;
    roughnessMap.wrapT = texture.wrapT;
    roughnessMap.repeat.copy(texture.repeat);
    roughnessMap.offset.copy(texture.offset);
    roughnessMap.center.copy(texture.center);
    roughnessMap.rotation = texture.rotation;
    roughnessMap.needsUpdate = true;

    return roughnessMap;
  } catch {
    return null;
  }
};

const closeMouthTextureGap = (texture?: THREE.Texture | null) => {
  const image = texture?.image as CanvasImageSource | undefined;

  if (!texture || !image) {
    return;
  }

  const sourceSize = image as {
    height?: number;
    naturalHeight?: number;
    naturalWidth?: number;
    videoHeight?: number;
    videoWidth?: number;
    width?: number;
  };
  const width =
    sourceSize.naturalWidth ?? sourceSize.videoWidth ?? sourceSize.width ?? 0;
  const height =
    sourceSize.naturalHeight ??
    sourceSize.videoHeight ??
    sourceSize.height ??
    0;

  if (!width || !height) {
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");

  if (!context) {
    return;
  }

  context.drawImage(image, 0, 0, width, height);
  const centerX = width * 0.515;
  const centerY = height * 0.29;
  const radiusX = Math.max(4, width * 0.0085);
  const radiusY = Math.max(3, height * 0.0055);
  context.save();
  context.translate(centerX, centerY);
  context.scale(radiusX, radiusY);
  const fill = context.createRadialGradient(0, 0, 0, 0, 0, 1);
  fill.addColorStop(0, "rgba(190, 140, 130, 0.98)");
  fill.addColorStop(0.58, "rgba(190, 140, 130, 0.92)");
  fill.addColorStop(1, "rgba(190, 140, 130, 0)");
  context.fillStyle = fill;
  context.beginPath();
  context.arc(0, 0, 1, 0, Math.PI * 2);
  context.fill();
  context.restore();

  texture.image = canvas;
  texture.needsUpdate = true;
};

const getTriangleCount = (geometry: THREE.BufferGeometry) => {
  const indexCount = geometry.index?.count;
  return indexCount
    ? Math.floor(indexCount / 3)
    : Math.floor((geometry.getAttribute("position")?.count ?? 0) / 3);
};

const getFaceWeight = (position: THREE.Vector3) => {
  const x = (position.x + 0.03) / 0.66;
  const y = (position.y - 0.5) / 0.78;
  const ellipseDistance = Math.sqrt(x * x + y * y);
  const ellipseWeight = THREE.MathUtils.clamp(
    (1.16 - ellipseDistance) / 0.58,
    0,
    1,
  );
  const frontWeight = THREE.MathUtils.clamp((position.z + 0.12) / 0.55, 0, 1);

  return ellipseWeight * frontWeight;
};

const disposeModel = (root: THREE.Object3D) => {
  root.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) {
      return;
    }

    object.geometry.dispose();
    const materials = Array.isArray(object.material)
      ? object.material
      : [object.material];

    materials.forEach((material) => {
      Object.values(material).forEach((value) => {
        if (value instanceof THREE.Texture) {
          value.dispose();
        }
      });
      material.dispose();
    });
  });
};

const HalftonePortrait = () => {
  const portraitRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasError, setHasError] = useState(false);
  const [isSubjectHovered, setIsSubjectHovered] = useState(false);
  const [isTouchPreviewVisible, setIsTouchPreviewVisible] = useState(false);
  const isSolidVisible = isSubjectHovered || isTouchPreviewVisible;

  useEffect(() => {
    const portrait = portraitRef.current;
    const canvas = canvasRef.current;

    if (!portrait || !canvas) {
      return;
    }

    let disposed = false;
    let animationFrame = 0;
    let animationStartTimestamp = 0;
    let introStartTimestamp = 0;
    let isIntroSettled = false;
    let lastTimestamp = 0;
    let isVisible = true;
    let isSubjectHovering = false;
    let isTouchPreviewing = false;
    let hoverExitTimer = 0;
    let hoverProgress = 0;
    let solidProgress = 0;
    let solidGlitchStartedAt = 0;
    let isExitGlitch = false;
    let wasShowingSolid = false;
    let nextSolidArtifactAt = Number.POSITIVE_INFINITY;
    let solidArtifactStartedAt = 0;
    let solidArtifactDuration = SOLID_ARTIFACT_MIN_DURATION;
    let cursorArtifactEnergy = 0;
    let lastPointerTimestamp = 0;
    let lastPointerX = 0;
    let lastPointerY = 0;
    let touchStartX = Number.NaN;
    let touchStartY = Number.NaN;
    let modelLoadIdleCallback = 0;
    let modelLoadTimer = 0;
    let swivelElapsed = 0;
    const keyLightDirection = KEY_LIGHT_DIRECTION.clone();
    const fillLightDirection = FILL_LIGHT_DIRECTION.clone();
    const targetKeyLightDirection = KEY_LIGHT_DIRECTION.clone();
    const targetFillLightDirection = FILL_LIGHT_DIRECTION.clone();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    isIntroSettled = reducedMotion.matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0.1, 5.8);
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      canvas,
      powerPreference: "high-performance",
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.64;
    renderer.setClearColor(0x000000, 0);
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    const ambientLight = new THREE.AmbientLight(0xe8f0eb, 0.3);
    const hemisphereLight = new THREE.HemisphereLight(0xe7f0eb, 0x06100c, 1);
    const solidKeyLight = new THREE.DirectionalLight(0xfff3e6, 2.6);
    const solidFillLight = new THREE.DirectionalLight(0x9effbf, 0.25);
    const solidFrontLight = new THREE.DirectionalLight(0xffead7, 0.7);
    const solidTopLight = new THREE.DirectionalLight(0xdcffe8, 0.35);
    const solidGreenRimLeft = new THREE.DirectionalLight(0x60ff9d, 0.56);
    const solidGreenRimRight = new THREE.DirectionalLight(0x2adf79, 0.28);
    solidFrontLight.position.set(0.2, 0.35, 5);
    solidTopLight.position.set(0, 5, 1.8);
    solidGreenRimLeft.position.set(-4, 0.9, 2.4);
    solidGreenRimRight.position.set(4, -0.2, 1.8);
    scene.add(
      ambientLight,
      hemisphereLight,
      solidKeyLight,
      solidFillLight,
      solidFrontLight,
      solidTopLight,
      solidGreenRimLeft,
      solidGreenRimRight,
    );

    const commonUniforms = {
      uAccentColor: { value: ACCENT_COLOR },
      uArtifactCenterA: { value: new THREE.Vector3(0, 0, 0) },
      uArtifactCenterB: { value: new THREE.Vector3(0, 0, 0) },
      uArtifactCenterC: { value: new THREE.Vector3(0, 0, 0) },
      uArtifactRadii: { value: new THREE.Vector3(0.42, 0.32, 0.24) },
      uArtifactStrength: { value: 0 },
      uArtifactWeights: { value: new THREE.Vector3(1, 0.72, 0) },
      uColor: { value: PARTICLE_COLOR },
      uFillLightDirection: { value: fillLightDirection },
      uHoverReturn: { value: 0 },
      uIntroProgress: { value: reducedMotion.matches ? 1 : 0 },
      uKeyLightColor: { value: KEY_LIGHT_COLOR },
      uKeyLightDirection: { value: keyLightDirection },
      uMotion: { value: reducedMotion.matches ? 0 : 1 },
      uParticleOpacity: { value: 1 },
      uPointScale: { value: 1 },
      uRimLightColor: { value: RIM_LIGHT_COLOR },
      uTime: { value: 0 },
    };
    const pointMaterial = new THREE.ShaderMaterial({
      alphaTest: 0.02,
      depthTest: true,
      depthWrite: true,
      fragmentShader,
      transparent: true,
      uniforms: commonUniforms,
      vertexShader,
    });
    const emitterMaterial = new THREE.ShaderMaterial({
      alphaTest: 0.02,
      blending: THREE.AdditiveBlending,
      depthTest: true,
      depthWrite: false,
      fragmentShader,
      transparent: true,
      uniforms: commonUniforms,
      vertexShader: emitterVertexShader,
    });
    let pointGeometry: THREE.BufferGeometry | undefined;
    let emitterGeometry: THREE.BufferGeometry | undefined;
    let pointCloud: THREE.Points | undefined;
    let emitterCloud: THREE.Points | undefined;
    let solidRoot: THREE.Group | undefined;
    let solidMaterials: THREE.MeshStandardMaterial[] = [];
    const solidEmissiveIntensities = new Map<
      THREE.MeshStandardMaterial,
      number
    >();
    const hoverTarget =
      portrait.closest<HTMLElement>(".matrix-portrait") ?? portrait;

    const setSubjectHover = (isHovered: boolean) => {
      if (isHovered && !isIntroSettled) {
        return;
      }

      if (isHovered) {
        if (hoverExitTimer) {
          window.clearTimeout(hoverExitTimer);
          hoverExitTimer = 0;
        }

        if (isSubjectHovering) {
          return;
        }

        isSubjectHovering = true;
        setIsSubjectHovered(true);
        requestAnimation();
        return;
      }

      if (!isSubjectHovering || hoverExitTimer) {
        return;
      }

      hoverExitTimer = window.setTimeout(() => {
        hoverExitTimer = 0;
        isSubjectHovering = false;
        setIsSubjectHovered(false);
        requestAnimation();
      }, HOVER_EXIT_DELAY);
    };

    const resize = () => {
      const rect = portrait.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);

      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      commonUniforms.uPointScale.value =
        pixelRatio * Math.max(0.82, Math.min(1.25, height / 700));
    };

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    const loadModel = () => {
      if (disposed) {
        return;
      }

      loader.load(
        MODEL_URL,
        async (gltf) => {
          if (disposed) {
            disposeModel(gltf.scene);
            return;
          }

          const sourceModel = gltf.scene;
          const sourceBounds = new THREE.Box3().setFromObject(sourceModel);
          const center = sourceBounds.getCenter(new THREE.Vector3());
          const size = sourceBounds.getSize(new THREE.Vector3());
          const normalizationScale = MODEL_HEIGHT / Math.max(size.y, 0.001);
          const normalizedRoot = new THREE.Group();
          normalizedRoot.scale.setScalar(normalizationScale);
          normalizedRoot.position
            .copy(center)
            .multiplyScalar(-normalizationScale);
          normalizedRoot.add(sourceModel);
          normalizedRoot.updateMatrixWorld(true);
          let workSliceStartedAt = performance.now();
          const yieldIfNeeded = async (force = false) => {
            if (
              !force &&
              performance.now() - workSliceStartedAt < PARTICLE_WORK_BUDGET
            ) {
              return disposed;
            }

            await new Promise<void>((resolve) => {
              window.requestAnimationFrame(() => resolve());
            });
            workSliceStartedAt = performance.now();

            return disposed;
          };

          const meshes: THREE.Mesh[] = [];
          normalizedRoot.traverse((object) => {
            if (
              object instanceof THREE.Mesh &&
              getTriangleCount(object.geometry)
            ) {
              meshes.push(object);
            }
          });

          const totalTriangles = meshes.reduce(
            (sum, mesh) => sum + getTriangleCount(mesh.geometry),
            0,
          );
          const positions = new Float32Array(PARTICLE_COUNT * 3);
          const normals = new Int16Array(PARTICLE_COUNT * 3);
          const details = new Uint8Array(PARTICLE_COUNT);
          const seeds = new Uint8Array(PARTICLE_COUNT);
          const sizes = new Float32Array(PARTICLE_COUNT);
          const faceWeights = new Uint8Array(PARTICLE_COUNT);
          const tones = new Uint8Array(PARTICLE_COUNT);
          const samplePosition = new THREE.Vector3();
          const sampleNormal = new THREE.Vector3();
          const sampleUv = new THREE.Vector2();
          const samplingContexts: Array<{
            matrixWorld: THREE.Matrix4;
            normalMatrix: THREE.Matrix3;
            sampler: MeshSurfaceSampler;
            textureReader: TextureReader;
          }> = [];
          let cursor = 0;

          const sampleFromContext = (
            context: (typeof samplingContexts)[number],
          ) => {
            context.sampler.sample(
              samplePosition,
              sampleNormal,
              undefined,
              sampleUv,
            );
            samplePosition.applyMatrix4(context.matrixWorld);
            sampleNormal.applyNormalMatrix(context.normalMatrix).normalize();
          };

          const storeParticle = (
            textureReader: TextureReader,
            importanceSample = false,
          ) => {
            const faceWeight = getFaceWeight(samplePosition);
            const luminance = textureReader.luminance(sampleUv);
            const textureDetail = textureReader.detail(sampleUv);
            const darkness = 1 - luminance;
            const detailImportance = THREE.MathUtils.clamp(
              0.05 +
              darkness * 0.16 +
              faceWeight * 0.24 +
              textureDetail * (0.35 + faceWeight * 1.65),
              0.05,
              1,
            );

            if (importanceSample && Math.random() > detailImportance) {
              return false;
            }

            const offset = cursor * 3;
            const seed = Math.random();

            positions[offset] = samplePosition.x;
            positions[offset + 1] = samplePosition.y;
            positions[offset + 2] = samplePosition.z;
            normals[offset] = Math.round(sampleNormal.x * 32_767);
            normals[offset + 1] = Math.round(sampleNormal.y * 32_767);
            normals[offset + 2] = Math.round(sampleNormal.z * 32_767);
            details[cursor] = Math.round(textureDetail * 255);
            seeds[cursor] = Math.round(seed * 255);
            faceWeights[cursor] = Math.round(faceWeight * 255);
            tones[cursor] = Math.round(
              THREE.MathUtils.clamp(0.16 + darkness * 0.92, 0.16, 1) * 255,
            );
            sizes[cursor] = THREE.MathUtils.clamp(
              (0.18 + darkness * 1.55 + Math.pow(seed, 2) * 0.58) *
              THREE.MathUtils.lerp(1.18, 0.72, textureDetail * faceWeight),
              0.16,
              2.35,
            );
            cursor += 1;

            return true;
          };

          for (let meshIndex = 0; meshIndex < meshes.length; meshIndex += 1) {
            const mesh = meshes[meshIndex];

            if (await yieldIfNeeded(true)) {
              disposeModel(normalizedRoot);
              return;
            }

            const triangleShare =
              getTriangleCount(mesh.geometry) / Math.max(totalTriangles, 1);
            const remaining = BASE_PARTICLE_COUNT - cursor;
            const meshParticleCount =
              meshIndex === meshes.length - 1
                ? remaining
                : Math.min(
                  remaining,
                  Math.round(BASE_PARTICLE_COUNT * triangleShare),
                );
            const sampler = new MeshSurfaceSampler(mesh).build();
            const normalMatrix = new THREE.Matrix3().getNormalMatrix(
              mesh.matrixWorld,
            );
            const material = Array.isArray(mesh.material)
              ? mesh.material[0]
              : mesh.material;
            const textureReader = createTextureReader(
              material instanceof THREE.MeshStandardMaterial
                ? material.map
                : undefined,
            );
            const samplingContext = {
              matrixWorld: mesh.matrixWorld,
              normalMatrix,
              sampler,
              textureReader,
            };
            samplingContexts.push(samplingContext);

            for (
              let meshParticle = 0;
              meshParticle < meshParticleCount;
              meshParticle += 1
            ) {
              sampleFromContext(samplingContext);
              storeParticle(textureReader);

              if (meshParticle % 512 === 0 && (await yieldIfNeeded())) {
                disposeModel(normalizedRoot);
                return;
              }
            }
          }

          let detailSampleAttempts = 0;
          const maximumDetailSampleAttempts = DETAIL_PARTICLE_COUNT * 24;

          while (
            cursor < PARTICLE_COUNT &&
            detailSampleAttempts < maximumDetailSampleAttempts
          ) {
            const context =
              samplingContexts[
              Math.floor(Math.random() * samplingContexts.length)
              ];
            sampleFromContext(context);
            storeParticle(context.textureReader, true);
            detailSampleAttempts += 1;

            if (detailSampleAttempts % 512 === 0 && (await yieldIfNeeded())) {
              disposeModel(normalizedRoot);
              return;
            }
          }

          while (cursor < PARTICLE_COUNT) {
            const context =
              samplingContexts[
              Math.floor(Math.random() * samplingContexts.length)
              ];
            sampleFromContext(context);
            storeParticle(context.textureReader);

            if (cursor % 512 === 0 && (await yieldIfNeeded())) {
              disposeModel(normalizedRoot);
              return;
            }
          }

          pointGeometry = new THREE.BufferGeometry();
          pointGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(positions, 3),
          );
          pointGeometry.setAttribute(
            "aNormal",
            new THREE.BufferAttribute(normals, 3, true),
          );
          pointGeometry.setAttribute(
            "aDetail",
            new THREE.BufferAttribute(details, 1, true),
          );
          pointGeometry.setAttribute(
            "aSeed",
            new THREE.BufferAttribute(seeds, 1, true),
          );
          pointGeometry.setAttribute(
            "aSize",
            new THREE.BufferAttribute(sizes, 1),
          );
          pointGeometry.setAttribute(
            "aFace",
            new THREE.BufferAttribute(faceWeights, 1, true),
          );
          pointGeometry.setAttribute(
            "aTone",
            new THREE.BufferAttribute(tones, 1, true),
          );
          pointGeometry.computeBoundingSphere();
          pointCloud = new THREE.Points(pointGeometry, pointMaterial);
          pointCloud.renderOrder = 2;
          modelGroup.add(pointCloud);

          const emitterPositions = new Float32Array(EMITTER_COUNT * 3);
          const emitterNormals = new Int16Array(EMITTER_COUNT * 3);
          const emitterDetails = new Uint8Array(EMITTER_COUNT);
          const emitterSeeds = new Uint8Array(EMITTER_COUNT);
          const emitterSizes = new Float32Array(EMITTER_COUNT);
          const emitterSpeeds = new Float32Array(EMITTER_COUNT);
          const emitterFaceWeights = new Uint8Array(EMITTER_COUNT);
          const emitterTones = new Uint8Array(EMITTER_COUNT);

          for (let index = 0; index < EMITTER_COUNT; index += 1) {
            const sourceIndex = Math.floor(Math.random() * BASE_PARTICLE_COUNT);
            const sourceOffset = sourceIndex * 3;
            const targetOffset = index * 3;

            emitterPositions[targetOffset] = positions[sourceOffset];
            emitterPositions[targetOffset + 1] = positions[sourceOffset + 1];
            emitterPositions[targetOffset + 2] = positions[sourceOffset + 2];
            emitterNormals[targetOffset] = normals[sourceOffset];
            emitterNormals[targetOffset + 1] = normals[sourceOffset + 1];
            emitterNormals[targetOffset + 2] = normals[sourceOffset + 2];
            emitterDetails[index] = details[sourceIndex];
            emitterSeeds[index] = Math.round(Math.random() * 255);
            emitterSizes[index] = THREE.MathUtils.clamp(
              sizes[sourceIndex] * (0.78 + Math.random() * 0.52),
              0.18,
              2.5,
            );
            emitterSpeeds[index] = 0.4 + Math.random() * 0.9;
            emitterFaceWeights[index] = faceWeights[sourceIndex];
            emitterTones[index] = tones[sourceIndex];

            if (index % 512 === 0 && (await yieldIfNeeded())) {
              disposeModel(normalizedRoot);
              return;
            }
          }

          emitterGeometry = new THREE.BufferGeometry();
          emitterGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(emitterPositions, 3),
          );
          emitterGeometry.setAttribute(
            "aNormal",
            new THREE.BufferAttribute(emitterNormals, 3, true),
          );
          emitterGeometry.setAttribute(
            "aDetail",
            new THREE.BufferAttribute(emitterDetails, 1, true),
          );
          emitterGeometry.setAttribute(
            "aSeed",
            new THREE.BufferAttribute(emitterSeeds, 1, true),
          );
          emitterGeometry.setAttribute(
            "aSize",
            new THREE.BufferAttribute(emitterSizes, 1),
          );
          emitterGeometry.setAttribute(
            "aSpeed",
            new THREE.BufferAttribute(emitterSpeeds, 1),
          );
          emitterGeometry.setAttribute(
            "aFace",
            new THREE.BufferAttribute(emitterFaceWeights, 1, true),
          );
          emitterGeometry.setAttribute(
            "aTone",
            new THREE.BufferAttribute(emitterTones, 1, true),
          );
          emitterGeometry.computeBoundingSphere();
          emitterCloud = new THREE.Points(emitterGeometry, emitterMaterial);
          emitterCloud.renderOrder = 3;
          modelGroup.add(emitterCloud);

          solidMaterials = meshes.flatMap((mesh) => {
            mesh.renderOrder = 1;
            const materials = Array.isArray(mesh.material)
              ? mesh.material
              : [mesh.material];

            return materials.filter(
              (material): material is THREE.MeshStandardMaterial =>
                material instanceof THREE.MeshStandardMaterial,
            );
          });

          if (await yieldIfNeeded(true)) {
            disposeModel(normalizedRoot);
            return;
          }

          solidMaterials.forEach((material) => {
            material.transparent = true;
            material.opacity = 0;
            material.depthWrite = false;
            material.color.setScalar(0.86);
            material.metalness = 0;
            material.metalnessMap = null;
            material.roughness = THREE.MathUtils.clamp(
              material.roughness,
              0.96,
              1,
            );
            material.roughnessMap = createSelectiveRoughnessMap(material.map);
            closeMouthTextureGap(material.map);
            material.envMapIntensity = 0.05;
            material.normalScale.multiplyScalar(0.7);

            if (material instanceof THREE.MeshPhysicalMaterial) {
              material.clearcoat = 0;
              material.clearcoatRoughness = 1;
              material.specularIntensity = 0.68;
            }

            material.emissive.set(0x2b6b45);
            material.emissiveMap = material.map;
            const emissiveIntensity = material.map ? 0.04 : 0.01;
            material.emissiveIntensity = emissiveIntensity;
            solidEmissiveIntensities.set(material, emissiveIntensity);
            material.needsUpdate = true;
          });
          solidRoot = normalizedRoot;
          solidRoot.visible = true;
          modelGroup.add(solidRoot);
          requestAnimation();
        },
        undefined,
        (error) => {
          if (!disposed) {
            console.error(error);
            setHasError(true);
          }
        },
      );
    };

    const requestIdleCallback = (
      window as Window & {
        requestIdleCallback?: Window["requestIdleCallback"];
      }
    ).requestIdleCallback;

    if (requestIdleCallback) {
      modelLoadIdleCallback = requestIdleCallback(loadModel, {
        timeout: MODEL_LOAD_IDLE_TIMEOUT,
      });
    } else {
      modelLoadTimer = window.setTimeout(loadModel, 180);
    }

    const animate = (timestamp: number) => {
      animationFrame = 0;

      if (!isVisible || disposed) {
        return;
      }

      const delta = lastTimestamp
        ? Math.min((timestamp - lastTimestamp) / 1000, 0.05)
        : 0;
      lastTimestamp = timestamp;
      animationStartTimestamp ||= timestamp;
      const elapsed = (timestamp - animationStartTimestamp) / 1000;
      if (pointCloud && !introStartTimestamp) {
        introStartTimestamp = timestamp;
      }
      const introElapsed = introStartTimestamp
        ? (timestamp - introStartTimestamp) / 1000
        : 0;
      const introProgress = reducedMotion.matches
        ? 1
        : THREE.MathUtils.clamp(
          (introElapsed - INTRO_HOLD_DURATION) / INTRO_REVEAL_DURATION,
          0,
          1,
        );
      const introEase =
        introProgress * introProgress * (3 - 2 * introProgress);
      commonUniforms.uIntroProgress.value = introProgress;
      if (!isIntroSettled && introProgress >= 1) {
        isIntroSettled = true;

        if (
          hoverTarget.matches(":hover") ||
          hoverTarget.contains(document.activeElement)
        ) {
          setSubjectHover(true);
        }
      }
      const lightResponse = delta ? 1 - Math.exp(-10 * delta) : 1;
      const hoverResponse = reducedMotion.matches
        ? 1
        : delta
          ? 1 - Math.exp(-5.2 * delta)
          : 1;
      const solidResponse = reducedMotion.matches
        ? 1
        : delta
          ? 1 - Math.exp(-7.5 * delta)
          : 1;
      keyLightDirection
        .lerp(targetKeyLightDirection, lightResponse)
        .normalize();
      fillLightDirection
        .lerp(targetFillLightDirection, lightResponse)
        .normalize();
      hoverProgress = THREE.MathUtils.lerp(
        hoverProgress,
        isSubjectHovering ? 1 : 0,
        hoverResponse,
      );
      const shouldShowSolid = isSubjectHovering || isTouchPreviewing;
      if (shouldShowSolid && !wasShowingSolid && !reducedMotion.matches) {
        solidGlitchStartedAt = timestamp;
        isExitGlitch = false;
        nextSolidArtifactAt =
          timestamp +
          SOLID_GLITCH_DURATION * 1000 +
          SOLID_ARTIFACT_MIN_DELAY +
          Math.random() * SOLID_ARTIFACT_DELAY_RANGE;
      } else if (!shouldShowSolid) {
        if (wasShowingSolid && !reducedMotion.matches) {
          solidGlitchStartedAt = timestamp;
          isExitGlitch = true;
        }
        solidArtifactStartedAt = 0;
        cursorArtifactEnergy = 0;
        nextSolidArtifactAt = Number.POSITIVE_INFINITY;
      }
      wasShowingSolid = shouldShowSolid;
      const solidGlitchProgress = solidGlitchStartedAt
        ? THREE.MathUtils.clamp(
          (timestamp - solidGlitchStartedAt) / (SOLID_GLITCH_DURATION * 1000),
          0,
          1,
        )
        : 1;
      const isSolidGlitching =
        solidGlitchProgress < 1 && !reducedMotion.matches;
      const isSolidExitGlitching = isSolidGlitching && isExitGlitch;
      solidProgress = THREE.MathUtils.lerp(
        solidProgress,
        shouldShowSolid || isSolidExitGlitching ? 1 : 0,
        solidResponse,
      );

      if (isExitGlitch && solidGlitchStartedAt && solidGlitchProgress >= 1) {
        solidProgress = 0;
        solidGlitchStartedAt = 0;
        isExitGlitch = false;
      }
      const glitchStep = Math.min(
        SOLID_GLITCH_X.length - 1,
        Math.floor(solidGlitchProgress * SOLID_GLITCH_X.length),
      );
      const glitchSignal = isSolidGlitching
        ? isExitGlitch
          ? SOLID_EXIT_GLITCH_SIGNAL[glitchStep]
          : SOLID_ENTER_GLITCH_SIGNAL[glitchStep]
        : 1;
      const visibleSolidProgress = solidProgress * glitchSignal;
      const glitchFlash = isSolidGlitching
        ? (1 - solidGlitchProgress) * (glitchStep % 2 === 0 ? 0.32 : 0.12)
        : 0;
      if (
        shouldShowSolid &&
        !isSolidGlitching &&
        visibleSolidProgress > 0.98 &&
        timestamp >= nextSolidArtifactAt
      ) {
        solidArtifactStartedAt = timestamp;
        solidArtifactDuration =
          SOLID_ARTIFACT_MIN_DURATION +
          Math.random() * SOLID_ARTIFACT_DURATION_RANGE;
        commonUniforms.uArtifactCenterA.value.set(
          THREE.MathUtils.randFloat(-0.62, 0.62),
          THREE.MathUtils.randFloat(-1.18, 1.18),
          0,
        );
        commonUniforms.uArtifactCenterB.value.set(
          THREE.MathUtils.randFloat(-0.62, 0.62),
          THREE.MathUtils.randFloat(-1.18, 1.18),
          0,
        );
        commonUniforms.uArtifactCenterC.value.set(
          THREE.MathUtils.randFloat(-0.62, 0.62),
          THREE.MathUtils.randFloat(-1.18, 1.18),
          0,
        );
        commonUniforms.uArtifactRadii.value.set(
          THREE.MathUtils.randFloat(0.27, 0.5),
          THREE.MathUtils.randFloat(0.2, 0.4),
          THREE.MathUtils.randFloat(0.16, 0.32),
        );
        commonUniforms.uArtifactWeights.value.set(
          1,
          THREE.MathUtils.randFloat(0.58, 0.86),
          Math.random() > 0.28 ? THREE.MathUtils.randFloat(0.38, 0.68) : 0,
        );
        nextSolidArtifactAt =
          timestamp +
          solidArtifactDuration * 1000 +
          SOLID_ARTIFACT_MIN_DELAY +
          Math.random() * SOLID_ARTIFACT_DELAY_RANGE;
      }
      const solidArtifactProgress = solidArtifactStartedAt
        ? (timestamp - solidArtifactStartedAt) / (solidArtifactDuration * 1000)
        : 1;
      const randomArtifactStrength =
        shouldShowSolid && solidArtifactProgress < 1 && !reducedMotion.matches
          ? Math.sin(solidArtifactProgress * Math.PI) *
          (Math.floor(solidArtifactProgress * 7) % 2 === 0 ? 0.48 : 0.24)
          : 0;
      cursorArtifactEnergy *= delta ? Math.exp(-6.4 * delta) : 1;
      const solidArtifactStrength = Math.max(
        randomArtifactStrength,
        shouldShowSolid && !isSolidGlitching && !reducedMotion.matches
          ? cursorArtifactEnergy
          : 0,
      );
      commonUniforms.uTime.value = elapsed;
      commonUniforms.uArtifactStrength.value = solidArtifactStrength;
      commonUniforms.uHoverReturn.value = hoverProgress;
      commonUniforms.uParticleOpacity.value = 1 - visibleSolidProgress;
      solidKeyLight.position.copy(keyLightDirection).multiplyScalar(5);
      solidFillLight.position.copy(fillLightDirection).multiplyScalar(4);

      if (solidRoot) {
        solidMaterials.forEach((material) => {
          material.opacity = visibleSolidProgress;
          material.depthWrite = visibleSolidProgress > 0.55;
          material.emissiveIntensity =
            (solidEmissiveIntensities.get(material) ?? 0) + glitchFlash;
        });
      }

      if (pointCloud) {
        pointCloud.visible =
          visibleSolidProgress < 0.998 || solidArtifactStrength > 0.001;
      }

      if (emitterCloud) {
        emitterCloud.visible = visibleSolidProgress < 0.98;
      }

      let swivelRotation = 0;
      if (!reducedMotion.matches) {
        swivelElapsed += delta;
        swivelRotation =
          Math.sin((swivelElapsed / ROTATION_DURATION) * Math.PI * 2) *
          ROTATION_SWAY;
      }
      modelGroup.rotation.y =
        INITIAL_ROTATION +
        (1 - introEase) * INTRO_START_ROTATION +
        swivelRotation * introEase;
      modelGroup.position.set(
        isSolidGlitching ? SOLID_GLITCH_X[glitchStep] : 0,
        isSolidGlitching ? SOLID_GLITCH_Y[glitchStep] : 0,
        THREE.MathUtils.lerp(INTRO_START_DEPTH, 0, introEase),
      );
      modelGroup.scale.setScalar(
        THREE.MathUtils.lerp(INTRO_START_SCALE, 1, introEase),
      );
      modelGroup.rotation.z = isSolidGlitching
        ? SOLID_GLITCH_X[glitchStep] * -0.08
        : 0;

      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(animate);
    };

    const requestAnimation = () => {
      if (!animationFrame && isVisible) {
        animationFrame = window.requestAnimationFrame(animate);
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        return;
      }

      const x = (event.clientX / Math.max(window.innerWidth, 1)) * 2 - 1;
      const y = 1 - (event.clientY / Math.max(window.innerHeight, 1)) * 2;
      targetKeyLightDirection.set(x * 0.88, y * 0.72, 1).normalize();
      targetFillLightDirection.set(-x * 0.34, -y * 0.26, 0.92).normalize();

      const pointerDelta = lastPointerTimestamp
        ? Math.max(event.timeStamp - lastPointerTimestamp, 8)
        : 0;
      const pointerSpeed = pointerDelta
        ? Math.hypot(
          event.clientX - lastPointerX,
          event.clientY - lastPointerY,
        ) / pointerDelta
        : 0;
      lastPointerTimestamp = event.timeStamp;
      lastPointerX = event.clientX;
      lastPointerY = event.clientY;

      const hoverRect = hoverTarget.getBoundingClientRect();
      const isInsideHoverTarget =
        event.clientX >= hoverRect.left &&
        event.clientX <= hoverRect.right &&
        event.clientY >= hoverRect.top &&
        event.clientY <= hoverRect.bottom;

      if (
        isInsideHoverTarget &&
        pointerSpeed > 0.08 &&
        !reducedMotion.matches
      ) {
        const pointerX = THREE.MathUtils.clamp(
          ((event.clientX - hoverRect.left) / Math.max(hoverRect.width, 1) -
            0.5) *
          1.45,
          -0.68,
          0.68,
        );
        const pointerY = THREE.MathUtils.clamp(
          (0.5 -
            (event.clientY - hoverRect.top) / Math.max(hoverRect.height, 1)) *
          2.7,
          -1.2,
          1.2,
        );
        const pointerPhase = event.timeStamp * 0.012;
        const movementStrength = THREE.MathUtils.clamp(
          (pointerSpeed - 0.08) * 0.42,
          0,
          0.62,
        );
        cursorArtifactEnergy = Math.max(cursorArtifactEnergy, movementStrength);
        commonUniforms.uArtifactCenterA.value.set(pointerX, pointerY, 0);
        commonUniforms.uArtifactCenterB.value.set(
          THREE.MathUtils.clamp(
            pointerX + Math.sin(pointerPhase) * 0.28,
            -0.68,
            0.68,
          ),
          THREE.MathUtils.clamp(
            pointerY + Math.cos(pointerPhase * 0.83) * 0.36,
            -1.2,
            1.2,
          ),
          0,
        );
        commonUniforms.uArtifactCenterC.value.set(
          THREE.MathUtils.clamp(
            pointerX - Math.cos(pointerPhase * 0.71) * 0.22,
            -0.68,
            0.68,
          ),
          THREE.MathUtils.clamp(
            pointerY - Math.sin(pointerPhase * 0.91) * 0.3,
            -1.2,
            1.2,
          ),
          0,
        );
        commonUniforms.uArtifactRadii.value.set(0.26, 0.2, 0.15);
        commonUniforms.uArtifactWeights.value.set(1, 0.68, 0.46);
      }
      requestAnimation();
    };

    const handlePortraitPointerEnter = (event: PointerEvent) => {
      if (event.pointerType !== "touch") {
        setSubjectHover(true);
      }
    };

    const handlePortraitPointerLeave = () => {
      setSubjectHover(false);
    };

    const handlePortraitPointerDown = (event: PointerEvent) => {
      if (
        event.pointerType !== "touch" ||
        (event.target as Element | null)?.closest(
          ".matrix-portrait__mobile-link",
        )
      ) {
        return;
      }

      touchStartX = event.clientX;
      touchStartY = event.clientY;
    };

    const handlePortraitPointerUp = (event: PointerEvent) => {
      const isMobileLink = (event.target as Element | null)?.closest(
        ".matrix-portrait__mobile-link",
      );
      const isTap =
        event.pointerType === "touch" &&
        Number.isFinite(touchStartX) &&
        Math.hypot(event.clientX - touchStartX, event.clientY - touchStartY) <
        12;
      touchStartX = Number.NaN;
      touchStartY = Number.NaN;

      if (!isTap || isMobileLink || !isIntroSettled) {
        return;
      }

      isTouchPreviewing = !isTouchPreviewing;
      setIsTouchPreviewVisible(isTouchPreviewing);
      requestAnimation();
    };

    const handlePortraitPointerCancel = () => {
      touchStartX = Number.NaN;
      touchStartY = Number.NaN;
    };

    const handlePortraitFocus = () => {
      setSubjectHover(true);
    };

    const handlePortraitBlur = () => {
      setSubjectHover(false);
    };

    const handleMotionPreference = () => {
      commonUniforms.uMotion.value = reducedMotion.matches ? 0 : 1;
      commonUniforms.uIntroProgress.value = reducedMotion.matches
        ? 1
        : commonUniforms.uIntroProgress.value;

      if (reducedMotion.matches) {
        isIntroSettled = true;
        modelGroup.rotation.y = INITIAL_ROTATION;
      } else if (!introStartTimestamp) {
        isIntroSettled = false;
      }

      requestAnimation();
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      requestAnimation();
    });
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;

      if (isVisible) {
        lastTimestamp = 0;
        requestAnimation();
      } else if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
    });

    resizeObserver.observe(portrait);
    intersectionObserver.observe(portrait);
    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });
    hoverTarget.addEventListener("pointerenter", handlePortraitPointerEnter, {
      passive: true,
    });
    hoverTarget.addEventListener("pointerleave", handlePortraitPointerLeave);
    hoverTarget.addEventListener("pointerdown", handlePortraitPointerDown);
    hoverTarget.addEventListener("pointerup", handlePortraitPointerUp);
    hoverTarget.addEventListener("pointercancel", handlePortraitPointerCancel);
    hoverTarget.addEventListener("focusin", handlePortraitFocus);
    hoverTarget.addEventListener("focusout", handlePortraitBlur);
    reducedMotion.addEventListener("change", handleMotionPreference);
    resize();
    requestAnimation();

    return () => {
      disposed = true;

      if (modelLoadIdleCallback) {
        window.cancelIdleCallback(modelLoadIdleCallback);
      }

      if (modelLoadTimer) {
        window.clearTimeout(modelLoadTimer);
      }

      window.removeEventListener("pointermove", handlePointerMove);
      hoverTarget.removeEventListener(
        "pointerenter",
        handlePortraitPointerEnter,
      );
      hoverTarget.removeEventListener(
        "pointerleave",
        handlePortraitPointerLeave,
      );
      hoverTarget.removeEventListener("pointerdown", handlePortraitPointerDown);
      hoverTarget.removeEventListener("pointerup", handlePortraitPointerUp);
      hoverTarget.removeEventListener(
        "pointercancel",
        handlePortraitPointerCancel,
      );
      hoverTarget.removeEventListener("focusin", handlePortraitFocus);
      hoverTarget.removeEventListener("focusout", handlePortraitBlur);
      reducedMotion.removeEventListener("change", handleMotionPreference);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();

      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }

      if (hoverExitTimer) {
        window.clearTimeout(hoverExitTimer);
      }

      pointGeometry?.dispose();
      emitterGeometry?.dispose();
      pointMaterial.dispose();
      emitterMaterial.dispose();

      if (solidRoot) {
        disposeModel(solidRoot);
      }

      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={portraitRef}
      className={[
        "halftone-portrait",
        isSolidVisible && "halftone-portrait--selected",
        isSubjectHovered && "halftone-portrait--subject-hovered",
      ]
        .filter(Boolean)
        .join(" ")}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="halftone-portrait__canvas"
        aria-hidden="true"
      />
      {hasError && (
        <img
          className="halftone-portrait__fallback"
          src="/particle-portrait-fallback.jpg"
          alt=""
          width="483"
          height="448"
        />
      )}
    </div>
  );
};

export default HalftonePortrait;
