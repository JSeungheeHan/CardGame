import { useEffect, useRef, useState } from 'react';
import styles from '../styles/Game.module.css'
import Card from './Card';
import { GameState, defaultGameState, CardInfo, defaultCard, testGameStates } from '../utils/types';
import { useAuth } from '../pages';
import Nameplate from './Nameplate';

const Game = () => {
    //Figure out dimensions
    const [width, setWidth] = useState<number>(window.innerWidth);
    const [height, setHeight] = useState<number>(window.innerHeight);

    //This code will update the dimensions as they change
    //However, I only wanted the component to rerender after the user has stopped resizing the window
    const updateDimensionTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
    const clearDimensionTimeout = () => {
        if(updateDimensionTimeout.current != undefined){
            clearInterval(updateDimensionTimeout.current);
            updateDimensionTimeout.current = undefined;
        }
    }
    useEffect(() => {
        console.log("width", window.innerWidth, "height", window.innerHeight);
        window.onresize = () => {
            clearDimensionTimeout();
            updateDimensionTimeout.current = setTimeout(() => {
                setWidth(window.innerWidth);
                setHeight(window.innerHeight);
                console.log("Changing game dimensions to", window.innerWidth, window.innerHeight);
            }, 200);
        };
        return clearDimensionTimeout;
    }, []);

    //Load the gameState and make sure it exists
    const { gameState, leaveGame, username, startGame, ichi } = useAuth();
    if(gameState == undefined){
        return <div>Error: Game state must be defined!</div>;
    }

    //Decide critical values based on window dimensions
    const cardScale = Math.min(1, Math.min(width, height) / 858);
    const cardWidth = 100 * cardScale, cardHeight = 140 * cardScale;
    const deckX = width/2 - cardWidth, deckY = height/2;
    const pileX = width/2 + cardWidth, pileY = height/2;
    const nameplateHeight = 100 * cardScale;
    const handOffset = nameplateHeight + cardHeight/2;
    let handPositions = [
        {
            x: width/2,
            y: height - handOffset,
            rot: 0,
            cardOffsetX: 1,
            cardOffsetY: 0,
            nameX: width/2,
            nameY: height - nameplateHeight / 2
        },
        {
            x: handOffset,
            y: height/2,
            rot: -90,
            cardOffsetX: 0,
            cardOffsetY: 1,
            nameX: nameplateHeight / 2,
            nameY: height / 2
        },
        {
            x: width/2,
            y: handOffset,
            rot: 0,
            cardOffsetX: 1,
            cardOffsetY: 0,
            nameX: width/2,
            nameY: nameplateHeight/2
        },
        {
            x: width - handOffset,
            y: height/2,
            rot: 90,
            cardOffsetX: 0,
            cardOffsetY: -1,
            nameX: width - nameplateHeight/2,
            nameY: height / 2
        }
    ];

    //Rotate hand positions so that this player is at the bottom
    let myIdx = gameState.players.findIndex(p => p.username == username);
    if(myIdx == -1){ myIdx = 0; }
    for(let i = 0; i < myIdx; i++){
        handPositions.unshift(handPositions.pop() as any);
    }

    //Make a list of all cards' positions
    const cardPositions: { card: CardInfo, x: number, y: number, r: number, z: number }[] = [];
    gameState.players.forEach((player, playerIdx) => {
        const { x: handX, y: handY, rot: handRot, cardOffsetX, cardOffsetY } = handPositions[playerIdx];
        const maxHandWidth = cardWidth * (myIdx == playerIdx ? 9 : 5);
        const cardSeparation = Math.min(cardWidth + 20*cardScale, maxHandWidth / player.hand.length);
        player.hand.forEach((card, cardIdx) => {
            cardPositions.push({
                card,
                x: handX + cardSeparation*cardOffsetX* (cardIdx - player.hand.length/2 + .5),
                y: handY + cardSeparation*cardOffsetY* (cardIdx - player.hand.length/2 + .5),
                r: handRot,
                z: cardIdx
            });
        });
    });
    gameState.playedCards.forEach((card, cardIdx) => {
        //for now, only render top played card
        if(cardIdx >= gameState.playedCards.length - 2){
            cardPositions.push({
                card,
                x: pileX,
                y: pileY,
                r: 0,
                z: 10+cardIdx
            });
        }
    })

    //Create the deck
    const deckCard: CardInfo = {
        id: "deck",
        face: "deck",
        color: "special",
        revealed: false,
        selectable: gameState.currentPlayer != -1 && gameState.players[gameState.currentPlayer].username == username
    }

    //Figure out which state the game is in
    const inLobby = gameState.currentPlayer == -1 && gameState.victor == -1;
    const canIchi = gameState.currentPlayer != -1 && gameState.victor == -1;
    
    //Render html
    return <div className={styles.container}>
        {gameState.players.map((playerInfo, i) => (
            <Nameplate
                key={playerInfo.username}
                username={playerInfo.username}
                x={handPositions[i].nameX}
                y={handPositions[i].nameY}
                rotation={handPositions[i].rot}
                scale={cardScale}
            />
        ))}
        <Card
            key={deckCard.id}
            info={deckCard}
            x={deckX}
            y={deckY}
            rotation={0}
            deckX={deckX}
            deckY={deckY}
            zIndex={0}
            scale={cardScale}
        />
        {cardPositions.map(({ card, x, y, r, z }) => (
            <Card
                key={card.id}
                info={card}
                x={x}
                y={y}
                rotation={r}
                deckX={deckX}
                deckY={deckY}
                zIndex={z}
                scale={cardScale}
            />
        ))}
        {/* UI buttons and text */}
        <div
            className={styles.exitButton}
            onClick={() => leaveGame()}
        >
            Leave Game
        </div>
        {inLobby ? <>
            <div className={styles.uiText} style={{
                top: .22*height + "px",
                left: .5*width + "px",
                transform: `translate(-50%, -50%) scale(${cardScale})`
            }}>
                The game code is
            </div>
            <div className={styles.gameCode} style={{
                top: .3*height + "px",
                left: .5*width + "px",
                transform: `translate(-50%, -50%) scale(${cardScale})`
            }}>
                {gameState.gameCode}
            </div>
            {myIdx == 0 ? <>
                <div className={styles.uiText} style={{
                    top: .66*height + "px",
                    left: .5*width + "px",
                    transform: `translate(-50%, -50%) scale(${cardScale})`
                }}>
                    Once everyone is in,
                </div>
                <div
                    className={styles.startButton}
                    style={{
                        top: .76*height + "px",
                        left: .5*width + "px",
                        transform: `translate(-50%, -50%) scale(${cardScale})`
                    }}
                    onClick={startGame}
                >
                    Start Game
                </div>
            </> : <>
                <div className={styles.uiText} style={{
                    top: .70*height + "px",
                    left: .5*width + "px",
                    transform: `translate(-50%, -50%) scale(${cardScale})`
                }}>
                    Waiting for {gameState.players[0].username}
                </div>
                <div className={styles.uiText} style={{
                    top: .75*height + "px",
                    left: .5*width + "px",
                    transform: `translate(-50%, -50%) scale(${cardScale})`
                }}>
                    to start the game
                </div>
            </>}
        </> : null}
        {canIchi ? <>
            <div
                className={styles.ichiButton}
                onClick={() => ichi()}
            >
                Ichi!
            </div>
        </> : null}
    </div>;
}

export default Game;