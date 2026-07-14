import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  disposeObject,
  centerAndScaleObject,
  fitCameraToObject,
  loadMeshByExtension,
} from '../utils/threeViewerHelpers';

const buildMaterial = (color, wireframe) => new THREE.MeshStandardMaterial({
  color,
  metalness: 0.2,
  roughness: 0.4,
  transparent: true,
  opacity: 0.92,
  wireframe,
});

// Renders several already mutually-aligned backend mesh artifacts (patient
// scan + per-tooth analog/scan-body/corrector STLs) as one scene, with
// per-mesh visibility toggling and the same Wireframe/Orthographic modes as
// ScanPreview3D. Unlike ScanPreview3D, meshes are NOT individually centered —
// the backend alignment pipeline already places them in one shared
// coordinate space, so only the union of all of them is centered/scaled once.
//
// Follows ScanPreview3D's single-effect structure deliberately: an earlier
// version split renderer/camera/mesh-loading across several coordinating
// effects+refs to avoid reloading meshes on every wireframe/ortho toggle, but
// that cross-effect ordering was fragile and silently produced a
// never-rendering canvas. Reloading meshes on toggle is a minor cost these
// mesh sets are small STLs; correctness matters more here.
const ResultsViewer3D = ({ meshes = [], wireframe = false, orthographic = false }) => {
  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [failedIds, setFailedIds] = useState(() => new Set());

  const entries = useMemo(() => meshes.filter((m) => m.url), [meshes]);
  const meshesKey = useMemo(() => entries.map((m) => `${m.id}:${m.url}`).join('|'), [entries]);
  const visibilityKey = useMemo(
    () => meshes.map((m) => `${m.id}:${m.visible !== false}`).join('|'),
    [meshes]
  );

  useEffect(() => {
    const mountElement = mountRef.current;
    if (!mountElement) return undefined;

    let frameId;
    let disposed = false;
    const subgroups = {};

    setLoading(true);
    setFailedIds(new Set());

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#031022');

    const camera = orthographic
      ? new THREE.OrthographicCamera(-1.5, 1.5, 1.5, -1.5, 0.1, 5000)
      : new THREE.PerspectiveCamera(50, 1, 0.1, 5000);
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
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

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

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

    const loadAll = async () => {
      const settled = await Promise.allSettled(
        entries.map(async (m) => {
          const pathname = m.url.split('?')[0];
          const extension = pathname.split('.').pop()?.toLowerCase();
          const result = await loadMeshByExtension(m.url, extension);

          let object;
          if (result.isBufferGeometry) {
            result.computeVertexNormals();
            object = new THREE.Mesh(result, buildMaterial(m.color, wireframe));
            object.castShadow = true;
            object.receiveShadow = true;
          } else {
            object = result;
            object.traverse((node) => {
              if (node.isMesh) {
                node.material = buildMaterial(m.color, wireframe);
                node.castShadow = true;
                node.receiveShadow = true;
              }
            });
          }

          const subgroup = new THREE.Group();
          subgroup.add(object);
          subgroup.visible = m.visible !== false;
          return { id: m.id, subgroup };
        })
      );

      if (disposed) return;

      const failed = new Set();
      settled.forEach((outcome, i) => {
        if (outcome.status === 'fulfilled') {
          rootGroup.add(outcome.value.subgroup);
          subgroups[outcome.value.id] = outcome.value.subgroup;
        } else {
          failed.add(entries[i].id);
        }
      });
      setFailedIds(failed);

      if (rootGroup.children.length > 0) {
        const size = centerAndScaleObject(rootGroup);
        fitCameraToObject(camera, controls, size);
        resize(); // re-derive ortho frustum left/right for the container's aspect
      }
      setLoading(false);
    };

    loadAll();

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
      disposeObject(rootGroup);
      scene.remove(rootGroup);
      renderer.dispose();
      if (mountElement.contains(renderer.domElement)) {
        mountElement.removeChild(renderer.domElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meshesKey, visibilityKey, wireframe, orthographic]);

  const failedCount = failedIds.size;

  return (
    <div className="relative h-full w-full rounded-xl overflow-hidden">
      <div ref={mountRef} className="h-full w-full" />
      {entries.length === 0 ? (
        <div className="absolute inset-0 grid place-content-center text-sm text-slate-400 bg-[#031022]/90">
          No meshes to display yet.
        </div>
      ) : null}
      {loading && entries.length > 0 ? (
        <div className="absolute inset-0 grid place-content-center text-sm text-slate-300 bg-[#031022]/65">
          Loading 3D preview...
        </div>
      ) : null}
      {!loading && failedCount > 0 ? (
        <div className="absolute bottom-3 right-3 text-[11px] text-amber-300 bg-black/50 rounded-full px-2 py-1">
          {failedCount} mesh{failedCount === 1 ? '' : 'es'} failed to load
        </div>
      ) : null}
    </div>
  );
};

export default ResultsViewer3D;
