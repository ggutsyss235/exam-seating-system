import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// The actual particle system
const ParticleNetwork = ({ step, isGenerating }) => {
    const pointsRef = useRef();
    const materialRef = useRef();

    // Generate random points in a sphere/cluster
    const count = 1500;
    const [positions, colors] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);
        const color1 = new THREE.Color('#00ff9d'); // Mint Neon
        const color2 = new THREE.Color('#00e5ff'); // Cyan Neon

        for (let i = 0; i < count; i++) {
            // Spherical distribution
            const r = 10 + Math.random() * 20;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = r * Math.cos(phi);

            // Mix colors
            const mixedColor = color1.clone().lerp(color2, Math.random());
            col[i * 3] = mixedColor.r;
            col[i * 3 + 1] = mixedColor.g;
            col[i * 3 + 2] = mixedColor.b;
        }
        return [pos, col];
    }, []);

    // Animation physics parameters
    const currentRot = useRef({ x: 0, y: 0 });
    const targetScale = useRef(1);
    const time = useRef(0);

    useFrame((state, delta) => {
        if (!pointsRef.current) return;

        time.current += delta;

        // Progressive Chat Animation:
        // As `step` increases, the target Y rotation shifts, making the user "journey" through the matrix.
        const targetY = (step * 0.4); 
        
        // isGenerating Animation:
        // Speed up the ambient spin drastically when generating
        const ambientSpeed = isGenerating ? 2.5 : 0.1;
        
        currentRot.current.y += (targetY - currentRot.current.y) * 0.05; // Smoothly lerp towards the step's angle
        pointsRef.current.rotation.y = currentRot.current.y + (time.current * ambientSpeed);
        pointsRef.current.rotation.x = Math.sin(time.current * 0.2) * 0.1; // Slow breathing wobble

        // Pulse scale when generating
        targetScale.current += ((isGenerating ? 1.05 : 1) - targetScale.current) * 0.1;
        pointsRef.current.scale.setScalar(targetScale.current);

        // Flash opacity when generating
        if (materialRef.current) {
            materialRef.current.opacity = isGenerating ? 0.8 + Math.sin(time.current * 15) * 0.2 : 0.6;
            materialRef.current.size = isGenerating ? 0.18 : 0.12;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={colors.length / 3}
                    array={colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                ref={materialRef}
                size={0.12}
                vertexColors
                transparent
                opacity={0.6}
                sizeAttenuation={true}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
};

const MatrixCore3D = ({ step = 0, isGenerating = false }) => {
    return (
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', background: '#000000' }}>
            <Canvas camera={{ position: [0, 0, 25], fov: 60 }} dpr={[1, 2]}>
                <fog attach="fog" args={['#000000', 10, 40]} />
                <ParticleNetwork step={step} isGenerating={isGenerating} />
            </Canvas>
        </div>
    );
};

export default MatrixCore3D;
