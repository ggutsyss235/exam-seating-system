import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ── Particle field ──────────────────────────────────────────────────
function Particles({ count = 1800 }) {
    const mesh = useRef();

    const [positions, colors] = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 40;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 25;

            // Random between violet and cyan
            const t = Math.random();
            colors[i * 3] = 0.55 - t * 0.35;   // R
            colors[i * 3 + 1] = 0.36 + t * 0.27;   // G
            colors[i * 3 + 2] = 0.97;               // B
        }
        return [positions, colors];
    }, [count]);

    useFrame(({ clock }) => {
        if (!mesh.current) return;
        mesh.current.rotation.y = clock.elapsedTime * 0.03;
        mesh.current.rotation.x = Math.sin(clock.elapsedTime * 0.02) * 0.08;
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                <bufferAttribute attach="attributes-color" args={[colors, 3]} />
            </bufferGeometry>
            <pointsMaterial
                size={0.055}
                vertexColors
                transparent
                opacity={0.75}
                sizeAttenuation
            />
        </points>
    );
}

// ── Floating ring ───────────────────────────────────────────────────
function FloatingRing({ radius = 4, color = '#8b5cf6', speed = 0.3, tiltX = 0.6, delay = 0 }) {
    const ref = useRef();
    useFrame(({ clock }) => {
        if (!ref.current) return;
        const t = clock.elapsedTime + delay;
        ref.current.rotation.z = t * speed;
        ref.current.rotation.x = tiltX + Math.sin(t * 0.4) * 0.12;
        ref.current.position.y = Math.sin(t * 0.5) * 0.4;
    });
    return (
        <mesh ref={ref} rotation={[tiltX, 0, 0]}>
            <torusGeometry args={[radius, 0.015, 16, 200]} />
            <meshBasicMaterial color={color} transparent opacity={0.35} />
        </mesh>
    );
}

// ── Floating icosahedron ────────────────────────────────────────────
function FloatingOrb({ position, color, speed }) {
    const ref = useRef();
    useFrame(({ clock }) => {
        if (!ref.current) return;
        const t = clock.elapsedTime * speed;
        ref.current.rotation.x = t;
        ref.current.rotation.y = t * 0.8;
        ref.current.position.y = position[1] + Math.sin(t) * 0.3;
    });
    return (
        <mesh ref={ref} position={position}>
            <icosahedronGeometry args={[0.18, 1]} />
            <meshBasicMaterial color={color} wireframe />
        </mesh>
    );
}

// ── Scene root ──────────────────────────────────────────────────────
function Scene() {
    return (
        <>
            <Particles count={1800} />

            {/* Concentric rings */}
            <FloatingRing radius={5.5} color="#8b5cf6" speed={0.25} tiltX={0.5} delay={0} />
            <FloatingRing radius={6.8} color="#0ea5e9" speed={0.15} tiltX={-0.4} delay={2} />
            <FloatingRing radius={4.2} color="#6366f1" speed={0.35} tiltX={1.0} delay={1} />

            {/* Small floating wireframe orbs */}
            <FloatingOrb position={[-6, 1.2, -4]} color="#a855f7" speed={0.6} />
            <FloatingOrb position={[6, -1.5, -3]} color="#0ea5e9" speed={0.5} />
            <FloatingOrb position={[-4, -2.0, -6]} color="#6366f1" speed={0.7} />
            <FloatingOrb position={[4, 2.5, -5]} color="#8b5cf6" speed={0.4} />
            <FloatingOrb position={[0, -2.8, -2]} color="#22d3ee" speed={0.55} />
        </>
    );
}

// ── Exported canvas wrapper ─────────────────────────────────────────
export default function HeroCanvas3D() {
    return (
        <div style={{
            position: 'absolute', inset: 0,
            zIndex: 0, pointerEvents: 'none',
        }}>
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
