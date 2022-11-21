import { useCallback, useEffect, useState } from 'react';
import styles from '../styles/Nameplate.module.css'

interface NameplateProps {
    username: string;
    x: number;
    y: number;
    rotation: number;
    scale: number;
    hasTurn: boolean;
    turnExpiry: number;
};



const Nameplate = ({ username, x, y, rotation, scale, hasTurn, turnExpiry }: NameplateProps) => {
    const getTimerText = useCallback(() => {
        if(hasTurn){
            if(turnExpiry == -1){
                return "??";
            }
            let timeLeft = turnExpiry - ((new Date()).getTime() / 1000);
            timeLeft = Math.max(0, timeLeft);
            timeLeft = Math.floor(timeLeft);
            return timeLeft.toString();
        }else{
            return undefined;
        }
    }, [hasTurn, turnExpiry]);
    
    const [timerText, setTimerText] = useState<string | undefined>(getTimerText());
    useEffect(() => {
        setTimerText(getTimerText());
        const interval = setInterval(() => {
            setTimerText(getTimerText());
        }, 1000);
        return () => clearInterval(interval);
    }, [getTimerText]);

    return <div
        className={styles.nameplate}
        style={{
            left: x + "px",
            top: y + "px",
            transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`
        }}
    >
        <span>{username}</span>
        {timerText != undefined ? <div className={styles.timer}>
            {timerText}
        </div> : null}
    </div>
};

export default Nameplate;