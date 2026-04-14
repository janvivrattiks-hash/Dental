import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';

const setMaterialForObject = (object, material) => {
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

const disposeObject = (object) => {
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

const centerAndScaleObject = (object) => {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const scale = 2.4 / maxDim;

  object.position.sub(center);
  object.scale.setScalar(scale);

  return size.multiplyScalar(scale);
};

const centerGeometryInPlace = (geometry) => {
  geometry.computeBoundingBox();
  const boundingBox = geometry.boundingBox;

  if (!boundingBox) {
    return;
  }

  const center = boundingBox.getCenter(new THREE.Vector3());
  geometry.translate(-center.x, -center.y, -center.z);
};

const fitCameraToObject = (camera, controls, size) => {
  const maxDim = Math.max(size.x, size.y, size.z) || 1;
  const fov = camera.fov * (Math.PI / 180);
  let cameraZ = Math.abs((maxDim / 2) / Math.tan(fov / 2));
  cameraZ *= 1.25;

  camera.position.set(0, 0, cameraZ);
  camera.near = Math.max(maxDim / 1000, 0.01);
  camera.far = maxDim * 100;
  camera.updateProjectionMatrix();

  controls.target.set(0, 0, 0);
  camera.lookAt(0, 0, 0);
  controls.maxDistance = cameraZ * 3;
  controls.minDistance = cameraZ * 0.35;
  controls.update();
};

const ScanPreview3D = ({ file, wireframe = false }) => {
  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!mountRef.current || !file) {
      return undefined;
    }

    let frameId;
    let disposed = false;
    let mountedSceneObject = null;
    let centeredGroup = null;

    setLoading(true);
    setError('');

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#031022');

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 2000);
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const mountElement = mountRef.current;
    mountElement.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;

    scene.add(new THREE.AmbientLight(0x9adfff, 0.45));

    const keyLight = new THREE.DirectionalLight(0x7df4ff, 1);
    keyLight.position.set(10, 9, 7);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xb884ff, 0.7);
    rimLight.position.set(-8, -4, -8);
    scene.add(rimLight);

    const resize = () => {
      if (!mountElement) return;
      const width = mountElement.clientWidth;
      const height = mountElement.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    resize();
    window.addEventListener('resize', resize);

    const meshMaterial = new THREE.MeshStandardMaterial({
      color: '#58d7ff',
      metalness: 0.1,
      roughness: 0.35,
      wireframe,
      emissive: '#0a6b89',
      emissiveIntensity: 0.18,
    });

    const loadFile = async () => {
      try {
        const extension = file.name.split('.').pop()?.toLowerCase();

        if (!extension || !['stl', 'ply', 'obj'].includes(extension)) {
          throw new Error('Unsupported file type. Please upload STL, OBJ, or PLY.');
        }

        if (extension === 'obj') {
          const textData = await file.text();
          const object = new OBJLoader().parse(textData);
          setMaterialForObject(object, meshMaterial);
          object.traverse((node) => {
            if (node.isMesh && node.geometry) {
              centerGeometryInPlace(node.geometry);
            }
          });
          const group = new THREE.Group();
          group.add(object);
          scene.add(group);
          mountedSceneObject = object;
          centeredGroup = group;
          const size = centerAndScaleObject(group);
          fitCameraToObject(camera, controls, size);
        }

        if (extension === 'stl') {
          const arrayBuffer = await file.arrayBuffer();
          const geometry = new STLLoader().parse(arrayBuffer);
          geometry.computeVertexNormals();
          centerGeometryInPlace(geometry);
          const mesh = new THREE.Mesh(geometry, meshMaterial.clone());
          const group = new THREE.Group();
          group.add(mesh);
          scene.add(group);
          mountedSceneObject = mesh;
          centeredGroup = group;
          const size = centerAndScaleObject(group);
          fitCameraToObject(camera, controls, size);
        }

        if (extension === 'ply') {
          const arrayBuffer = await file.arrayBuffer();
          const geometry = new PLYLoader().parse(arrayBuffer);
          geometry.computeVertexNormals();
          centerGeometryInPlace(geometry);
          const mesh = new THREE.Mesh(geometry, meshMaterial.clone());
          const group = new THREE.Group();
          group.add(mesh);
          scene.add(group);
          mountedSceneObject = mesh;
          centeredGroup = group;
          const size = centerAndScaleObject(group);
          fitCameraToObject(camera, controls, size);
        }

        if (!disposed) {
          setLoading(false);
        }
      } catch (loadError) {
        if (!disposed) {
          setError(loadError?.message || 'Unable to preview this file.');
          setLoading(false);
        }
      }
    };

    loadFile();

    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resize);
      controls.dispose();
      if (mountedSceneObject) {
        disposeObject(mountedSceneObject);
      }
      if (centeredGroup) {
        scene.remove(centeredGroup);
      }
      meshMaterial.dispose();
      renderer.dispose();
      if (mountElement.contains(renderer.domElement)) {
        mountElement.removeChild(renderer.domElement);
      }
    };
  }, [file, wireframe]);

  return (
    <div className="relative h-full w-full rounded-xl overflow-hidden">
      <div ref={mountRef} className="h-full w-full" />
      {loading ? <div className="absolute inset-0 grid place-content-center text-sm text-slate-300 bg-[#031022]/65">Loading 3D preview...</div> : null}
      {error ? <div className="absolute inset-0 grid place-content-center text-sm text-rose-300 bg-[#031022]/90 px-4 text-center">{error}</div> : null}
    </div>
  );
};

export default ScanPreview3D;
