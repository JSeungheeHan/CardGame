import styles from '../styles/Nameplate.module.css'

interface NameplateProps {
    username: string;
    x: number;
    y: number;
    rotation: number;
};

const Nameplate = ({ username, x, y, rotation }: NameplateProps) => {
    return <div
        className={styles.nameplate}
        style={{
            left: (x * 100) + "%",
            top: (y * 100) + "%",
            transform: `translate(-50%, -50%) rotate(${rotation}deg)`
        }}
    >
        {username}
    </div>
};

export default Nameplate;