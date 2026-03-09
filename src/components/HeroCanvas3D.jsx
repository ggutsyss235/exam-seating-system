import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

// ── Particle field ─────────────────────────────────────────────────
function Particles({ count = 1600 }) {
    const mesh = useRef();
    const [positions, colors] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 50;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 25;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
            const t = Math.random();
            col[i * 3] = 0.45 + t * 0.25;
            col[i * 3 + 1] = 0.3 + t * 0.3;
            col[i * 3 + 2] = 0.98;
        }
        return [pos, col];
    }, [count]);

    useFrame(({ clock }) => {
        if (!mesh.current) return;
        mesh.current.rotation.y = clock.elapsedTime * 0.025;
    });

    return (
        <points ref={mesh}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                <bufferAttribute attach="attributes-color" args={[colors, 3]} />
            </bufferGeometry>
            <pointsMaterial size={0.05} vertexColors transparent opacity={0.65} sizeAttenuation />
        </points>
    );
}

// ── Concentric ring ────────────────────────────────────────────────
function Ring({ radius, color, speed, tiltX, tiltZ = 0, delay = 0 }) {
    const ref = useRef();
    useFrame(({ clock }) => {
        const t = clock.elapsedTime + delay;
        ref.current.rotation.z = t * speed;
        ref.current.rotation.x = tiltX + Math.sin(t * 0.35) * 0.1;
        ref.current.position.y = Math.sin(t * 0.4) * 0.25;
    });
    return (
        <mesh ref={ref} rotation={[tiltX, 0, tiltZ]}>
            <torusGeometry args={[radius, 0.013, 16, 200]} />
            <meshBasicMaterial color={color} transparent opacity={0.32} />
        </mesh>
    );
}

// ── Floating wireframe orb ─────────────────────────────────────────
function WireOrb({ position, color, speed }) {
    const ref = useRef();
    useFrame(({ clock }) => {
        const t = clock.elapsedTime * speed;
        ref.current.rotation.x = t;
        ref.current.rotation.y = t * 0.7;
        ref.current.position.y = position[1] + Math.sin(t * 0.9) * 0.25;
    });
    return (
        <mesh ref={ref} position={position}>
            <icosahedronGeometry args={[0.16, 1]} />
            <meshBasicMaterial color={color} wireframe />
        </mesh>
    );
}

// ── 3D Text: SeatPro ──────────────────────────────────────────────
function SeatProText() {
    const ref = useRef();
    const outline1 = useRef(); // chromatic blue layer
    const outline2 = useRef(); // chromatic violet layer

    useFrame(({ clock }) => {
        const t = clock.elapsedTime;
        // Gentle float + subtle sway
        ref.current.position.y = Math.sin(t * 0.5) * 0.08 + 0.45;
        outline1.current.position.y = Math.sin(t * 0.5) * 0.08 + 0.45;
        outline2.current.position.y = Math.sin(t * 0.5) * 0.08 + 0.45;

        // Shimmer: cycle emissive intensity
        const shimmer = 0.4 + Math.sin(t * 1.8) * 0.35;
        if (ref.current.material) {
            ref.current.material.emissiveIntensity = shimmer;
        }
        // Chromatic offset drift
        const drift = Math.sin(t * 0.7) * 0.015;
        outline1.current.position.x = drift;
        outline2.current.position.x = -drift;
    });

    const textProps = {
        font: 'https://fonts.gstatic.com/s/outfit/v4/QGYyz_MVcBeNP4NjuGObqx1XmO1I4TC0C4G-EiAou6Y.woff',
        fontSize: 1.45,
        letterSpacing: -0.04,
        anchorX: 'center',
        anchorY: 'middle',
    };

    return (
        <group>
            {/* Chromatic blue ghost — slightly offset */}
            <Text ref={outline1} {...textProps} position={[0.02, 0.45, -0.06]} fillOpacity={0.18} strokeOpacity={0} >
                SeatPro
                <meshBasicMaterial color="#38bdf8" transparent />
            </Text>

            {/* Chromatic violet ghost */}
            <Text ref={outline2} {...textProps} position={[-0.02, 0.45, -0.06]} fillOpacity={0.18} strokeOpacity={0}>
                SeatPro
                <meshBasicMaterial color="#a855f7" transparent />
            </Text>

            {/* Main metallic fill */}
            <Text
                ref={ref}
                {...textProps}
                position={[0, 0.45, 0]}
                fillOpacity={1}
                strokeOpacity={1}
                strokeWidth={0.008}
                strokeColor="#c4b5fd"
            >
                SeatPro
                <meshStandardMaterial
                    color="#e2e8f0"
                    emissive="#8b5cf6"
                    emissiveIntensity={0.5}
                    metalness={0.8}
                    roughness={0.15}
                />
            </Text>
        </group>
    );
}

// ── 3D Text: X ────────────────────────────────────────────────────
function XText() {
    const ref = useRef();
    const glowRef = useRef();

    useFrame(({ clock }) => {
        const t = clock.elapsedTime;
        const y = Math.sin(t * 0.5) * 0.08 - 0.72;
        ref.current.position.y = y;
        glowRef.current.position.y = y;

        // Neon pulse
        const pulse = 0.8 + Math.sin(t * 2.2) * 0.6;
        if (ref.current.material) ref.current.material.emissiveIntensity = pulse;
        if (glowRef.current.material) glowRef.current.material.emissiveIntensity = pulse * 0.4;
    });

    const xProps = {
        font: 'https://fonts.gstatic.com/s/outfit/v4/QGYyz_MVcBeNP4NjuGObqx1XmO1I4TC0C4G-EiAou6Y.woff',
        fontSize: 2.1,
        letterSpacing: -0.05,
        anchorX: 'center',
        anchorY: 'middle',
    };

    return (
        <group>
            {/* Neon bloom glow layer */}
            <Text ref={glowRef} {...xProps} position={[0, -0.72, -0.12]} fillOpacity={0.25} strokeOpacity={0}>
                X
                <meshBasicMaterial color="#0ea5e9" transparent />
            </Text>
            {/* Main neon X */}
            <Text
                ref={ref}
                {...xProps}
                position={[0, -0.72, 0]}
                fillOpacity={1}
                strokeOpacity={1}
                strokeWidth={0.012}
                strokeColor="#7dd3fc"
            >
                X
                <meshStandardMaterial
                    color="#38bdf8"
                    emissive="#0ea5e9"
                    emissiveIntensity={1.0}
                    metalness={0.3}
                    roughness={0.05}
                />
            </Text>
        </group>
    );
}

// ── Lights ─────────────────────────────────────────────────────────
function Lights() {
    return (
        <>
            <ambientLight intensity={0.3} />
            <pointLight position={[0, 4, 6]} intensity={2} color="#a855f7" />
            <pointLight position={[0, -4, 6]} intensity={2} color="#0ea5e9" />
            <pointLight position={[-8, 0, 4]} intensity={1} color="#6366f1" />
        </>
    );
}

// ── Scene ──────────────────────────────────────────────────────────
function Scene() {
    return (
        <>
            <Lights />
            <Particles count={1600} />
            <SeatProText />
            <XText />

            <Ring radius={5.5} color="#8b5cf6" speed={0.22} tiltX={0.5} delay={0} />
            <Ring radius={7.0} color="#0ea5e9" speed={0.13} tiltX={-0.4} delay={2} />
            <Ring radius={4.0} color="#6366f1" speed={0.32} tiltX={1.0} delay={1} />

            <WireOrb position={[-6.5, 1, -4]} color="#a855f7" speed={0.6} />
            <WireOrb position={[6.5, -1, -3]} color="#0ea5e9" speed={0.5} />
            <WireOrb position={[-4, -2, -6]} color="#6366f1" speed={0.7} />
            <WireOrb position={[4, 2, -5]} color="#8b5cf6" speed={0.4} />
        </>
    );
}

// ── Exported canvas ────────────────────────────────────────────────
export default function HeroCanvas3D() {
    return (
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
            <Canvas
                camera={{ position: [0, 0, 8], fov: 55 }}
                gl={{ antialias: true, alpha: true }}
                style={{ background: 'transparent' }}
            >
                <Scene />
            </Canvas>
        </div>
    );
}
