
export interface CardInfo {
    id: string;
    face: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "reverse" | "skip" | "drawTwo" | "wild" | "drawFour" | "deck";
    color: "red" | "green" | "blue" | "yellow" | "special";
    revealed: boolean;
    selectable: boolean;
};

export const defaultCard: CardInfo = {
    id: "0",
    face: "1",
    color: "red",
    revealed: true,
    selectable: false
};

export interface Hand {
    cards: CardInfo[];
};

export const defaultHand: Hand = {
    cards: []
};

export interface GameState {
    hands: Hand[];
    playedCards: CardInfo[];
    remainingCards: number;
};

export const defaultGameState: GameState = {
    hands: Array(4).fill(0).map(n => defaultHand),
    playedCards: [],
    remainingCards: 52
};

const testCards: {[key: string]: CardInfo} = {
    r0: { id: "r0", face: "0", color: "red", revealed: true, selectable: false },
    r1: { id: "r1", face: "1", color: "red", revealed: true, selectable: false },
    r2: { id: "r2", face: "2", color: "red", revealed: true, selectable: false },
    r3: { id: "r3", face: "3", color: "red", revealed: true, selectable: false },
    r4: { id: "r4", face: "3", color: "red", revealed: true, selectable: false },
    b0: { id: "b0", face: "0", color: "blue", revealed: true, selectable: false },
    b1: { id: "b1", face: "1", color: "blue", revealed: true, selectable: false },
    b2: { id: "b2", face: "2", color: "blue", revealed: true, selectable: false },
    b3: { id: "b3", face: "3", color: "blue", revealed: true, selectable: false },
    b4: { id: "b4", face: "4", color: "blue", revealed: true, selectable: false },
    g0: { id: "g0", face: "0", color: "green", revealed: true, selectable: false },
    g1: { id: "g1", face: "1", color: "green", revealed: true, selectable: false },
    g2: { id: "g2", face: "2", color: "green", revealed: true, selectable: false },
    g3: { id: "g3", face: "3", color: "green", revealed: true, selectable: false },
    g4: { id: "g4", face: "4", color: "green", revealed: true, selectable: false },
    y0: { id: "y0", face: "0", color: "yellow", revealed: true, selectable: false },
    y1: { id: "y1", face: "1", color: "yellow", revealed: true, selectable: false },
    y2: { id: "y2", face: "2", color: "yellow", revealed: true, selectable: false },
    y3: { id: "y3", face: "3", color: "yellow", revealed: true, selectable: false },
    y4: { id: "y4", face: "4", color: "yellow", revealed: true, selectable: false }
};

const hide = (card: CardInfo): CardInfo => {
    return {
        ...card,
        revealed: false
    }
}

export const testGameStates: GameState[] = [
    {
        hands: [
            { cards: [] },
            { cards: [] },
            { cards: [] },
            { cards: [] },
        ],
        playedCards: [],
        remainingCards: 52
    },
    {
        hands: [
            { cards: [testCards.r0, testCards.g3, testCards.y2] },
            { cards: [hide(testCards.r1), hide(testCards.r2), hide(testCards.b1)] },
            { cards: [hide(testCards.b4), hide(testCards.y0), hide(testCards.y3)] },
            { cards: [hide(testCards.b2), hide(testCards.b3), hide(testCards.g0)] },
        ],
        playedCards: [testCards.g4],
        remainingCards: 51
    },
    {
        hands: [
            { cards: [testCards.r0, testCards.y2] },
            { cards: [hide(testCards.r1), hide(testCards.r2), hide(testCards.b1)] },
            { cards: [hide(testCards.b4), hide(testCards.y0), hide(testCards.y3)] },
            { cards: [hide(testCards.b2), hide(testCards.b3), hide(testCards.g0)] },
        ],
        playedCards: [testCards.g4, testCards.g3],
        remainingCards: 51
    },
    {
        hands: [
            { cards: [testCards.r0, testCards.y2] },
            { cards: [hide(testCards.r1), hide(testCards.r2), hide(testCards.b1), hide(testCards.y4)] },
            { cards: [hide(testCards.b4), hide(testCards.y0), hide(testCards.y3)] },
            { cards: [hide(testCards.b2), hide(testCards.b3), hide(testCards.g0)] },
        ],
        playedCards: [testCards.g4, testCards.g3],
        remainingCards: 50
    },
    {
        hands: [
            { cards: [testCards.r0, testCards.y2] },
            { cards: [hide(testCards.r1), hide(testCards.r2), hide(testCards.b1), hide(testCards.y4)] },
            { cards: [hide(testCards.b4), hide(testCards.y0)] },
            { cards: [hide(testCards.b2), hide(testCards.b3), hide(testCards.g0)] },
        ],
        playedCards: [testCards.g4, testCards.g3, testCards.y3],
        remainingCards: 50
    },
    {
        hands: [
            { cards: [testCards.r0, testCards.y2] },
            { cards: [hide(testCards.r1), hide(testCards.r2), hide(testCards.b1), hide(testCards.y4)] },
            { cards: [hide(testCards.b4), hide(testCards.y0)] },
            { cards: [hide(testCards.b2), hide(testCards.g0)] },
        ],
        playedCards: [testCards.g4, testCards.g3, testCards.y3, testCards.b3],
        remainingCards: 50
    },
    {
        hands: [
            { cards: [testCards.r0, testCards.y2, testCards.g1] },
            { cards: [hide(testCards.r1), hide(testCards.r2), hide(testCards.b1), hide(testCards.y4)] },
            { cards: [hide(testCards.b4), hide(testCards.y0)] },
            { cards: [hide(testCards.b2), hide(testCards.g0)] },
        ],
        playedCards: [testCards.g4, testCards.g3, testCards.y3, testCards.b3],
        remainingCards: 49
    },
];