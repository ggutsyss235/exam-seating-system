import React, { useRef, useState, useEffect } from 'react';

/**
 * A highly tactile 3D button component.
 * Instead of rotating an entire page (which causes the button to shift away from the mouse pointer),
 * this button applies a focused, localized 3D tilt tracking only the cursor's relation to its center.
 * It provides instant tactile feedback, deep shadows, and neon aesthetics without breaking hitboxes.
 */
const MagneticButton3D = ({ 
    children, 
    onClick, 
    className = '',
    style = {},
    glowColor = 'rgba(0, 255, 157, 0.4)', // Default Mint Neon
    baseColor = '#ffffff', 
    textColor = '#000000',
    intensity = 15 // Max rotation in degrees
}) => {
    const buttonRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    
    // Physics state
    const currentRot = useRef({ x: 0, y: 0 });
    const targetRot = useRef({ x: 0, y: 0 });

    useEffect(() => {
        let animationFrameId;

        const animate = () => {
            // Spring interpolation for buttery smooth tilt
            currentRot.current.x += (targetRot.current.x - currentRot.current.x) * 0.15;
            currentRot.current.y += (targetRot.current.y - currentRot.current.y) * 0.15;

            if (buttonRef.current) {
                // If pressed, flatten it down. If hovered, lift it up and tilt it. 
                const zOffset = isPressed ? -2 : (isHovered ? 12 : 0);
                
                buttonRef.current.style.transform = `
                    perspective(800px)
                    rotateX(${currentRot.current.x}deg)
                    rotateY(${currentRot.current.y}deg)
                    translateZ(${zOffset}px)
                `;

                // Dynamic shadow based on tilt
                if (isHovered && !isPressed) {
                    const shadowY = 8 + currentRot.current.x * 0.5;
                    const shadowX = -currentRot.current.y * 0.5;
                    buttonRef.current.style.boxShadow = `
                        ${shadowX}px ${shadowY}px 20px ${glowColor},
                        0 2px 4px rgba(0,0,0,0.5)
                    `;
                } else if (isPressed) {
                    buttonRef.current.style.boxShadow = `
                        0 2px 5px ${glowColor},
                        0 1px 2px rgba(0,0,0,0.8)
                    `;
                } else {
                    buttonRef.current.style.boxShadow = `0 4px 15px rgba(255, 255, 255, 0.15)`;
                }
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(animationFrameId);
    }, [isHovered, isPressed, glowColor]);

    const handleMouseMove = (e) => {
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        
        // Calculate mouse position relative to center of button (-1 to 1)
        const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

        // Invert Y for correct CSS rotateX feeling, standard X for rotateY
        targetRot.current.y = x * intensity;
        targetRot.current.x = -y * intensity;
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setIsPressed(false);
        targetRot.current = { x: 0, y: 0 };
    };

    return (
        <button
            ref={buttonRef}
            onClick={onClick}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            className={`magnetic-btn-3d ${className}`}
            style={{
                ...style,
                position: 'relative',
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                gap: '0.6rem',
                padding: '1rem 2.2rem', 
                fontSize: '1rem', 
                fontWeight: '800', // Heavy stark font
                backgroundColor: baseColor, 
                color: textColor,
                borderRadius: '999px', 
                border: 'none', 
                cursor: 'pointer',
                transformStyle: 'preserve-3d',
                // We handle transitions via JS, but we transition background/color via CSS
                transition: 'background-color 0.3s ease, color 0.3s ease',
                textShadow: 'none', // Prevent black shadow if button is white
                zIndex: isHovered ? 50 : 1 // Elevate on hover
            }}
        >
            <span style={{ 
                transform: 'translateZ(10px)', // Lift text slightly off the physical button
                display: 'inline-flex',
                alignItems: 'center',
                gap: 'inherit'
            }}>
                {children}
            </span>
        </button>
    );
};

export default MagneticButton3D;
