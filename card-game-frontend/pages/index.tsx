import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Game from '../components/Game'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { ClientMessage, GameState, PlayerStatistics, ServerMessage, testGameStates } from '../utils/types'
import HomePage from '../components/HomePage'

import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator'

export interface AuthContextType {
  loggedIn: boolean;
  username: string;
  gameState: GameState | undefined;
  joinError: string | undefined;
  login: (newUsername: string, newPassword: string) => Promise<string>;
  logout: () => void;
  createAccount: (newUsername: string, newPassword: string) => Promise<string>;
  getStats: () => Promise<PlayerStatistics | undefined>;
  joinGame: (gameCode: string) => void;
  makeMove: (cardInfo: string[]) => void;
  draw: (cardInfo: string[]) => void;
  ichi: (cardInfo: string[]) => void;
  createGame: () => void;
  leaveGame: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);  //{} as AuthContextType tells typescript to ignore this. It's fine, we won't use the default value anyways.

const gameEndpoint = "ws://localhost:43213/IchiBackend/game";

const makeGuestUsername = () => {
  return uniqueNamesGenerator({
    dictionaries: [adjectives, animals]
  });
};

const Home: NextPage = () => {
  //State
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  useEffect(() => {setUsername(makeGuestUsername())}, []);
  const [gameState, setGameState] = useState<GameState | undefined>(undefined);
  const [joinError, setJoinError] = useState<string | undefined>(undefined);
  const socketRef = useRef<WebSocket | undefined>(undefined);
  const messageQueueRef = useRef<ClientMessage[]>([]);

  //Define functions
  const login = (newUsername: string, newPassword: string): Promise<string> => {
    //TODO: validate this username and password
    setLoggedIn(true);
    setUsername(newUsername);
    return Promise.resolve("");
  }

  const logout = (): void => {
    if(loggedIn){
      setLoggedIn(false);
      setUsername(makeGuestUsername());
    }
  }

  const createAccount = (newUsername: string, newPassword: string): Promise<string> => {
    //TODO: send this to the frontend and validate its success
    return login(newUsername, newPassword);
  }

  const getStats = (): Promise<PlayerStatistics | undefined> => {
    //TODO: get stats from backend
    return Promise.resolve(undefined);
  }

  const connectWebSocket = () => {
    //If we're already connected, close that connection
    if(socketRef.current != undefined){
      console.log("Warning: Tried to make a new connection while already connected to a game.");
      socketRef.current.close();
      socketRef.current = undefined;
    }

    //Reset the queue of messages to send
    messageQueueRef.current = [];

    //Connect socket
    socketRef.current = new WebSocket(gameEndpoint);

    //Add open listener
    socketRef.current.addEventListener('open', () => {
      console.log("socket opened");
      messageQueueRef.current.forEach(sendMessage);
      messageQueueRef.current = [];
    });

    //Add message listener
    socketRef.current.addEventListener('message', (event) => {
      const msg: ServerMessage = JSON.parse(event.data);
      console.log("message received", msg);
      if(msg.error){
        console.log("Message from server:", msg.error);
      }
      if(msg.gameState){
        setGameState(msg.gameState);
        setJoinError(undefined);  //clear away any error saying we couldn't join
      }
    });

    //Add close listener
    socketRef.current.addEventListener('close', (event) => {
      console.log("socket closed");
      if(event.reason != ""){
        setJoinError(event.reason);
      }
      socketRef.current = undefined;
      messageQueueRef.current = [];
      setGameState(undefined);
    });

    //Add error listener
    socketRef.current.addEventListener('error', (event) => {
      console.log("Error: socket closed due to error");
      socketRef.current = undefined;
      messageQueueRef.current = [];
      setGameState(undefined);
    });
  }

  const sendMessage = (msg: ClientMessage) => {
    if(socketRef.current == undefined){
      console.log("Error: tried to send message, but socket is undefined.");
    }else if(socketRef.current.readyState != WebSocket.OPEN){
      console.log("Error: tried to send message, but socket wasn't open.");
    }else{
      console.log("seding message", msg);
      socketRef.current.send(JSON.stringify(msg));
    }
  }

  const queueMessage = (msg: ClientMessage) => {
    if(socketRef.current == undefined){
      console.log("Error: tried to send message, but socket is undefined.");
    }else if(socketRef.current.readyState == WebSocket.CONNECTING){
      messageQueueRef.current.push(msg);
    }else if(socketRef.current.readyState == WebSocket.OPEN){
      sendMessage(msg);
    }else{
      console.log("Error: tried to send message, but socked is closed.");
    }
  }

  const createGame = () => {
    //If we're already connected, don't proceed
    if(socketRef.current != undefined){
      console.log("Error: tried to create game while already connected to game.");
      return;
    }

    //Make the connection
    connectWebSocket();

    //Create the game
    if(socketRef.current == undefined){ return; }
    socketRef.current = socketRef.current as WebSocket; //this gets around incorrect TS warnings
    queueMessage({
      type: "createGame",
      username: username,
      stateId: -1,
      data: [],
      gameCode: undefined
    });
  }

  const joinGame = (gameCode: string) => {
    //If we're already connected, don't proceed
    if(socketRef.current != undefined){
      console.log("Error: tried to create game while already connected to game.");
      return;
    }

    //Make the connection
    connectWebSocket();

    //Join the game
    if(socketRef.current == undefined){ return; }
    socketRef.current = socketRef.current as WebSocket; //this gets around incorrect TS warnings
    queueMessage({
      type: "joinGame",
      username: username,
      stateId: -1,
      data: [],
      gameCode: gameCode.toUpperCase()
    });
  }

  const makeMove = (cardInfo: string[]) => {
    //Make sure we're connected to a game
    if(socketRef.current == undefined || gameState == undefined){
      console.log("Error: Not connected to a game.");
      return;
    }

    //Make the message
    queueMessage({
      type: "move",
      username: username,
      stateId: gameState.id,
      data: cardInfo,
      gameCode: gameState.gameCode
    });
  }

  const ichi = () => {
    //Make sure we're connected to a game
    if(socketRef.current == undefined || gameState == undefined){
      console.log("Error: Not connected to a game.");
      return;
    }

    //Make the message
    queueMessage({
      type: "ichi",
      username: username,
      stateId: gameState.id,
      data: [],
      gameCode: gameState.gameCode
    });
  }

  const draw = () => {
    //Make sure we're connected to a game
    if(socketRef.current == undefined || gameState == undefined){
      console.log("Error: Not connected to a game.");
      return;
    }

    //Make the message
    queueMessage({
      type: "draw",
      username: username,
      stateId: gameState.id,
      data: [],
      gameCode: gameState.gameCode
    });
  }
  
  const leaveGame = (): void => {
    //Make sure we're connected to a game
    if(socketRef.current == undefined || gameState == undefined){
      console.log("Error: Not connected to a game.");
      return;
    }

    //Close the socket
    socketRef.current.close();
  }

  //Construct the auth provider's value
  const authValue: AuthContextType = {
    loggedIn,
    username,
    gameState,
    joinError,
    login,
    logout,
    createAccount,
    getStats,
    joinGame,
    makeMove,
    draw,
    ichi,
    createGame,
    leaveGame
  }

  //Return the HTML
  return <AuthContext.Provider value={authValue}>
    {gameState == undefined ?
      <HomePage />
    :
      <div className={styles.gameContainer}>
        <Game />
      </div>
    }
  </AuthContext.Provider>;
}

export default Home;

export const useAuth = () => {
  return useContext(AuthContext);
}
