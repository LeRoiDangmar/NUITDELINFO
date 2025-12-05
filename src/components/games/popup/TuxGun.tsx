import React, { useEffect, useState } from "react";
import tux from "@/assets/popups/tux.png";

const TuxGun = () => {
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Get the center of the screen
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight - 100; // Slightly above bottom edge
            
            // Calculate angle between center and mouse position
            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;
            const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
            
            setRotation(angle);
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div style={{
            position: 'absolute',
            top: 'calc(100% + -50px)',
            left: '50%',
            transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
            width: '100px',
            height: '100px',
            backgroundImage: `url(${tux})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            zIndex: 1000,
        }}>
        </div>
    );
};

export default TuxGun;