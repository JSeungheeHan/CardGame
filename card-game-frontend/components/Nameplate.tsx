import styles from '../styles/Nameplate.module.css'

interface NameplateProps {
    username: string;
    x: number;
    y: number;
    rotation: number;
    scale: number;
};

const Nameplate = ({ username, x, y, rotation, scale }: NameplateProps) => {
    return <div
        className={styles.nameplate}
        style={{
            left: x + "px",
            top: y + "px",
            transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
            fontSize: 30 * scale + "px"
        }}
    >
        {username}
    </div>
};

export default Nameplate;