import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as THREE from "three";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";

const MODEL_URL = "/mark-headshot.glb";
const BASE_PARTICLE_COUNT = 50_000;
const DETAIL_PARTICLE_COUNT = 52_000;
const PARTICLE_COUNT = BASE_PARTICLE_COUNT + DETAIL_PARTICLE_COUNT;
const EMITTER_COUNT = 1_400;
const INTRO_HOLD_DURATION = 0.24;
const INTRO_MORPH_DURATION = 1.46;
const HOVER_EXIT_DELAY = 420;
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
  uniform vec3 uKeyLightDirection;
  uniform float uHoverReturn;
  uniform float uIntroProgress;
  uniform float uMotion;
  uniform float uParticleOpacity;
  uniform float uPointScale;
  uniform float uTime;

  varying float vAlpha;
  varying float vDetail;
  varying float vFace;
  varying float vLight;
  varying float vRearVisibility;
  varying float vRim;
  varying float vSideLight;
  varying float vTone;

  void main() {
    float sphereY = fract(
      sin(dot(position, vec3(12.9898, 78.233, 37.719)) + aSeed * 41.37) *
      43758.5453
    ) * 2.0 - 1.0;
    float sphereAngle = fract(
      sin(dot(position, vec3(39.346, 11.135, 83.155)) + aSeed * 73.91) *
      24634.6345
    ) * 6.2831853;
    float sphereRadius = sqrt(max(1.0 - sphereY * sphereY, 0.0));
    vec3 sphereDirection = vec3(
      cos(sphereAngle) * sphereRadius,
      sphereY,
      sin(sphereAngle) * sphereRadius
    );
    float introEase = 1.0 - pow(1.0 - uIntroProgress, 3.0);
    float organicNoise =
      sin(sphereAngle * 3.0 + sphereY * 4.2 + uTime * 1.7) * 0.1 +
      sin(sphereAngle * 7.0 - sphereY * 2.8 - uTime * 1.15 + aSeed * 8.0) *
      0.055;
    float pulse =
      1.0 +
      sin(uTime * 3.8 + aSeed * 2.4) * 0.045 +
      sin(uTime * 1.45 + sphereY * 5.0) * 0.035;
    vec3 organicPosition =
      sphereDirection *
      vec3(0.7, 0.82, 0.64) *
      (1.0 + organicNoise) *
      pulse;
    organicPosition += vec3(
      sin(uTime * 1.2 + sphereY * 3.0),
      cos(uTime * 1.05 + sphereAngle * 0.7),
      sin(uTime * 1.35 + aSeed * 11.0)
    ) * 0.035;
    vec3 swirlDirection = normalize(
      cross(sphereDirection, vec3(0.18, 1.0, 0.12))
    );
    float swirlEnvelope =
      sin(uIntroProgress * 3.1415926) * (1.0 - uIntroProgress * 0.55);
    vec3 positionAnimated =
      mix(organicPosition, position, introEase) +
      swirlDirection *
      swirlEnvelope *
      (0.08 + aSeed * 0.11) *
      sin(aSeed * 23.0 + uTime * 1.6);
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
  uniform vec3 uKeyLightDirection;
  uniform float uHoverReturn;
  uniform float uIntroProgress;
  uniform float uMotion;
  uniform float uParticleOpacity;
  uniform float uPointScale;
  uniform float uTime;

  varying float vAlpha;
  varying float vDetail;
  varying float vFace;
  varying float vLight;
  varying float vRearVisibility;
  varying float vRim;
  varying float vSideLight;
  varying float vTone;

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

    float sphereY = fract(
      sin(dot(position, vec3(12.9898, 78.233, 37.719)) + aSeed * 41.37) *
      43758.5453
    ) * 2.0 - 1.0;
    float sphereAngle = fract(
      sin(dot(position, vec3(39.346, 11.135, 83.155)) + aSeed * 73.91) *
      24634.6345
    ) * 6.2831853;
    float sphereRadius = sqrt(max(1.0 - sphereY * sphereY, 0.0));
    vec3 sphereDirection = vec3(
      cos(sphereAngle) * sphereRadius,
      sphereY,
      sin(sphereAngle) * sphereRadius
    );
    float introEase = 1.0 - pow(1.0 - uIntroProgress, 3.0);
    float organicNoise =
      sin(sphereAngle * 3.0 + sphereY * 4.2 + uTime * 1.7) * 0.1 +
      sin(sphereAngle * 7.0 - sphereY * 2.8 - uTime * 1.15 + aSeed * 8.0) *
      0.055;
    float pulse =
      1.0 +
      sin(uTime * 3.8 + aSeed * 2.4) * 0.045 +
      sin(uTime * 1.45 + sphereY * 5.0) * 0.035;
    vec3 organicPosition =
      sphereDirection *
      vec3(0.7, 0.82, 0.64) *
      (1.0 + organicNoise) *
      pulse;
    organicPosition += vec3(
      sin(uTime * 1.2 + sphereY * 3.0),
      cos(uTime * 1.05 + sphereAngle * 0.7),
      sin(uTime * 1.35 + aSeed * 11.0)
    ) * 0.035;
    vec3 swirlDirection = normalize(
      cross(sphereDirection, vec3(0.18, 1.0, 0.12))
    );
    float swirlEnvelope =
      sin(uIntroProgress * 3.1415926) * (1.0 - uIntroProgress * 0.55);
    vec3 positionAnimated =
      mix(organicPosition, emittedPosition, introEase) +
      swirlDirection *
      swirlEnvelope *
      (0.08 + aSeed * 0.11) *
      sin(aSeed * 23.0 + uTime * 1.6);

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
  uniform vec3 uColor;
  uniform vec3 uKeyLightColor;
  uniform vec3 uKeyLightDirection;
  uniform float uParticleOpacity;
  uniform vec3 uRimLightColor;

  varying float vAlpha;
  varying float vDetail;
  varying float vFace;
  varying float vLight;
  varying float vRearVisibility;
  varying float vRim;
  varying float vSideLight;
  varying float vTone;

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
        mix(0.45, 1.0, vRearVisibility) *
        mix(1.0, 1.18, featureInk) *
        uParticleOpacity
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
  const togglePinRef = useRef<() => void>(() => undefined);
  const [hasError, setHasError] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isSubjectHovered, setIsSubjectHovered] = useState(false);
  const isSolidVisible = isPinned || isSubjectHovered;

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
    let lastTimestamp = 0;
    let isVisible = true;
    let isSolidPinned = false;
    let isSubjectHovering = false;
    let hoverExitTimer = 0;
    let hoverProgress = 0;
    let solidProgress = 0;
    let swivelElapsed = 0;
    const keyLightDirection = KEY_LIGHT_DIRECTION.clone();
    const fillLightDirection = FILL_LIGHT_DIRECTION.clone();
    const targetKeyLightDirection = KEY_LIGHT_DIRECTION.clone();
    const targetFillLightDirection = FILL_LIGHT_DIRECTION.clone();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
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
    let hitMeshes: THREE.Mesh[] = [];
    let solidMaterials: THREE.MeshStandardMaterial[] = [];
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const setSubjectHover = (isHovered: boolean) => {
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

    const intersectsSubject = (event: PointerEvent) => {
      if (!hitMeshes.length) {
        return false;
      }

      const rect = canvas.getBoundingClientRect();
      pointer.set(
        ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 2 - 1,
        -((event.clientY - rect.top) / Math.max(rect.height, 1)) * 2 + 1,
      );
      raycaster.setFromCamera(pointer, camera);

      return raycaster.intersectObjects(hitMeshes, false).length > 0;
    };

    const togglePin = () => {
      if (!solidRoot) {
        return;
      }

      isSolidPinned = !isSolidPinned;
      setIsPinned(isSolidPinned);
      requestAnimation();
    };
    togglePinRef.current = togglePin;

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
    loader.load(
      MODEL_URL,
      (gltf) => {
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

        meshes.forEach((mesh, meshIndex) => {
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
          }
        });

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
        }

        while (cursor < PARTICLE_COUNT) {
          const context =
            samplingContexts[
              Math.floor(Math.random() * samplingContexts.length)
            ];
          sampleFromContext(context);
          storeParticle(context.textureReader);
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

        hitMeshes = meshes;
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
          material.envMapIntensity = 0.05;
          material.normalScale.multiplyScalar(0.7);

          if (material instanceof THREE.MeshPhysicalMaterial) {
            material.clearcoat = 0;
            material.clearcoatRoughness = 1;
            material.specularIntensity = 0.68;
          }

          material.emissive.set(0x2b6b45);
          material.emissiveMap = material.map;
          material.emissiveIntensity = material.map ? 0.04 : 0.01;
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
      commonUniforms.uIntroProgress.value = reducedMotion.matches
        ? 1
        : THREE.MathUtils.clamp(
            (introElapsed - INTRO_HOLD_DURATION) / INTRO_MORPH_DURATION,
            0,
            1,
          );
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
      const shouldShowSolid = isSubjectHovering || isSolidPinned;
      solidProgress = THREE.MathUtils.lerp(
        solidProgress,
        shouldShowSolid ? 1 : 0,
        solidResponse,
      );
      commonUniforms.uTime.value = elapsed;
      commonUniforms.uHoverReturn.value = hoverProgress;
      commonUniforms.uParticleOpacity.value = 1 - solidProgress;
      solidKeyLight.position.copy(keyLightDirection).multiplyScalar(5);
      solidFillLight.position.copy(fillLightDirection).multiplyScalar(4);

      if (solidRoot) {
        solidMaterials.forEach((material) => {
          material.opacity = solidProgress;
          material.depthWrite = solidProgress > 0.55;
        });
      }

      if (pointCloud) {
        pointCloud.visible = solidProgress < 0.998;
      }

      if (emitterCloud) {
        emitterCloud.visible = solidProgress < 0.98;
      }

      if (!reducedMotion.matches) {
        swivelElapsed += delta;
        modelGroup.rotation.y =
          INITIAL_ROTATION +
          Math.sin((swivelElapsed / ROTATION_DURATION) * Math.PI * 2) *
            ROTATION_SWAY;
      }

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
      requestAnimation();
    };

    const handleSubjectPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "touch") {
        setSubjectHover(intersectsSubject(event));
      }
    };

    const handlePortraitPointerLeave = () => {
      setSubjectHover(false);
    };

    const handleSubjectPointerDown = (event: PointerEvent) => {
      if (intersectsSubject(event)) {
        event.preventDefault();
        togglePin();
      }
    };

    const handleMotionPreference = () => {
      commonUniforms.uMotion.value = reducedMotion.matches ? 0 : 1;
      commonUniforms.uIntroProgress.value = reducedMotion.matches
        ? 1
        : commonUniforms.uIntroProgress.value;

      if (reducedMotion.matches) {
        modelGroup.rotation.y = INITIAL_ROTATION;
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
    canvas.addEventListener("pointermove", handleSubjectPointerMove, {
      passive: true,
    });
    canvas.addEventListener("pointerdown", handleSubjectPointerDown);
    portrait.addEventListener("pointerleave", handlePortraitPointerLeave);
    reducedMotion.addEventListener("change", handleMotionPreference);
    resize();
    requestAnimation();

    return () => {
      disposed = true;
      togglePinRef.current = () => undefined;
      window.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointermove", handleSubjectPointerMove);
      canvas.removeEventListener("pointerdown", handleSubjectPointerDown);
      portrait.removeEventListener("pointerleave", handlePortraitPointerLeave);
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
        isPinned && "halftone-portrait--pinned",
        isSubjectHovered && "halftone-portrait--subject-hovered",
      ]
        .filter(Boolean)
        .join(" ")}
      role={isSolidVisible ? "group" : "button"}
      tabIndex={isSolidVisible ? -1 : 0}
      aria-label={
        isPinned
          ? "Pinned solid portrait of Mark Judaya"
          : isSolidVisible
            ? "Solid portrait preview of Mark Judaya. Select the portrait to keep it visible."
            : "Interactive three-dimensional portrait of Mark Judaya. Hover to preview the solid portrait or select it to keep it visible."
      }
      aria-pressed={isSolidVisible ? undefined : false}
      onKeyDown={(event) => {
        if (
          event.target === event.currentTarget &&
          (event.key === "Enter" || event.key === " ")
        ) {
          event.preventDefault();
          togglePinRef.current();
        } else if (event.key === "Escape" && isPinned) {
          togglePinRef.current();
        }
      }}
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
      {isSolidVisible && (
        <Link className="halftone-portrait__about-link" to="/about">
          <span>About Me</span>
          <span aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  );
};

export default HalftonePortrait;
