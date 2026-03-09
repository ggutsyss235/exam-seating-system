import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Shared smooth mouse ref — updated from parent via prop
const mouseRef = { x: 0, y: 0, tx: 0, ty: 0 };

// ── Camera tracks the mouse smoothly ────────────────────────────────
function CameraRig() {
    const { camera } = useThree();
    useFrame(() => {
        // Lerp toward target for silky smooth feel
        mouseRef.tx += (mouseRef.x - mouseRef.tx) * 0.04;
        mouseRef.ty += (mouseRef.y - mouseRef.ty) * 0.04;
        camera.position.x += (mouseRef.tx * 2.5 - camera.position.x) * 0.06;
        camera.position.y += (-mouseRef.ty * 1.5 - camera.position.y) * 0.06;
        camera.lookAt(0, 0, 0);
    });
    return null;
}

// ── Particle field — shifts with mouse ──────────────────────────────
function Particles({ count = 1800 }) {
    const mesh = useRef();
    const [positions, colors] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 45;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
            const t = Math.random();
            col[i * 3] = 0.55 - t * 0.35;
            col[i * 3 + 1] = 0.36 + t * 0.27;
            col[i * 3 + 2] = 0.97;
        }
        return [pos, col];
    }, [count]);

    useFrame(({ clock }) => {
        if (!mesh.current) return;
        // Base auto-rotation + mouse tilt
        mesh.current.rotation.y = clock.elapsedTime * 0.025 + mouseRef.tx * 0.15;
        mesh.current.rotation.x = Math.sin(clock.elapsedTime * 0.018) * 0.06 - mouseRef.ty * 0.1;
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                <bufferAttribute attach="attributes-color" args={[colors, 3]} />
            </bufferGeometry>
            <pointsMaterial size={0.055} vertexColors transparent opacity={0.7} sizeAttenuation />
        </points>
    );
}

// ── Ring that leans toward the mouse ────────────────────────────────
function FloatingRing({ radius, color, speed, baseTiltX, delay = 0, mouseInfluence = 1 }) {
    const ref = useRef();
    useFrame(({ clock }) => {
        if (!ref.current) return;
        const t = clock.elapsedTime + delay;
        // Auto spin
        ref.current.rotation.z = t * speed;
        // Lean toward mouse: X axis controlled by mouseY, Y axis by mouseX
        ref.current.rotation.x = baseTiltX + Math.sin(t * 0.35) * 0.1 + mouseRef.ty * mouseInfluence * 0.5;
        ref.current.rotation.y = mouseRef.tx * mouseInfluence * 0.4;
        ref.current.position.y = Math.sin(t * 0.45) * 0.3;
    });
    return (
        <mesh ref={ref} rotation={[baseTiltX, 0, 0]}>
            <torusGeometry args={[radius, 0.013, 16, 200]} />
            <meshBasicMaterial color={color} transparent opacity={0.35} />
        </mesh>
    );
}

// ── Wireframe orb that orbits the mouse-shifted position ─────────────
function FloatingOrb({ position, color, speed }) {
    const ref = useRef();
    useFrame(({ clock }) => {
        if (!ref.current) return;
        const t = clock.elapsedTime * speed;
        ref.current.rotation.x = t;
        ref.current.rotation.y = t * 0.7;
        // Parallax offset — closer orbs shift more with the mouse
        ref.current.position.x = position[0] + mouseRef.tx * -1.2;
        ref.current.position.y = position[1] + Math.sin(t * 0.8) * 0.3 + mouseRef.ty * 0.8;
        ref.current.position.z = position[2];
    });
    return (
        <mesh ref={ref} position={position}>
            <icosahedronGeometry args={[0.2, 1]} />
            <meshBasicMaterial color={color} wireframe />
        </mesh>
    );
}

// ── Scene root ───────────────────────────────────────────────────────
function Scene() {
    return (
        <>
            <CameraRig />
            <Particles count={1800} />

            <FloatingRing radius={5.5} color="#8b5cf6" speed={0.22} baseTiltX={0.5} delay={0} mouseInfluence={1} />
            <FloatingRing radius={7.0} color="#0ea5e9" speed={0.13} baseTiltX={-0.4} delay={2} mouseInfluence={0.6} />
            <FloatingRing radius={4.2} color="#6366f1" speed={0.32} baseTiltX={1.0} delay={1} mouseInfluence={1.4} />

            <FloatingOrb position={[-6, 1.2, -4]} color="#a855f7" speed={0.6} />
            <FloatingOrb position={[6, -1.5, -3]} color="#0ea5e9" speed={0.5} />
            <FloatingOrb position={[-4, -2.0, -6]} color="#6366f1" speed={0.7} />
            <FloatingOrb position={[4, 2.5, -5]} color="#8b5cf6" speed={0.4} />
            <FloatingOrb position={[0, -2.8, -2]} color="#22d3ee" speed={0.55} />
        </>
    );
}

// ── Exported canvas — accepts mouse prop ────────────────────────────
export default function HeroCanvas3D({ mouse }) {
    // Sync incoming mouse prop to the shared ref
    useEffect(() => {
        if (mouse) {
            mouseRef.x = mouse.x;
            mouseRef.y = mouse.y;
        }
    }, [mouse]);

    return (
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
            <Canvas
                camera={{ position: [0, 0, 10], fov: 60 }}
                gl={{ antialias: true, alpha: true }}
                style={{ background: 'transparent' }}
            >
                <Scene />
            </Canvas>
        </div>
    );
}
