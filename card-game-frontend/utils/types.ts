
export interface GameState {
    id: number;
    players: PlayerInfo[];
    playedCards: CardInfo[];
    remainingCards: number;
    currentPlayer: number;
    turnExpiry: number;
    victor: number;
    gameCode: string;
    canIchi: boolean;
};

export interface PlayerInfo {
    username: string;
    hand: CardInfo[];
};

export interface CardInfo {
    id: string;
    face: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "reverse" | "swap" | "shuffle" | "wild" | "bomb" | "deck";
    color: "red" | "green" | "blue" | "yellow" | "special";
    revealed: boolean;
    selectable: boolean;
};

export interface ClientMessage {
    type: "createGame" | "joinGame" | "move" | "draw" | "ichi" | "startGame";
    username: string;
    gameCode: string | undefined;
    stateId: number;
    data: string[];
}

export interface ServerMessage {
    error: string | undefined;
    gameState: GameState | undefined;
}

export interface PlayerStatistics {

}

export const defaultCard: CardInfo = {
    id: "0",
    face: "1",
    color: "red",
    revealed: false,
    selectable: false
};

export const defaultGameState: GameState = {
    id: 0,
    players: [],
    playedCards: [],
    remainingCards: 100,
    currentPlayer: -1,
    turnExpiry: -1,
    victor: -1,
    gameCode: "AAAA",
    canIchi: false
};

export const defaultPlayerInfo: PlayerInfo = {
    username: "guest",
    hand: []
};

const testCards: {[key: string]: CardInfo} = {
    r0: { id: "r0", face: "0", color: "red", revealed: false, selectable: false },
    r1: { id: "r1", face: "1", color: "red", revealed: false, selectable: false },
    r2: { id: "r2", face: "2", color: "red", revealed: false, selectable: false },
    r3: { id: "r3", face: "3", color: "red", revealed: false, selectable: false },
    r4: { id: "r4", face: "4", color: "red", revealed: false, selectable: false },
    b0: { id: "b0", face: "0", color: "blue", revealed: false, selectable: false },
    b1: { id: "b1", face: "1", color: "blue", revealed: false, selectable: false },
    b2: { id: "b2", face: "2", color: "blue", revealed: false, selectable: false },
    b3: { id: "b3", face: "3", color: "blue", revealed: false, selectable: false },
    b4: { id: "b4", face: "4", color: "blue", revealed: false, selectable: false },
    g0: { id: "g0", face: "0", color: "green", revealed: false, selectable: false },
    g1: { id: "g1", face: "1", color: "green", revealed: false, selectable: false },
    g2: { id: "g2", face: "2", color: "green", revealed: false, selectable: false },
    g3: { id: "g3", face: "3", color: "green", revealed: false, selectable: false },
    g4: { id: "g4", face: "4", color: "green", revealed: false, selectable: false },
    y0: { id: "y0", face: "0", color: "yellow", revealed: false, selectable: false },
    y1: { id: "y1", face: "1", color: "yellow", revealed: false, selectable: false },
    y2: { id: "y2", face: "2", color: "yellow", revealed: false, selectable: false },
    y3: { id: "y3", face: "3", color: "yellow", revealed: false, selectable: false },
    y4: { id: "y4", face: "4", color: "yellow", revealed: false, selectable: false }
};

export const testGameStates: GameState[] = [
    {
        id: 0,
        players: [
            { username: "TommyTrojan", hand: [] },
            { username: "HecubaTrojan", hand: [] },
            { username: "TravellerHorse", hand: [] },
            { username: "CarolFolt", hand: [] },
        ],
        playedCards: [],
        remainingCards: 52,
        currentPlayer: -1,
        turnExpiry: -1,
        victor: -1,
        gameCode: "AAAA",
        canIchi: false
    },
    {
        id: 1,
        players: [
            { username: "TommyTrojan", hand: [{...testCards.r0, revealed: true}, {...testCards.g3, revealed: true, selectable: true}, {...testCards.y2, revealed: true}, {...testCards.g2, revealed: true, selectable: true}] },
            { username: "HecubaTrojan", hand: [testCards.r1, testCards.r2, testCards.b1] },
            { username: "TravellerHorse", hand: [testCards.b4, testCards.y0, testCards.y3] },
            { username: "CarolFolt", hand: [testCards.b2, testCards.b3, testCards.g0] },
        ],
        playedCards: [{...testCards.g4, revealed: true}],
        remainingCards: 51,
        currentPlayer: 0,
        turnExpiry: -1,
        victor: -1,
        gameCode: "AAAA",
        canIchi: false
    },
    {
        id: 2,
        players: [
            { username: "TommyTrojan", hand: [{...testCards.r0, revealed: true}, {...testCards.y2, revealed: true}] },
            { username: "HecubaTrojan", hand: [testCards.r1, testCards.r2, testCards.b1] },
            { username: "TravellerHorse", hand: [testCards.b4, testCards.y0, testCards.y3] },
            { username: "CarolFolt", hand: [testCards.b2, testCards.b3, testCards.g0] },
        ],
        playedCards: [{...testCards.g4, revealed: true}, {...testCards.g3, revealed: true}],
        remainingCards: 51,
        currentPlayer: 1,
        turnExpiry: -1,
        victor: -1,
        gameCode: "AAAA",
        canIchi: false
    },
    {
        id: 3,
        players: [
            { username: "TommyTrojan", hand: [{...testCards.r0, revealed: true}, {...testCards.y2, revealed: true}] },
            { username: "HecubaTrojan", hand: [testCards.r1, testCards.r2, testCards.b1, testCards.y4] },
            { username: "TravellerHorse", hand: [testCards.b4, testCards.y0, testCards.y3] },
            { username: "CarolFolt", hand: [testCards.b2, testCards.b3, testCards.g0] },
        ],
        playedCards: [{...testCards.g4, revealed: true}, {...testCards.g3, revealed: true}],
        remainingCards: 50,
        currentPlayer: 2,
        turnExpiry: -1,
        victor: -1,
        gameCode: "AAAA",
        canIchi: false
    },
    {
        id: 4,
        players: [
            { username: "TommyTrojan", hand: [{...testCards.r0, revealed: true}, {...testCards.y2, revealed: true}] },
            { username: "HecubaTrojan", hand: [testCards.r1, testCards.r2, testCards.b1, testCards.y4] },
            { username: "TravellerHorse", hand: [testCards.b4, testCards.y0] },
            { username: "CarolFolt", hand: [testCards.b2, testCards.b3, testCards.g0] },
        ],
        playedCards: [{...testCards.g4, revealed: true}, {...testCards.g3, revealed: true}, {...testCards.y3, revealed: true}],
        remainingCards: 50,
        currentPlayer: 3,
        turnExpiry: -1,
        victor: -1,
        gameCode: "AAAA",
        canIchi: false
    },
    {
        id: 5,
        players: [
            { username: "TommyTrojan", hand: [{...testCards.r0, revealed: true}, {...testCards.y2, revealed: true}] },
            { username: "HecubaTrojan", hand: [testCards.r1, testCards.r2, testCards.b1, testCards.y4] },
            { username: "TravellerHorse", hand: [testCards.b4, testCards.y0] },
            { username: "CarolFolt", hand: [testCards.b2, testCards.g0] },
        ],
        playedCards: [{...testCards.g4, revealed: true}, {...testCards.g3, revealed: true}, {...testCards.y3, revealed: true}, {...testCards.b3, revealed: true}],
        remainingCards: 50,
        currentPlayer: 0,
        turnExpiry: -1,
        victor: -1,
        gameCode: "AAAA",
        canIchi: false
    },
    {
        id: 6,
        players: [
            { username: "TommyTrojan", hand: [{...testCards.r0, revealed: true}, {...testCards.y2, revealed: true}, {...testCards.g1, revealed: true}] },
            { username: "HecubaTrojan", hand: [testCards.r1, testCards.r2, testCards.b1, testCards.y4] },
            { username: "TravellerHorse", hand: [testCards.b4, testCards.y0] },
            { username: "CarolFolt", hand: [testCards.b2, testCards.g0] },
        ],
        playedCards: [{...testCards.g4, revealed: true}, {...testCards.g3, revealed: true}, {...testCards.y3, revealed: true}, {...testCards.b3, revealed: true}],
        remainingCards: 49,
        currentPlayer: 1,
        turnExpiry: -1,
        victor: -1,
        gameCode: "AAAA",
        canIchi: false
    },
];