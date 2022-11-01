import { useState } from 'react'
import { useAuth } from '../pages'
import styles from '../styles/HomePage.module.css'

interface ButtonProps {
    text: string,
    onClick: () => void
};

const Button = ({ text, onClick }: ButtonProps) => {
    return <div
        onClick={onClick}
        className={styles.button}
    >
        {text}
    </div>;
}

const HomePage = () => {
    const { username, createGame, joinGame } = useAuth();
    const [codeInput, setCodeInput] = useState<string>("");

    return <div className={styles.background}>
        <h1>Welcome to Ichi!</h1>
        <h2>You are logged in as {username}</h2>
        <Button text="Create Game" onClick={createGame} />
        <input type="text" maxLength={4} placeholder="CODE" className={styles.codeInput} value={codeInput} onChange={(e) => setCodeInput(e.target.value)} />
        <Button text="Join Game" onClick={() => joinGame(codeInput)} />
    </div>;
};

export default HomePage;