import { ActiveLaserGamePopup } from "@/types/Types";
import { useLaserGame } from "../../context/LaserGameContext";
import React, { useEffect } from "react";
import { useState, useRef } from "react";
import styles from "./LaserGamePopup.module.css";
import closeButton from "@/assets/popups/closeButton.png";
 

const LaserGamePopup = ({ popup }: { popup: ActiveLaserGamePopup }) => {
    const { setPopupList, setSanityLeft , sanityLeft } = useLaserGame();

    const handleDestroy = () => {
        setPopupList((prev) => prev.filter((p) => p.id !== popup.id)); 
    }

    const handleCloseClick = () => {
        if (!popup.isEvil)
            setSanityLeft(popup.pointLoss);
        handleDestroy();
    }

    useEffect(() => {
        console.log("Popup mounted, will destroy in", popup.actionDelay, "seconds");
        const timeout = setTimeout(() => {
            console.log("I'm destroying myself");
            if (popup.isEvil) {
                console.log("Losing sanity:", popup.pointLoss);
                setSanityLeft(-popup.pointLoss);
            }
            handleDestroy();
        }, popup.actionDelay * 1000);
    
        return () => {
            clearTimeout(timeout);
        };
    }, []);
    

    return (
        <div
            className={styles.box}
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
