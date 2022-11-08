import styles from '../styles/Card.module.css'
import { CardInfo } from '../utils/types';
import { useSpring, easings, animated } from 'react-spring';
import { useEffect } from 'react';
import { useAuth } from '../pages';

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
    scale: number;
}

const Card = ({ info, x, y, rotation, deckX, deckY, zIndex, scale }: CardProps) => {
    const [position, api] = useSpring(() => ({ x: deckX, y: deckY, r: 0, flip: 0 }));
    const { makeMove } = useAuth();

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
    }, [x, y, rotation, scale, api]);

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
        className={info.selectable ? `${styles.card} ${styles.selectable}` : styles.card}
        style={{
            left: position.x.to(x => x + "px"),
            top: position.y.to(y => y + "px"),
            transform: position.r.to((r) => ` translate(-50%, -50%) scale(${scale}) rotate(${r}deg) `),
            zIndex: zIndex
        }}
        onClick={async () => {
            if(info.selectable){
                if(info.face == 'swap'){
                    //TODO: get which cards the player wants to swap, then make the call
                }else if(info.face == 'wild'){
                    //TODO: get which color the player wants it to be, then make the call
                    //For now, let's make it always go to red
                    makeMove([info.id, 'red']);
                }else{
                    makeMove([info.id]);
                }
            }
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
                    ICHI
                </animated.div>
            </animated.div>
        </animated.div>
    </animated.div>;
};

export default Card;