import MessageData from "../type/MessageData";
import styles from '../styles/MessageBubble.module.css';

const MessageBubble = (userId: string, message: MessageData) => {
    if(userId == message.senderId) {
        return (
            <div className={styles.MessageBubble}></div>
        )
    }
}

export default MessageBubble;