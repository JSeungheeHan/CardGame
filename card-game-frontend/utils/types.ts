
export interface CardInfo {
    id: string; //this unique id is used to track the cards between turns (NOT face/color)
    face: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "reverse" | "swap" | "shuffle" | "wild" | "bomb" | "wild";
    color: "red" | "green" | "blue" | "yellow" | "special";
    revealed: boolean;
    selectable: boolean;
};

export interface PlayerInfo {
    username: string;
    hand: CardInfo[];
};

export interface GameState {
    players: PlayerInfo[];
    playedCards: CardInfo[];    //this only needs the top two cards
    remainingCards: number;
    currentPlayer: number;  //this is the index in the players array of the player whose turn it currently is
    turnExpiry: number; //this is the unix timestamp (in seconds) of the moment where the turn will expire
};

export interface Move {
    gameCode: string;   //the code of the game we're connected to
    cardId: string | null;
    data: string | null; //if it was a wild card, this is the color the player selected. If it was a swap card, it is a string with the ids of the cards to swap, separated by a single space character.
}

export const defaultCard: CardInfo = {
    id: "0",
    face: "1",
    color: "red",
    revealed: true,
    selectable: false
};



export const defaultHand: PlayerInfo = {
    username: "guest",
    hand: []
};



export const defaultGameState: GameState = {
    players: Array(4).fill(0).map(n => defaultHand),
    playedCards: [],
    remainingCards: 52,
    currentPlayer: 0,
    turnExpiry: 0
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
        players: [
            { username: "PlayerOne", hand: [] },
            { username: "PlayerTwo", hand: [] },
            { username: "PlayerThree", hand: [] },
            { username: "PlayerFour", hand: [] },
        ],
        playedCards: [],
        remainingCards: 52,
        currentPlayer: -1,
        turnExpiry: -1
    },
    {
        players: [
            { username: "", hand: [testCards.r0, testCards.g3, testCards.y2] },
            { username: "", hand: [hide(testCards.r1), hide(testCards.r2), hide(testCards.b1)] },
            { username: "", hand: [hide(testCards.b4), hide(testCards.y0), hide(testCards.y3)] },
            { username: "", hand: [hide(testCards.b2), hide(testCards.b3), hide(testCards.g0)] },
        ],
        playedCards: [testCards.g4],
        remainingCards: 51,
        currentPlayer: 0,
        turnExpiry: -1
    },
    {
        players: [
            { username: "", hand: [testCards.r0, testCards.y2] },
            { username: "", hand: [hide(testCards.r1), hide(testCards.r2), hide(testCards.b1)] },
            { username: "", hand: [hide(testCards.b4), hide(testCards.y0), hide(testCards.y3)] },
            { username: "", hand: [hide(testCards.b2), hide(testCards.b3), hide(testCards.g0)] },
        ],
        playedCards: [testCards.g4, testCards.g3],
        remainingCards: 51,
        currentPlayer: 1,
        turnExpiry: -1
    },
    {
        players: [
            { username: "", hand: [testCards.r0, testCards.y2] },
            { username: "", hand: [hide(testCards.r1), hide(testCards.r2), hide(testCards.b1), hide(testCards.y4)] },
            { username: "", hand: [hide(testCards.b4), hide(testCards.y0), hide(testCards.y3)] },
            { username: "", hand: [hide(testCards.b2), hide(testCards.b3), hide(testCards.g0)] },
        ],
        playedCards: [testCards.g4, testCards.g3],
        remainingCards: 50,
        currentPlayer: 2,
        turnExpiry: -1
    },
    {
        players: [
            { username: "", hand: [testCards.r0, testCards.y2] },
            { username: "", hand: [hide(testCards.r1), hide(testCards.r2), hide(testCards.b1), hide(testCards.y4)] },
            { username: "", hand: [hide(testCards.b4), hide(testCards.y0)] },
            { username: "", hand: [hide(testCards.b2), hide(testCards.b3), hide(testCards.g0)] },
        ],
        playedCards: [testCards.g4, testCards.g3, testCards.y3],
        remainingCards: 50,
        currentPlayer: 3,
        turnExpiry: -1
    },
    {
        players: [
            { username: "", hand: [testCards.r0, testCards.y2] },
            { username: "", hand: [hide(testCards.r1), hide(testCards.r2), hide(testCards.b1), hide(testCards.y4)] },
            { username: "", hand: [hide(testCards.b4), hide(testCards.y0)] },
            { username: "", hand: [hide(testCards.b2), hide(testCards.g0)] },
        ],
        playedCards: [testCards.g4, testCards.g3, testCards.y3, testCards.b3],
        remainingCards: 50,
        currentPlayer: 0,
        turnExpiry: -1
    },
    {
        players: [
            { username: "", hand: [testCards.r0, testCards.y2, testCards.g1] },
            { username: "", hand: [hide(testCards.r1), hide(testCards.r2), hide(testCards.b1), hide(testCards.y4)] },
            { username: "", hand: [hide(testCards.b4), hide(testCards.y0)] },
            { username: "", hand: [hide(testCards.b2), hide(testCards.g0)] },
        ],
        playedCards: [testCards.g4, testCards.g3, testCards.y3, testCards.b3],
        remainingCards: 49,
        currentPlayer: 1,
        turnExpiry: -1
    },
];