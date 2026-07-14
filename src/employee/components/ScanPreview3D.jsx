import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';
import {
  setMaterialForObject,
  disposeObject,
  centerAndScaleObject,
  centerGeometryInPlace,
  fitCameraToObject,
} from '../utils/threeViewerHelpers';

const ScanPreview3D = ({ file, wireframe = false, orthographic = false }) => {
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

    const camera = orthographic
      ? new THREE.OrthographicCamera(-1.5, 1.5, 1.5, -1.5, 0.1, 2000)
      : new THREE.PerspectiveCamera(50, 1, 0.1, 2000);
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const mountElement = mountRef.current;
    // A bare <canvas> keeps the browser's intrinsic 300x150 CSS box even
    // inside a 100%-sized parent — setSize's updateStyle=false (below) skips
    // setting canvas.style entirely, so it must be sized explicitly here.
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
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
      const aspect = width / height;

      if (camera.isOrthographicCamera) {
        const halfHeight = camera.userData.orthoHalfHeight || 1.5;
        camera.left = -halfHeight * aspect;
        camera.right = halfHeight * aspect;
        camera.top = halfHeight;
        camera.bottom = -halfHeight;
      } else {
        camera.aspect = aspect;
      }
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
          resize(); // re-derive ortho frustum left/right for the container's aspect
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
          resize(); // re-derive ortho frustum left/right for the container's aspect
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
          resize(); // re-derive ortho frustum left/right for the container's aspect
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
  }, [file, wireframe, orthographic]);

  return (
    <div className="relative h-full w-full rounded-xl overflow-hidden">
      <div ref={mountRef} className="h-full w-full" />
      {loading ? <div className="absolute inset-0 grid place-content-center text-sm text-slate-300 bg-[#031022]/65">Loading 3D preview...</div> : null}
      {error ? <div className="absolute inset-0 grid place-content-center text-sm text-rose-300 bg-[#031022]/90 px-4 text-center">{error}</div> : null}
    </div>
  );
};

export default ScanPreview3D;
