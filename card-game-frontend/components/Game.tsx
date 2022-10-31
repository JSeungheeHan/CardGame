import { useEffect, useRef, useState } from 'react';
import styles from '../styles/Game.module.css'
import Card from './Card';
import { GameState, defaultGameState, CardInfo, defaultCard, testGameStates } from '../utils/types';

const deckCard: CardInfo = {
    id: "deck",
    face: "0",
    color: "special",
    revealed: false,
    selectable: true
}

const Game = () => {
    const gameIndex = useRef(0);
    const [gameState, setGameState] = useState<GameState>(testGameStates[gameIndex.current]);

    useEffect(() =>  {
        const interval = setInterval(() => {
            gameIndex.current++;
            gameIndex.current %= testGameStates.length;
            setGameState(testGameStates[gameIndex.current]);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    //Make a list of all the cards and their positions
    const cardWidth = .09, cardHeight = .17;
    const deckX = .5 - cardWidth, deckY = .5;
    const pileX = .5 + cardWidth, pileY = .5;
    const cardPositions: { card: CardInfo, x: number, y: number, r: number, z: number }[] = [];
    gameState.players.forEach((player, playerIdx) => {
        const handX = [.5, cardHeight/2, .5, 1 - cardHeight/2][playerIdx];
        const handY = [1 - cardHeight, .5, cardHeight, .5][playerIdx];
        const handRot = [0, -90, 0, 90][playerIdx];
        const cardOffsetX = [1, 0, 1, 0][playerIdx];
        const cardOffsetY = [0, 1, 0, -1][playerIdx];
        player.hand.forEach((card, cardIdx) => {
            cardPositions.push({
                card,
                x: handX + cardWidth*cardOffsetX* (cardIdx - player.hand.length/2 + .5),
                y: handY + cardHeight*cardOffsetY* (cardIdx - player.hand.length/2 + .5),
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
    
    return <div className={styles.container}>
        <Card key={deckCard.id} info={deckCard} x={deckX} y={deckY} rotation={0} deckX={deckX} deckY={deckY} zIndex={0} />
        {cardPositions.map(({ card, x, y, r, z }) => <Card key={card.id} info={card} x={x} y={y} rotation={r} deckX={deckX} deckY={deckY} zIndex={z} />)}
    </div>;
}

export default Game;