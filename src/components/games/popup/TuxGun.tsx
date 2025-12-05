import React, { useEffect, useState } from "react";
import tux from "@/assets/popups/tux.png";
import styles from "./TuxGun.module.css";
import laserShoot1 from "@/assets/sounds/laserShoot_1.wav";
import laserShoot2 from "@/assets/sounds/laserShoot_2.wav";
import laserShoot3 from "@/assets/sounds/laserShoot_3.wav";
import laserShoot4 from "@/assets/sounds/laserShoot_4.wav";


interface Laser {
    id: number;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}

interface Flash {
    id: number;
    x: number;
    y: number;
}

const TuxGun = () => {
    const [rotation, setRotation] = useState(0);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [lasers, setLasers] = useState<Laser[]>([]);
    const [flashes, setFlashes] = useState<Flash[]>([]);
    const [laserCounter, setLaserCounter] = useState(0);
    const [flashCounter, setFlashCounter] = useState(0);
    const laserSoundList = [laserShoot1, laserShoot2, laserShoot3, laserShoot4];

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Get the center of the screen
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight - 250; // Position of the tux gun
            
            // Calculate angle between center and mouse position
            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;
            const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
            
            setRotation(angle);
            setMousePosition({ x: e.clientX, y: e.clientY });
        };

        const playLaserSound = () => {
            const randomIndex = Math.floor(Math.random() * laserSoundList.length);
            const audio = new Audio(laserSoundList[randomIndex]);
            audio.play();
        }

        const handleClick = (e: MouseEvent) => {
            playLaserSound();
            // Calculate tux gun position (center bottom)
            const tuxX = window.innerWidth / 2 - 70;
            const tuxY = window.innerHeight - 250;
            
            // Create new laser
            const newLaser: Laser = {
                id: laserCounter,
                startX: tuxX,
                startY: tuxY,
                endX: e.clientX - 70,
                endY: e.clientY - 80
            };

            // Create flash at click position
            const newFlash: Flash = {
                id: flashCounter,
                x: e.clientX - 70,
                y: e.clientY - 80
            };

            setLaserCounter(prev => prev + 1);
            setFlashCounter(prev => prev + 1);
            
            // Add laser and flash
            requestAnimationFrame(() => {
                setLasers(prev => [...prev, newLaser]);
                setFlashes(prev => [...prev, newFlash]);
            });

            // Remove laser after 200ms
            setTimeout(() => {
                setLasers(prev => prev.filter(laser => laser.id !== newLaser.id));
            }, 200);

            // Remove flash after 300ms
            setTimeout(() => {
                setFlashes(prev => prev.filter(flash => flash.id !== newFlash.id));
            }, 300);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('click', handleClick);
        };
    }, [laserCounter, flashCounter]);

    return (
        <>
            {/* Render lasers */}
            {lasers.map(laser => {
                const length = Math.sqrt(
                    Math.pow(laser.endX - laser.startX, 2) + 
                    Math.pow(laser.endY - laser.startY, 2)
                );
                const angle = Math.atan2(laser.endY - laser.startY, laser.endX - laser.startX) * (180 / Math.PI);
                
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

            {/* Render flashes */}
            {flashes.map(flash => (
                <div
                    key={flash.id}
                    className={styles.flash}
                    style={{
                        left: flash.x - 15, // Center the flash (30px width / 2)
                        top: flash.y - 15,  // Center the flash (30px height / 2)
                    }}
                />
            ))}

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