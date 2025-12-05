import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ActiveLaserGamePopup, LaserGamePopupType } from "@/types/Types";
import { useLaserGame } from "../context/LaserGameContext";
import LaserGamePopup from "./popup/LaserGamePopup";

import reactImage from "@/assets/popups/react.png";


interface LaserProps {
}

const LaserGame = () => {
    const { popupList, setPopupList, gameInterval, setGameInterval, sanityLeft } = useLaserGame();

    const [availablePopups, setAvailablePopups] = useState<LaserGamePopupType[]>([
        {
            id: 1,
            height: 200,
            width: 350,
            title: "Pack Office",
            desc: "Ta licence office arrive à expiration, renouvèle la vite !",
            isEvil: true,
            image: reactImage
        },
        {
            id: 2,
            height: 200,
            width: 350,
            title: "Windows Update",
            desc: "Votre système d'exploitation a besoin de se mettre à jour.",
            isEvil: true,
            image: reactImage
        },
        {
            id: 3,
            height: 200,
            width: 350,
            title: "Norton 360",
            desc: "Votre système n'est pas protégé, installez Norton 360 maintenant !",
            isEvil: true,
            image: reactImage
        },
        {
            id: 4,
            height: 200,
            width: 350,
            title: "Google Drive",
            desc: "Votre espacee de stockage est presque saturé ! Augmentez sa taille en souscrivant à un abonnement.",
            isEvil: true,
            image: reactImage
        },
        {
            id: 5,
            height: 200,
            width: 350,
            title: "Linux",
            desc: "Rejoignez des millions d'utilisateurs et optez pour l'OS open source le plus populaire !",
            isEvil: false,
            image: reactImage
        },
        {
            id: 6,
            height: 200,
            width: 350,
            title: "Open Office",
            desc: "Une alternative gratuite et open source à Microsoft Office.",
            isEvil: false,
            image: reactImage
        },
        {
            id: 7,
            height: 200,
            width: 350,
            title: "VLC Media Player",
            desc: "Un lecteur multimédia gratuit et open source qui prend en charge une large gamme de formats audio et vidéo.",
            isEvil: false,
            image: reactImage
        },
        {
            id: 8,
            height: 200,
            width: 350,
            title: "GIMP",
            desc: "Un logiciel de retouche d'image gratuit et open source, souvent comparé à Adobe Photoshop.",
            isEvil: false,
            image: reactImage
        },
        {
            id: 9,
            height: 200,
            width: 350,
            title: "Mozilla Firefox",
            desc: "Un navigateur web open source axé sur la confidentialité et la personnalisation.",
            isEvil: false,
            image: reactImage
        },
        {
            id: 10,
            height: 200,
            width: 350,
            title: "Suite Adobe",
            desc: "Optez pour une licence professionnelle pour accéder à l'ensemble des outils créatifs d'Adobe.",
            isEvil: true,
            image: reactImage
        },
        {
            id: 11,
            height: 200,
            width: 350,
            title: "IOS",
            desc: "Découvrez l'univers Apple avec iOS, le système d'exploitation mobile le plus fermé au monde.",
            isEvil: true,
            image: reactImage
        }
    ])

    const selectRandomPopup = () => {
        if (availablePopups.length === 0) return null;
        const randomIndex = Math.floor(Math.random() * availablePopups.length);
        return availablePopups[randomIndex];
    }

    let timeElapsed = 0;

    let index = 1;

    //loop every second unitl sanityLeft is 0
    const gameLoop = () => {
        setGameInterval(setInterval(() => {
            timeElapsed += 1;
            //every 2 seconds add a new popup
            if (timeElapsed % 2 === 0) {
                const newPopup = selectRandomPopup();
                if (newPopup) {
                    const activePopup: ActiveLaserGamePopup = {
                        ...newPopup,
                        x: Math.random() * (window.innerWidth - newPopup.width),
                        y: Math.random() * (window.innerHeight - newPopup.height),
                        pointLoss: newPopup.isEvil ? 50 : -30,
                        actionDelay: 3,
                        id: index
                    }
                    index++;
                    setPopupList((prev) => [...prev, activePopup]);
                }
            }
            
            //end game if sanityLeft is 0
            if (sanityLeft <= 0) {
                clearInterval(gameInterval);
            }
        }, 1000));
    }

    useEffect(() => {
        gameLoop();
    }, []);

    return (
        <>
        <div>
            Laser Game Active : {sanityLeft}
        </div>
            {popupList.map((popup) => (
                <LaserGamePopup
                    key={`popup-${popup.id}`}
                    popup={popup}
                />
            ))}
        </>
    )
}

export default LaserGame;
