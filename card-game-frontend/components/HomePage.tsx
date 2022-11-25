import { useEffect, useState } from 'react'
import { useAuth } from '../pages'
import styles from '../styles/HomePage.module.css'
import { PlayerStatistics } from '../utils/types'

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
    const { username, createGame, joinGame, joinError, loggedIn, logout, login, createAccount, getStats } = useAuth();
    const [codeInput, setCodeInput] = useState<string>("");
    const [usernameInput, setUsernameInput] = useState<string>("");
    const [passwordInput, setPasswordInput] = useState<string>("");
    const [loginError, setLoginError] = useState<string | undefined>(undefined);
    const [createAccountError, setCreateAccountError] = useState<string | undefined>(undefined);
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const [stats, setStats] = useState<PlayerStatistics | undefined>(undefined);
    useEffect(() => {
        if(loggedIn){
            getStats().then((newStats) => {
                setStats(newStats)
            })
        }else{
            setStats(undefined);
        }
    }, [getStats, loggedIn]);

    return <div className={styles.background}>
        <h1 className={styles.title}>Welcome to Ichi!</h1>
        <span className={styles.introText}>{"To join a friend's game, enter their 4-letter game code. To create a game and track your statistics, log in or create an account."}</span>
        <div className={styles.joinDiv}>
            <div className={styles.innerJoinDiv}>
            <input type="text" maxLength={4} placeholder="CODE" className={styles.codeInput} value={codeInput} onChange={(e) => setCodeInput(e.target.value)} />
            <Button text="Join Game" onClick={() => joinGame(codeInput)} />
            </div>
            {joinError != undefined ? <span className={styles.error}>
                {joinError}
            </span> : null}
        </div>
        {loggedIn ? <>
            <div className={styles.loggedInDiv}>
                <span className={styles.loggedInText}>You are logged in as <span className={styles.username}>{username}</span></span>
                <div className={styles.wideButton} onClick={createGame} >Create Game</div>
                <div className={styles.wideButton} onClick={logout} >Log Out</div>
                {stats ? <span className={styles.statsTitle}>Statistics</span> : null}
                {stats ? <span className={styles.stats}>Games Played: {stats.gamesLost + stats.gamesWon}</span> : null}
                {stats ? <span className={styles.stats}>Games Won: {stats.gamesWon}</span> : null}
                {stats && (stats.gamesWon + stats.gamesLost > 0) ? <span className={styles.stats}>Win Percentage: {Math.round(stats.gamesWon / (stats.gamesLost + stats.gamesWon) * 100)}%</span> : null}
                {stats ? <span className={styles.stats}>Date Joined: {stats.dateJoined.split(" ")[0]}</span> : null}
            </div>
        </> : <>
            <div className={styles.loggedOutDiv}>
                <span className={styles.loggedInText}>You are not logged in.</span>
                <input type="text" placeholder="username" className={styles.loginInput} value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} />
                <input type="password" placeholder="password" className={styles.loginInput} value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} />
                <div className={styles.wideButton} onClick={() => {
                    login(usernameInput, passwordInput).then(message => {
                        if(message == ""){
                            setLoginError(undefined);
                            setUsernameInput("");
                            setPasswordInput("");
                        }else{
                            setLoginError(message);
                        }
                    })
                }} >Log In</div>
                {loginError != undefined ? <span className={styles.error}>{loginError}</span> : null}
                <span className={styles.miscText}>or</span>
                <div className={styles.wideButton} onClick={() => {
                    setModalOpen(true);
                    setUsernameInput("");
                    setPasswordInput("");
                }} >Create Account</div>
            </div>
        </>}
        {modalOpen ? <>
            <div className={styles.fade} onClick={() => setModalOpen(false)} />
            <div className={styles.modal}>
                <span className={styles.loggedInText}>Create Account</span>
                <input type="text" placeholder="username" className={styles.loginInput} value={usernameInput} onChange={(e) => setUsernameInput(e.target.value)} />
                <input type="password" placeholder="password" className={styles.loginInput} value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} />
                <div className={styles.wideButton} onClick={() => {
                    createAccount(usernameInput, passwordInput).then(message => {
                        if(message == ""){
                            setCreateAccountError(undefined);
                            setModalOpen(false);
                        }else{
                            setCreateAccountError(message);
                        }
                    });
                }} >Create Account</div>
                {createAccountError != undefined ? <span className={styles.error}>{createAccountError}</span> : null}
            </div>
        </> : null}
    </div>;
};

export default HomePage;