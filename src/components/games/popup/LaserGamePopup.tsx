import { ActiveLaserGamePopup } from "@/types/Types";
import { useLaserGame } from "../../context/LaserGameContext";
import React from "react";
import { useState, useRef } from "react";
import styles from "./LaserGamePopup.module.css";

const LaserGamePopup = ({ popup }: { popup: ActiveLaserGamePopup }) => {

    return (
        <div className={styles.box} style={{
            width: popup.width,
            height: popup.height,
            top: popup.y,
            left: popup.x,
        }}>
            <div className={styles.upperSection}>
                <div className={styles.title}>
                    {popup.title}
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
