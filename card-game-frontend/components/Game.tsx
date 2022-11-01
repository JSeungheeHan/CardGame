import { useEffect, useRef, useState } from 'react';
import styles from '../styles/Game.module.css'
import Card from './Card';
import { GameState, defaultGameState, CardInfo, defaultCard, testGameStates } from '../utils/types';
import { useAuth } from '../pages';
import Nameplate from './Nameplate';

const deckCard: CardInfo = {
    id: "deck",
    face: "0",
    color: "special",
    revealed: false,
    selectable: true
}

const Game = () => {
    //Load the gameState and make sure it exists
    const { gameState, leaveGame, username } = useAuth();
    if(gameState == undefined){
        return <div>Error: Game state must be defined!</div>;
    }

    //Decide critical values based on window dimensions
    const cardWidth = .09, cardHeight = .17;
    const deckX = .5 - cardWidth, deckY = .5;
    const pileX = .5 + cardWidth, pileY = .5;
    let handPositions = [
        {
            x: .5,
            y: 1 - cardHeight,
            rot: 0,
            cardOffsetX: 1,
            cardOffsetY: 0
        },
        {
            x: cardHeight/2,
            y: .5,
            rot: -90,
            cardOffsetX: 0,
            cardOffsetY: 1
        },
        {
            x: .5,
            y: cardHeight,
            rot: 0,
            cardOffsetX: 1,
            cardOffsetY: 0
        },
        {
            x: 1 - cardHeight/2,
            y: .5,
            rot: 90,
            cardOffsetX: 0,
            cardOffsetY: -1
        }
    ];

    //Rotate hand positions so that this player is at the bottom
    let playerIdx = gameState.players.findIndex(p => p.username == username);
    if(playerIdx == -1){ playerIdx = 0; }
    for(let i = 0; i < playerIdx; i++){
        handPositions.unshift(handPositions.pop() as any);
    }

    //Make a list of all cards' positions
    const cardPositions: { card: CardInfo, x: number, y: number, r: number, z: number }[] = [];
    gameState.players.forEach((player, playerIdx) => {
        const handPos = handPositions[playerIdx];
        const handX = handPos.x;
        const handY = handPos.y;
        const handRot = handPos.rot;
        const cardOffsetX = handPos.cardOffsetX;
        const cardOffsetY = handPos.cardOffsetY;
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
        {gameState.players.map((playerInfo, i) => (
            <Nameplate
                key={playerInfo.username}
                username={playerInfo.username}
                x={handPositions[i].x}
                y={handPositions[i].y}
                rotation={handPositions[i].rot}
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
            />
        ))}
        <div
            className={styles.exitButton}
            onClick={() => leaveGame()}
        >
            Leave Game
        </div>
        <div className={styles.gameCode}>
            {gameState.gameCode}
        </div>
    </div>;
}

export default Game;