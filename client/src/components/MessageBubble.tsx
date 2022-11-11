import MessageData from "../type/MessageData";
import styles from "../styles/MessageBubble.module.css";
import { formatTime } from "../utils/format";
interface Props {
  userId: string;
  message: MessageData;
}
const MessageBubble = ({ userId, message }: Props) => {
  if (userId == message.senderId) {
    return (
      <div className={styles.MyMessageContainer}>
        <div className={styles.MyMessageBubble}>
          {message.type == "image" ? (
            <img src={`http://localhost:3000/api/chat/image/${message.data}`}/>
          ) : (
            <span>{message.data}</span>
          )}
        </div>
        <div>{formatTime(message.timestamp)}</div>
      </div>
    );
  } else {
    return (
      <div className={styles.OtherMessageContainer}>
        <div>{message.sender}</div>
        <div className={styles.OtherMessageBubble}>
          {message.type == "image" ? (
            <img src={`http://localhost:3000/api/chat/image/${message.data}`}/>
          ) : (
            <span>{message.data}</span>
          )}
        </div>
        <div>{formatTime(message.timestamp)}</div>
      </div>
    );
  }
};

export default MessageBubble;
