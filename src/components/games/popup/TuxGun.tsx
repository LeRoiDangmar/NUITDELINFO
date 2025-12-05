import React, { useEffect, useState } from "react";
import tux from "@/assets/popups/tux.png";
import styles from "./TuxGun.module.css";

interface Laser {
    id: number;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}

const TuxGun = () => {
    const [rotation, setRotation] = useState(0);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [lasers, setLasers] = useState<Laser[]>([]);
    const [laserCounter, setLaserCounter] = useState(0);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Get the center of the screen
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight - 50; // Position of the tux gun

            // Calculate angle between center and mouse position
            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;
            const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

            setRotation(angle);
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const handleClick = (e: MouseEvent) => {
            // Calculate tux gun position (center bottom)
            const tuxX = window.innerWidth / 2 - 70;
            const tuxY = window.innerHeight - 250;

            // Create new laser
            const newLaser: Laser = {
                id: laserCounter,
                startX: tuxX,
                startY: tuxY,
                endX: e.clientX -70,
                endY: e.clientY - 80
            };

            setLaserCounter(prev => prev + 1);

            // Add a small delay to prevent the sideways flash
            requestAnimationFrame(() => {
                setLasers(prev => [...prev, newLaser]);
            });

            // Remove laser after 200ms
            setTimeout(() => {
                setLasers(prev => prev.filter(laser => laser.id !== newLaser.id));
            }, 200);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('click', handleClick);
        };
    }, [laserCounter]);

    return (
        <>
            {/* Render lasers */}
            {lasers.map(laser => {
                const deltaX = laser.endX - laser.startX;
                const deltaY = laser.endY - laser.startY;
                const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

                return (
                    <div
                        key={laser.id}
                        className={styles.laser}
                        style={{
                            left: laser.startX,
                            top: laser.startY,
                            width: `${length}px`,
                            transform: `rotate(${angle}deg)`,
                        }}
                    />
                );
            })}

            {/* Tux Gun */}
            <div
                className={styles.tuxGun}
                style={{
                    backgroundImage: `url(${tux})`,
                    transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                }}
            >
            </div>
        </>
    );
};

export default TuxGun;