import { ActiveLaserGamePopup } from "@/types/Types";
import { useLaserGame } from "../../context/LaserGameContext";
import React from "react";
import { useState, useRef } from "react";
import styles from "./LaserGamePopup.module.css";

const LaserGamePopup = ({ popup }: { popup: ActiveLaserGamePopup }) => {

    return (
        <div className="">
            <div className={styles.title}>
                    {popup.title}
            </div>
        </div>
    )
}

export default LaserGamePopup;
