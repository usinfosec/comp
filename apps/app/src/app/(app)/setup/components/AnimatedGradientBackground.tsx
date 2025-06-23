'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
uniform float u_time;
uniform float u_frequency;
uniform vec2 u_mouse;

varying vec2 vUv;
varying float vDisplacement;

// Classic Perlin 3D Noise 
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec3 P){
  vec3 Pi0 = floor(P);
  vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}

void main() {
  vUv = uv;
  
  // Create animated displacement with stronger morphing and wave patterns
  float displacement = cnoise(position + vec3(u_time * 0.2)) * 0.3;  // Reduced from 0.4 for more wave visibility
  displacement += cnoise(position * 2.0 + vec3(u_time * 0.3)) * 0.15;  // Reduced from 0.2
  
  // Primary wave patterns - these create the main flowing effect
  displacement += sin(position.x * 10.0 + u_time * 2.0) * 0.1;  // Increased from 0.08
  displacement += sin(position.y * 10.0 + u_time * 2.5) * 0.1;  // Increased speed variation
  displacement += sin(position.z * 10.0 + u_time * 3.0) * 0.1;  // More speed variation
  
  // Secondary wave patterns for complex organic flow
  displacement += sin(position.x * 5.0 - u_time * 1.5) * 0.08;  // Increased from 0.06
  displacement += sin(position.y * 5.0 - u_time * 2.0) * 0.08;
  displacement += cos(position.z * 7.0 + u_time * 1.0) * 0.06;  // Increased from 0.05
  
  // Circular wave patterns for ripple effect
  float distFromCenter = length(position.xy);
  displacement += sin(distFromCenter * 8.0 - u_time * 3.0) * 0.05;
  displacement += cos(distFromCenter * 4.0 + u_time * 2.0) * 0.04;
  
  // Add frequency-like animation without audio
  float simulatedFreq = sin(u_time * 0.5) * 0.5 + 0.5;
  displacement += simulatedFreq * 0.1;  // Reduced from 0.15
  
  // Mouse influence on displacement - keep this subtle
  vec2 mouseInfluence = u_mouse - 0.5;
  float mouseDistance = length(mouseInfluence);
  float mouseEffect = smoothstep(1.0, 0.0, mouseDistance) * 0.2;
  
  // Apply mouse distortion to create waves that follow the mouse
  displacement += mouseEffect * sin(position.x * 8.0 - u_time * 2.0 + mouseInfluence.x * 3.0) * 0.05;
  displacement += mouseEffect * sin(position.y * 8.0 - u_time * 2.0 + mouseInfluence.y * 3.0) * 0.05;
  displacement += mouseEffect * sin(position.z * 8.0 - u_time * 2.0) * 0.03;
  
  vDisplacement = displacement;
  
  vec3 newPosition = position + normal * displacement;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;

const fragmentShader = `
uniform float u_red;
uniform float u_green;
uniform float u_blue;
uniform float u_time;
uniform vec2 u_mouse;

varying vec2 vUv;
varying float vDisplacement;

void main() {
  // Create dynamic color based on displacement and time
  float intensity = pow(vDisplacement + 0.5, 2.0);
  
  // Mouse influence on color intensity
  vec2 mouseInfluence = u_mouse - 0.5;
  float mouseDistance = length(mouseInfluence);
  float mouseGlow = smoothstep(1.0, 0.0, mouseDistance) * 0.1;
  
  vec3 color = vec3(u_red, u_green, u_blue);
  
  // Add color variation based on position and time
  color.r *= 0.8 + sin(vUv.x * 10.0 + u_time) * 0.2;
  color.g *= 0.8 + sin(vUv.y * 10.0 + u_time * 1.2) * 0.2 + mouseGlow;
  color.b *= 0.8 + sin((vUv.x + vUv.y) * 10.0 + u_time * 1.5) * 0.2;
  
  color *= intensity * (1.0 + mouseGlow);
  
  gl_FragColor = vec4(color, 1.0);
}
`;

interface AnimatedOrbProps {
  scale?: number;
}

function AnimatedOrb({ scale = 1 }: AnimatedOrbProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const currentScaleRef = useRef(scale);
  const targetScaleRef = useRef(scale);
  const pulseRef = useRef(0);

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0.0 },
      u_frequency: { value: 0.0 },
      u_red: { value: 0.0 }, // Green color has minimal red
      u_green: { value: 0.5 }, // Reduced from 0.7 for less brightness
      u_blue: { value: 0.2 }, // Reduced from 0.3
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
    }),
    [],
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX / window.innerWidth;
      mouseRef.current.y = 1.0 - e.clientY / window.innerHeight; // Invert Y
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Update target scale when prop changes
  useEffect(() => {
    // Trigger a pulse when scale changes
    if (targetScaleRef.current !== scale) {
      pulseRef.current = 1;
    }
    targetScaleRef.current = scale;
  }, [scale]);

  useFrame((state) => {
    if (meshRef.current) {
      uniforms.u_time.value = state.clock.getElapsedTime();

      // Simulate frequency changes with sine waves
      uniforms.u_frequency.value = Math.sin(state.clock.getElapsedTime() * 0.5) * 50 + 50;

      // Smoothly update mouse position with slower interpolation
      uniforms.u_mouse.value.x += (mouseRef.current.x - uniforms.u_mouse.value.x) * 0.03;
      uniforms.u_mouse.value.y += (mouseRef.current.y - uniforms.u_mouse.value.y) * 0.03;

      // Camera follows mouse smoothly with reduced movement
      const targetX = (mouseRef.current.x - 0.5) * 1;
      const targetY = (mouseRef.current.y - 0.5) * 1;
      state.camera.position.x += (targetX - state.camera.position.x) * 0.02;
      state.camera.position.y += (targetY - state.camera.position.y) * 0.02;
      state.camera.lookAt(0, 0, 0);

      // Rotate the orb based on mouse position with reduced sensitivity
      meshRef.current.rotation.y +=
        ((mouseRef.current.x - 0.5) * 0.5 - meshRef.current.rotation.y) * 0.02;
      meshRef.current.rotation.x +=
        ((mouseRef.current.y - 0.5) * 0.5 - meshRef.current.rotation.x) * 0.02;

      // Smooth scale transition with easing for non-jumpy growth
      // Use an ease-in-out curve for smoother transitions
      const scaleDiff = targetScaleRef.current - currentScaleRef.current;
      const easeAmount = Math.abs(scaleDiff) > 0.01 ? 0.04 : 0.08; // Slower when far, faster when close
      currentScaleRef.current += scaleDiff * easeAmount;

      // Decay pulse effect more slowly for better visibility
      pulseRef.current *= 0.98; // Even slower decay

      // Breathing effect on top of the smooth scale, with very subtle pulse
      const breathingScale =
        currentScaleRef.current *
        (1 + Math.sin(state.clock.getElapsedTime() * 2) * 0.03 + pulseRef.current * 0.03); // Even more subtle
      meshRef.current.scale.setScalar(breathingScale);

      // Very subtle glow during pulse
      uniforms.u_green.value = 0.5 + pulseRef.current * 0.05; // Updated base value to 0.5
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[4, 30]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        wireframe={true}
        transparent={true}
        opacity={0.05}
      />
    </mesh>
  );
}

interface AnimatedGradientBackgroundProps {
  scale?: number;
}

export function AnimatedGradientBackground({ scale = 1 }: AnimatedGradientBackgroundProps) {
  return (
    <div className="fixed inset-0 -z-10 opacity-20 bg-background">
      <Canvas
        camera={{
          position: [0, -2, 14],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <AnimatedOrb scale={scale} />
        <EffectComposer>
          <Bloom
            intensity={0.3} // Reduced from 0.5
            luminanceThreshold={0.6} // Increased from 0.5
            luminanceSmoothing={0.8}
            radius={0.6} // Reduced from 0.8
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
