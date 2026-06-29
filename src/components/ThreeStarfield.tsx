"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "meshoptimizer";

interface ThreeStarfieldProps {
  isBlackholeHovered?: boolean;
  blackholePos?: { x: number; y: number } | null;
}

const ThreeStarfield = ({
  isBlackholeHovered = false,
  blackholePos = null
}: ThreeStarfieldProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Keep latest prop values in refs to avoid recreating the Three.js context on props update
  const hoverRef = useRef(isBlackholeHovered);
  const posRef = useRef(blackholePos);

  useEffect(() => {
    hoverRef.current = isBlackholeHovered;
  }, [isBlackholeHovered]);

  useEffect(() => {
    posRef.current = blackholePos;
  }, [blackholePos]);

  useEffect(() => {
    if (!containerRef.current) return;

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || (window.innerWidth <= 1024);

    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera;
    let renderer: THREE.WebGLRenderer;
    let mouseX = 0;
    let mouseY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;
    let geometry: THREE.BufferGeometry;
    let starStuff: THREE.PointsMaterial;
    let stars: THREE.Points;
    let originalVertices: Float32Array;
    let transitionProgress = 0;
    let prevTransitionProgress = -1;
    let skyboxGroup: THREE.Group | null = null;

    const HEIGHT = window.innerHeight;
    const WIDTH = window.innerWidth;
    const aspectRatio = WIDTH / HEIGHT;
    const fieldOfView = 75;
    const nearPlane = 1;
    const farPlane = 1000;

    windowHalfX = WIDTH / 2;
    windowHalfY = HEIGHT / 2;

    camera = new THREE.PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
    );

    camera.position.z = farPlane / 2;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.0003);

    starForge();

    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setClearColor(0x000011, 1);
    renderer.setPixelRatio(isMobile ? Math.min(window.devicePixelRatio, 1.5) : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(WIDTH, HEIGHT);
    containerRef.current.appendChild(renderer.domElement);

    // Load Skybox GLB only on desktop to save mobile bandwidth, decoders, and massive WebGL VRAM/rendering overhead
    if (!isMobile) {
      const loader = new GLTFLoader();
      loader.setMeshoptDecoder(MeshoptDecoder);
      loader.load(
        "/Skybox/inside_galaxy_skybox_hdri_360_panorama.glb",
        (gltf) => {
          skyboxGroup = new THREE.Group();
          skyboxGroup.add(gltf.scene);

          // Center the geometry
          const box = new THREE.Box3().setFromObject(gltf.scene);
          const center = box.getCenter(new THREE.Vector3());
          gltf.scene.position.sub(center);

          // Scale to fit camera frustum nicely (radius ~900, diameter ~1800)
          const size = box.getSize(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z);
          if (maxDim > 0) {
            const targetScale = 1800 / maxDim;
            skyboxGroup.scale.set(targetScale, targetScale, targetScale);
          }

          // Convert materials to MeshBasicMaterial (unlit) and double sided, no depth write, no fog
          gltf.scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              const mesh = child as THREE.Mesh;
              mesh.renderOrder = -1; // Draw behind stars
              if (mesh.material) {
                const convertMaterial = (mat: THREE.Material) => {
                  const params: THREE.MeshBasicMaterialParameters = {
                    side: THREE.DoubleSide,
                    depthWrite: false,
                    depthTest: true,
                    fog: false
                  };

                  let textureMap = null;
                  const colorMultiplier = new THREE.Color(0xffffff);

                  if ("emissiveMap" in mat && (mat as any).emissiveMap) {
                    textureMap = (mat as any).emissiveMap;
                    if ("emissive" in mat && (mat as any).emissive) {
                      colorMultiplier.copy((mat as any).emissive);
                    }
                  } else if ("map" in mat && (mat as any).map) {
                    textureMap = (mat as any).map;
                    if ("color" in mat && (mat as any).color) {
                      colorMultiplier.copy((mat as any).color);
                    }
                  } else {
                    if ("color" in mat && (mat as any).color) {
                      colorMultiplier.copy((mat as any).color);
                    }
                  }

                  if (textureMap) {
                    params.map = textureMap;
                  }

                  // Darken the background skybox (multiply by 0.4 to act as a 60% black transparent panel overlay)
                  colorMultiplier.multiplyScalar(0.2);
                  params.color = colorMultiplier;

                  const basicMat = new THREE.MeshBasicMaterial(params);
                  return basicMat;
                };

                if (Array.isArray(mesh.material)) {
                  mesh.material = mesh.material.map((mat) => {
                    const newMat = convertMaterial(mat);
                    mat.dispose();
                    return newMat;
                  });
                } else {
                  const oldMat = mesh.material;
                  mesh.material = convertMaterial(oldMat);
                  oldMat.dispose();
                }
              }
            }
          });

          scene.add(skyboxGroup);
        },
        undefined,
        (err) => {
          console.error("Failed to load galaxy skybox GLB:", err);
        }
      );
    }

    const onWindowResize = () => {
      const WIDTH = window.innerWidth;
      const HEIGHT = window.innerHeight;
      camera.aspect = WIDTH / HEIGHT;
      camera.updateProjectionMatrix();
      renderer.setSize(WIDTH, HEIGHT);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX - windowHalfX;
      mouseY = e.clientY - windowHalfY;
    };

    window.addEventListener("resize", onWindowResize, false);

    if (!isMobile) {
      document.addEventListener("mousemove", onMouseMove, false);
    }

    function starForge() {
      const starQty = isMobile ? 10000 : 30000;
      geometry = new THREE.BufferGeometry();

      const materialOptions = {
        size: isMobile ? 1.5 : 1.0,
        transparent: true,
        opacity: 0.7
      };

      starStuff = new THREE.PointsMaterial(materialOptions);

      const vertices = new Float32Array(starQty * 3);

      for (let i = 0; i < starQty; i++) {
        vertices[i * 3] = Math.random() * 2000 - 1000;
        vertices[i * 3 + 1] = Math.random() * 2000 - 1000;
        vertices[i * 3 + 2] = Math.random() * 2000 - 1000;
      }

      // Store a copy of the original vertex positions
      originalVertices = new Float32Array(vertices);

      geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));

      stars = new THREE.Points(geometry, starStuff);
      scene.add(stars);
    }

    const animate = () => {
      requestAnimationFrame(animate);
      render();
    };

    const render = () => {
      // Camera moves based on mouse only on desktop (keeps mobile 100% static/stable camera)
      if (!isMobile) {
        camera.position.x += (mouseX - camera.position.x) * 0.005;
        camera.position.y += (-mouseY - camera.position.y) * 0.005;
      }
      camera.lookAt(scene.position);

      if (skyboxGroup) {
        skyboxGroup.position.copy(camera.position);
      }

      // Slowly rotate the stars group to add a subtle dynamic feeling
      if (stars) {
        stars.rotation.y += 0.00015;
        stars.rotation.x += 0.00003;
      }

      const isHovered = hoverRef.current;
      const targetT = isHovered ? 1 : 0;

      // Animate transition value slowly
      const speed = isHovered ? 0.015 : 0.025; // slow suction, slightly faster return
      if (Math.abs(transitionProgress - targetT) > 0.0001) {
        transitionProgress += (targetT - transitionProgress) * speed;
      } else {
        transitionProgress = targetT;
      }

      // ONLY calculate and update positions if transitionProgress changed.
      // This completely eliminates CPU and GPU update overhead once transition finishes (is 0 or 1).
      const progressChanged = transitionProgress !== prevTransitionProgress;

      if (progressChanged && originalVertices && geometry) {
        const positions = geometry.attributes.position.array as Float32Array;
        const starQty = originalVertices.length / 3;

        const target3D = new THREE.Vector3(0, 0, 0);

        // Project the blackhole's screen position to 3D world space
        if (posRef.current) {
          const px = posRef.current.x;
          const py = posRef.current.y;
          const ndcX = (px / window.innerWidth) * 2 - 1;
          const ndcY = -(py / window.innerHeight) * 2 + 1;

          const raycaster = new THREE.Raycaster();
          raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
          raycaster.ray.at(750, target3D);
        } else {
          // Fallback to center projection when not hovered and returning
          const raycaster = new THREE.Raycaster();
          raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
          raycaster.ray.at(750, target3D);
        }

        // Precompute values for the swirling rotation to maximize loop performance
        const cosTable: number[] = [];
        const sinTable: number[] = [];
        for (let s = 1; s <= 10; s++) {
          const swirlSpeed = s * 0.2;
          const angle = Math.pow(transitionProgress, 1.5) * swirlSpeed * Math.PI * 3;
          cosTable.push(Math.cos(angle));
          sinTable.push(Math.sin(angle));
        }

        // Ease-in pull: slow at first, then rapid suction
        const pullFactor = 1 - Math.pow(transitionProgress, 3);

        for (let i = 0; i < starQty; i++) {
          const ox = originalVertices[i * 3];
          const oy = originalVertices[i * 3 + 1];
          const oz = originalVertices[i * 3 + 2];

          const dx = ox - target3D.x;
          const dy = oy - target3D.y;
          const dz = oz - target3D.z;

          const tableIdx = i % 10;
          const cosA = cosTable[tableIdx];
          const sinA = sinTable[tableIdx];

          const rx = dx * cosA - dy * sinA;
          const ry = dx * sinA + dy * cosA;

          positions[i * 3] = target3D.x + rx * pullFactor;
          positions[i * 3 + 1] = target3D.y + ry * pullFactor;
          positions[i * 3 + 2] = target3D.z + dz * pullFactor;
        }

        geometry.attributes.position.needsUpdate = true;

        // Shrink star size and fade opacity during pull
        starStuff.size = (isMobile ? 1.5 : 1.0) * (1 - transitionProgress * 0.95);
        starStuff.opacity = 0.7 * (1 - transitionProgress * 0.98);

        prevTransitionProgress = transitionProgress;
      }

      renderer.render(scene, camera);
    };

    animate();

    const currentContainer = containerRef.current;

    return () => {
      window.removeEventListener("resize", onWindowResize);
      if (!isMobile) {
        document.removeEventListener("mousemove", onMouseMove);
      }

      if (currentContainer) {
        currentContainer.removeChild(renderer.domElement);
      }
      if (geometry) geometry.dispose();
      if (starStuff) starStuff.dispose();

      // Dispose skybox resources
      if (skyboxGroup) {
        skyboxGroup.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            if (mesh.geometry) mesh.geometry.dispose();
            if (mesh.material) {
              if (Array.isArray(mesh.material)) {
                mesh.material.forEach((mat) => mat.dispose());
              } else {
                mesh.material.dispose();
              }
            }
          }
        });
      }

      if (renderer) renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full -z-10"
    />
  );
};

export default ThreeStarfield;
