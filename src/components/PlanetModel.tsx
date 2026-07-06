"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "meshoptimizer";

interface PlanetModelProps {
  modelPath: string;
  onHoverChange?: (isHovered: boolean) => void;
  baseScale?: number;
  hoverRadius?: number;
  isInteractive?: boolean;
  autoRotate?: boolean;
  initialRotation?: { x: number; y: number; z: number };
}

const PlanetModel: React.FC<PlanetModelProps> = ({ 
  modelPath, 
  onHoverChange, 
  baseScale = 2.8, 
  hoverRadius = 0.85, 
  isInteractive = true,
  autoRotate = true,
  initialRotation
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const clientMouse = useRef({ x: 9999, y: 9999 });
  const modelRef = useRef<THREE.Group | null>(null);

  const isInteractiveRef = useRef(isInteractive);
  useEffect(() => {
    isInteractiveRef.current = isInteractive;
  }, [isInteractive]);

  useEffect(() => {
    if (modelRef.current && baseScale) {
      const box = new THREE.Box3().setFromObject(modelRef.current);
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = baseScale / maxDim;
      modelRef.current.scale.set(scale, scale, scale);
    }
  }, [baseScale]);

  const hoverCallbackRef = useRef(onHoverChange);
  useEffect(() => {
    hoverCallbackRef.current = onHoverChange;
  }, [onHoverChange]);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    currentMount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 3);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const spotLight = new THREE.SpotLight(0xffffff, 2);
    spotLight.position.set(-5, 5, 2);
    scene.add(spotLight);

    let isCurrentlyHovered = false;
    let mixer: THREE.AnimationMixer | null = null;
    const clock = new THREE.Clock();

    const loader = new GLTFLoader();
    loader.setMeshoptDecoder(MeshoptDecoder);
    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;
        modelRef.current = model;
        
        // Optimize materials for better quality
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            
            // Hide shadow, helper, floor or grid meshes
            const nameLower = (mesh.name || "").toLowerCase();
            if (
              nameLower.includes("shadow") ||
              nameLower.includes("helper") ||
              nameLower.includes("ground") ||
              nameLower.includes("floor") ||
              nameLower.includes("grid")
            ) {
              mesh.visible = false;
            }

            const mat = mesh.material as THREE.MeshStandardMaterial;
            if (mat) {
              mat.envMapIntensity = 1.5;
              mat.roughness = Math.max(mat.roughness, 0.2);
              mat.metalness = Math.min(mat.metalness, 0.8);
            }
          }
        });

        // Center the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        
        // Scale the model to fit
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = baseScale / maxDim; 
        model.scale.set(scale, scale, scale);
        
        if (initialRotation) {
          model.rotation.set(initialRotation.x, initialRotation.y, initialRotation.z);
        }

        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          gltf.animations.forEach((clip) => {
            mixer!.clipAction(clip).play();
          });
        }
        
        scene.add(model);
      },
      undefined,
      (error) => {
        console.error("An error happened loading the 3D model", error);
      }
    );

    const handleMouseMove = (event: MouseEvent) => {
      clientMouse.current.x = event.clientX;
      clientMouse.current.y = event.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      if (mixer) mixer.update(delta);

      if (modelRef.current) {
        const isBlackhole = modelPath.toLowerCase().includes("blackhole");
        if (!isBlackhole) {
          if (autoRotate) {
            // Custom diagonal and slow spin
            const isSupernova = modelPath.toLowerCase().includes("supernova");
            const rotationSpeedY = isSupernova ? 0.005 : 0.0012;
            const rotationSpeedX = isSupernova ? 0.001 : 0.0004;
            modelRef.current.rotation.y += rotationSpeedY;
            modelRef.current.rotation.x += rotationSpeedX;
          } else {
            // Normal slow spin
            const rotationSpeedY = isCurrentlyHovered ? 0.0003 : 0.0015;
            const rotationSpeedX = isCurrentlyHovered ? 0.0002 : 0.001;
            modelRef.current.rotation.y += rotationSpeedY;
            modelRef.current.rotation.x += rotationSpeedX;
          }
        }

        // Recalculate relative coordinates dynamically using the latest bounding box.
        // This ensures hover detection remains accurate even when the canvas moves or scales
        // under a motionless mouse pointer.
        if (!currentMount) return;
        const rect = currentMount.getBoundingClientRect();
        const mx = ((clientMouse.current.x - rect.left) / rect.width) * 2 - 1;
        const my = -((clientMouse.current.y - rect.top) / rect.height) * 2 + 1;

        const distanceToCenter = Math.sqrt(mx * mx + my * my);
        const isHovered = isInteractiveRef.current && (distanceToCenter < hoverRadius);

        if (isHovered !== isCurrentlyHovered) {
          isCurrentlyHovered = isHovered;
          if (hoverCallbackRef.current) hoverCallbackRef.current(isHovered);
          currentMount.style.cursor = isHovered ? "pointer" : "default";
        }
      }
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight;
      renderer.setSize(newWidth, newHeight);
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (currentMount) {
        if (renderer.domElement) {
          currentMount.removeChild(renderer.domElement);
        }
      }
      cancelAnimationFrame(animationId);
      modelRef.current = null;
      scene.clear();
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelPath]);

  return <div ref={mountRef} className="w-full h-full pointer-events-auto" />;
};

export default PlanetModel;
