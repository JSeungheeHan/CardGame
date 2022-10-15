import styles from '../styles/Card.module.css'
import { CardInfo } from '../utils/types';
import { useSpring, easings, animated } from 'react-spring';
import { useEffect } from 'react';

const drawColors = {
    red: "red",
    green: "green",
    blue: "blue",
    yellow: "#fcdc3d",
    special: "black"
};

interface CardProps {
    info: CardInfo;
    x: number;
    y: number;
    deckX: number;
    deckY: number;
    rotation: number;
    zIndex: number;
}

const Card = ({ info, x, y, rotation, deckX, deckY, zIndex }: CardProps) => {
    const [position, api] = useSpring(() => ({ x: deckX, y: deckY, r: 0, flip: 0 }));

    useEffect(() => {
        api.start({
            x: x,
            y: y,
            r: rotation,
            config: {
                duration: 1000,
                easing: easings.easeInOutCubic
            }
        });
    }, [x, y, rotation, api]);

    useEffect(() =>  {
        api.start({
            flip: info.revealed ? 1 : 0,
            config: {
                duration: 1000,
                easing: easings.easeInOutCubic
            }
        });
    }, [info.revealed, api]);
    
    const drawColor = drawColors[info.color];
    return <animated.div
        className={styles.card}
        style={{
            left: position.x.to(x => x*100 + "%"),
            top: position.y.to(y => y*100 + "%"),
            transform: position.r.to(r => `translate(-50%, -50%) rotate(${r}deg)`),
            zIndex: zIndex
        }}
    >
        <animated.div
            className={styles.cardFlip}
            style={{
                transform: position.flip.to(f => `rotateY(${f*180}deg)`)
            }}
        >
            <animated.div
                className={styles.innerCard}
            >
                <animated.div
                    className={styles.cardFace}
                    style={{
                        backgroundColor: drawColor,
                    }}
                >
                    {info.face}
                </animated.div>
                <animated.div
                    className={styles.cardBack}
                    style={{
                        opacity: position.flip.to(f => f < .5 ? 1 : 0)
                    }}
                >
                    UNO
                </animated.div>
            </animated.div>
        </animated.div>
    </animated.div>;
    
    <animated.div
        className={styles.card}
        style={{
            backgroundColor: drawColor,
            left: position.x.to(x => x*100 + "%"),
            top: position.y.to(y => y*100 + "%"),
            transform: position.r.to(r => `translate(-50%, -50%) rotate(${r}deg)`),
            zIndex: zIndex
        }}
    >
        {info.face}
    </animated.div>;
};

export default Card;