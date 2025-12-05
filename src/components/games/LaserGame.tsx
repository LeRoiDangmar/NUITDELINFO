import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ActiveLaserGamePopup, LaserGamePopupType } from "@/types/Types";
import { useLaserGame } from "../context/LaserGameContext";
import LaserGamePopup from "./popup/LaserGamePopup";

import reactImage from "@/assets/popups/react.png";
import { set } from "date-fns";
import TuxGun from "./popup/TuxGun";


const LaserGame = () => {
    const { popupList, setPopupList, gameInterval, setGameInterval, sanityLeft, setSanityLeft } = useLaserGame();
    const [timer, setTimer] = useState(0);
    const [gameActive, setGameActive] = useState(true);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setSanityLeft(-sanityLeft);
        setSanityLeft(1000);

        // Start timer
        timerRef.current = setInterval(() => {
            setTimer(prev => prev + 0.01);
        }, 10);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (sanityLeft <= 0 && gameActive) {
            setGameActive(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
                clearInterval(gameInterval);
                setPopupList([]);
            }
        }
    }, [sanityLeft, gameActive]);

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
        return { ...availablePopups[randomIndex] };
    }

    let timeElapsed = 0;

    let index = 1;

    //loop every second unitl sanityLeft is 0
    const gameLoop = () => {
        let meanPopup = 0.5;
        let timeToDisappear = 6;
        let timeToAttack = 4;
        let damage = 50;

        setGameInterval(setInterval(() => {
            timeElapsed += 1;

            let popupCount = Math.floor(meanPopup);
            //get random between 0 and 1, if less than decimal part of meanPopup, add 1 to popupCount
            const decimalPart = meanPopup - Math.floor(meanPopup);
            if (Math.random() < decimalPart) {
                popupCount += 1;
            }

            console.log(`Spawning ${popupCount} popups (mean: ${meanPopup}, timeToDisappear: ${timeToDisappear}, timeToAttack: ${timeToAttack}, damage: ${damage})`);

            for (let i = 0; i < popupCount; i++) {
                const newPopup = selectRandomPopup();
                if (newPopup) {
                    const activePopup: ActiveLaserGamePopup = {
                        ...newPopup,
                        x: Math.random() * (window.innerWidth - newPopup.width),
                        y: Math.random() * (window.innerHeight - newPopup.height),
                        pointLoss: newPopup.isEvil ? damage : -damage,
                        actionDelay: newPopup.isEvil ? timeToAttack : timeToDisappear,
                        id: index
                    }
                    index++;
                    setPopupList((prev) => [...prev, activePopup]);
                }
            }
            
            if(timeElapsed!= 0 && timeElapsed % 10 == 0) {
                meanPopup += 0.25;
                timeToDisappear = Math.max(2, timeToDisappear - 0.5);
                timeToAttack = Math.max(1, timeToAttack - 0.5);
                damage += 10;
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
                <div>
                    Sanity left : {sanityLeft}
                </div>
                <div>
                    Timer : {timer.toFixed(2)}s
                </div>
            </div>
            {popupList.map((popup) => (
                <LaserGamePopup
                    key={`popup-${popup.id}`}
                    popup={popup}
                />
            ))}
            {!gameActive && (
                <div className="text-2xl font-bold text-red-500">
                    Game Over! Final Score: {timer.toFixed(2)}s
                </div>
            )}
            
            <TuxGun />
        </>
    )
}

export default LaserGame;
