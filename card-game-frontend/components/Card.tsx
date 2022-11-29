import styles from '../styles/Card.module.css'
import { CardInfo } from '../utils/types';
import { useSpring, easings, animated } from 'react-spring';
import { useEffect } from 'react';
import { useAuth } from '../pages';
import { PromptManager } from './Game';

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
    promptManager: PromptManager;
}

const Card = ({ info, x, y, rotation, deckX, deckY, zIndex, scale, promptManager }: CardProps) => {
    const [position, api] = useSpring(() => ({ x: deckX, y: deckY, r: 0, flip: 0 }));
    const { makeMove, draw } = useAuth();

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
                if(promptManager.swapCallback){
                    //They wanted to swap this card
                    console.log('swap callbacking');
                    promptManager.swapCallback(info.id);
                }else if(info.face == 'deck'){
                    //This is the deck, so draw a card
                    draw();
                }
                else if(info.face == 'swap'){
                    //Get which cards the player wants to swap, then make the move
                    promptManager.promptSwap(info.id, selections => {
                        if(selections.length == 2){
                            makeMove([info.id, selections[0], selections[1]]);
                        }else{
                            makeMove([info.id]);
                        }
                    });
                }else if(info.face == 'wild' || info.face == 'shuffle'){
                    //Get which color the player wants it to be, then make the move
                    promptManager.promptColor(color => {
                        makeMove([info.id, color]);
                    });
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
                        opacity: position.flip.to(f => f >= .5 ? 1 : 0)
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