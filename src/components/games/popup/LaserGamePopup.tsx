import { ActiveLaserGamePopup } from "@/types/Types";
import { useLaserGame } from "../../context/LaserGameContext";
import React, { useEffect, useState } from "react";
import styles from "./LaserGamePopup.module.css";
import closeButton from "@/assets/popups/closeButton.png";

import hitHurt_1 from "@/assets/sounds/hitHurt_1.wav";
import hitHurt_2 from "@/assets/sounds/hitHurt_2.wav";
import hitHurt_3 from "@/assets/sounds/hitHurt_3.wav";
import hitHurt_4 from "@/assets/sounds/hitHurt_4.wav";

import synth_1 from "@/assets/sounds/synth_1.wav";
import synth_2 from "@/assets/sounds/synth_2.wav";
import synth_3 from "@/assets/sounds/synth_3.wav";

const LaserGamePopup = ({ popup }: { popup: ActiveLaserGamePopup }) => {
    const { setPopupList, setSanityLeft, sanityLeft } = useLaserGame();
    const [isVisible, setIsVisible] = useState(false);
    const [disappearingType, setDisappearingType] = useState<'none' | 'good' | 'bad'>('none');

    const badSoundList = [hitHurt_1, hitHurt_2, hitHurt_3, hitHurt_4];
    const goodSoundList = [synth_1, synth_2, synth_3];

    const playSound = (isGoodAction: boolean) => {
        const soundList = isGoodAction ? goodSoundList : badSoundList;
        const randomIndex = Math.floor(Math.random() * soundList.length);
        const audio = new Audio(soundList[randomIndex]);
        audio.play();
    };

    const handleDestroy = (isGoodAction: boolean) => {
        setDisappearingType(isGoodAction ? 'good' : 'bad');
        playSound(isGoodAction);
        setTimeout(() => {
            setPopupList((prev) => prev.filter((p) => p.id !== popup.id));
        }, 300); // Wait for animation to complete
    }

    const handleCloseClick = () => {
        // Good action: evil popup clicked OR non-evil popup closed manually
        const isGoodAction = popup.isEvil;
        
        if (!popup.isEvil) {
            // Clicking non-evil popup is bad (loses points)
            setSanityLeft(popup.pointLoss);
        }
        
        handleDestroy(isGoodAction);
    }

    useEffect(() => {
        // Trigger appearing animation
        setTimeout(() => setIsVisible(true), 10);

        const timeout = setTimeout(() => {
            if (popup.isEvil) {
                // Evil popup disappeared naturally (bad action)
                setSanityLeft(-popup.pointLoss);
                handleDestroy(false);
            } else {
                // Non-evil popup disappeared naturally (good action)
                handleDestroy(true);
            }
        }, popup.actionDelay * 1000);
    
        return () => {
            clearTimeout(timeout);
        };
    }, []);

    const getDisappearingClass = () => {
        if (disappearingType === 'good') return styles.disappearingGood;
        if (disappearingType === 'bad') return styles.disappearingBad;
        return '';
    };
    

    return (
        <div
            className={`${styles.box} ${isVisible && disappearingType === 'none' ? styles.appearing : ''} ${getDisappearingClass()}`}
            style={{
                width: popup.width,
                height: popup.height,
                top: popup.y,
                left: popup.x,
            }}
            onClick={handleCloseClick}
        >
            <div className={styles.upperSection}>
                <div className={styles.title}>
                    {popup.title}
                </div>
                <div>

                </div>
                <div className={styles.closeButton}>
                    <img src={closeButton} className={styles.closeButtonImg}/>
                </div>
            </div>
            <div className={styles.lowerSection}>
                <img className={styles.image} src={popup.image} alt={popup.title}>
                    
                </img>
                <div className={styles.description}>
                    {popup.desc}
                </div>

            </div>
        </div>
    )
}

export default LaserGamePopup;