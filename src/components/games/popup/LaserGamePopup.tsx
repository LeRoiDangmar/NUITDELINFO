import { ActiveLaserGamePopup } from "@/types/Types";
import { useLaserGame } from "../../context/LaserGameContext";
import React, { useEffect, useState } from "react";
import styles from "./LaserGamePopup.module.css";
import closeButton from "@/assets/popups/closeButton.png";
 

const LaserGamePopup = ({ popup }: { popup: ActiveLaserGamePopup }) => {
    const { setPopupList, setSanityLeft, sanityLeft } = useLaserGame();
    const [isVisible, setIsVisible] = useState(false);
    const [disappearingType, setDisappearingType] = useState<'none' | 'good' | 'bad'>('none');

    const handleDestroy = (isGoodAction: boolean) => {
        setDisappearingType(isGoodAction ? 'good' : 'bad');
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