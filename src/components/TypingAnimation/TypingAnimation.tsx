import styles from './styles.module.css';

const TypingAnimation = () => {
    return (
        <div className={styles.typing_dots}>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
        </div>
    );
}

export default TypingAnimation