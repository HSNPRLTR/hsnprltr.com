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
}

const PlanetModel: React.FC<PlanetModelProps> = ({ modelPath, onHoverChange, baseScale = 2.8, hoverRadius = 0.85, isInteractive = true }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const raycaster = useRef(new THREE.Raycaster());
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
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 3);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const spotLight = new THREE.SpotLight(0xffffff, 2);
    spotLight.position.set(-5, 5, 2);
    scene.add(spotLight);

    let isCurrentlyHovered = false;

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

    const animate = () => {
      const animationId = requestAnimationFrame(animate);
      if (modelRef.current && mountRef.current) {
        // Slow down rotation on hover, rotating diagonally (both Y and X axes)
        const rotationSpeedY = isCurrentlyHovered ? 0.0004 : 0.002;
        const rotationSpeedX = isCurrentlyHovered ? 0.0002 : 0.001;
        modelRef.current.rotation.y += rotationSpeedY;
        modelRef.current.rotation.x += rotationSpeedX;

        // Recalculate relative coordinates dynamically using the latest bounding box.
        // This ensures hover detection remains accurate even when the canvas moves or scales
        // under a motionless mouse pointer.
        const rect = mountRef.current.getBoundingClientRect();
        const mx = ((clientMouse.current.x - rect.left) / rect.width) * 2 - 1;
        const my = -((clientMouse.current.y - rect.top) / rect.height) * 2 + 1;

        const distanceToCenter = Math.sqrt(mx * mx + my * my);
        const isHovered = isInteractiveRef.current && (distanceToCenter < hoverRadius);



        if (isHovered !== isCurrentlyHovered) {
          isCurrentlyHovered = isHovered;
          if (hoverCallbackRef.current) hoverCallbackRef.current(isHovered);
          mountRef.current!.style.cursor = isHovered ? "pointer" : "default";
        }
      }
      renderer.render(scene, camera);
      return animationId;
    };

    const animationId = animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;
      renderer.setSize(newWidth, newHeight);
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (mountRef.current) {
        if (renderer.domElement) {
          mountRef.current.removeChild(renderer.domElement);
        }
      }
      cancelAnimationFrame(animationId);
      modelRef.current = null;
      scene.clear();
      renderer.dispose();
    };
  }, [modelPath]);

  return <div ref={mountRef} className="w-full h-full pointer-events-auto" />;
};

export default PlanetModel;
