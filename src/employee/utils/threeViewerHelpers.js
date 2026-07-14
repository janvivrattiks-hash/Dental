import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';

export const setMaterialForObject = (object, material) => {
  object.traverse((node) => {
    if (node.isMesh) {
      if (node.material) {
        if (Array.isArray(node.material)) {
          node.material.forEach((mat) => mat.dispose());
        } else {
          node.material.dispose();
        }
      }
      node.material = material.clone();
      node.castShadow = true;
      node.receiveShadow = true;
    }
  });
};

export const disposeObject = (object) => {
  object.traverse((node) => {
    if (node.isMesh) {
      if (node.geometry) {
        node.geometry.dispose();
      }
      if (node.material) {
        if (Array.isArray(node.material)) {
          node.material.forEach((mat) => mat.dispose());
        } else {
          node.material.dispose();
        }
      }
    }
  });
};

export const centerAndScaleObject = (object) => {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const scale = 2.4 / maxDim;

  object.position.sub(center);
  object.scale.setScalar(scale);

  return size.multiplyScalar(scale);
};

export const centerGeometryInPlace = (geometry) => {
  geometry.computeBoundingBox();
  const boundingBox = geometry.boundingBox;

  if (!boundingBox) {
    return;
  }

  const center = boundingBox.getCenter(new THREE.Vector3());
  geometry.translate(-center.x, -center.y, -center.z);
};

export const fitCameraToObject = (camera, controls, size) => {
  const maxDim = Math.max(size.x, size.y, size.z) || 1;

  if (camera.isOrthographicCamera) {
    // Parallel projection: apparent size comes from the frustum bounds, not
    // camera distance, so store the half-height for `resize` to re-derive
    // left/right from the container's live aspect ratio.
    camera.userData.orthoHalfHeight = (maxDim / 2) * 1.25;
    camera.position.set(0, 0, maxDim * 2);
    camera.zoom = 1;
    camera.near = Math.max(maxDim / 1000, 0.01);
    camera.far = maxDim * 100;
    controls.minZoom = 0.2;
    controls.maxZoom = 8;
  } else {
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs((maxDim / 2) / Math.tan(fov / 2));
    cameraZ *= 1.25;

    camera.position.set(0, 0, cameraZ);
    camera.near = Math.max(maxDim / 1000, 0.01);
    camera.far = maxDim * 100;
    controls.maxDistance = cameraZ * 3;
    controls.minDistance = cameraZ * 0.35;
  }

  camera.updateProjectionMatrix();
  controls.target.set(0, 0, 0);
  camera.lookAt(0, 0, 0);
  controls.update();
};

const LOADERS = {
  stl: STLLoader,
  ply: PLYLoader,
  obj: OBJLoader,
};

// Network-fetch variant of the STL/OBJ/PLY dispatch used for File-based
// parsing in ScanPreview3D — loads from a URL (e.g. a backend mesh artifact)
// instead of an in-memory File.
export const loadMeshByExtension = (url, extension) => {
  const Loader = LOADERS[extension];
  if (!Loader) {
    return Promise.reject(new Error(`Unsupported mesh type: .${extension}`));
  }

  return new Promise((resolve, reject) => {
    new Loader().load(
      url,
      (result) => resolve(result),
      undefined,
      (err) => reject(err instanceof Error ? err : new Error('Failed to load mesh')),
    );
  });
};
