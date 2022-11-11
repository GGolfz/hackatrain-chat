import styles from "../styles/RoomTile.module.css";
import MessageData from "../type/MessageData";
import Room from "../type/Room";
interface Props {
  room: Room;
}
const RoomTile = ({ room }: Props) => {
  const getRandomColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  }
  const formatTime = (time: string) => {
    const date = new Date(time);
    return date.getHours() + ":" + date.getMinutes();
  }
  const renderMessage = (msg: MessageData) => {
    if(msg.type == 'text') {
      return `${room.latestMessage.sender}: ${room.latestMessage.data}`;
    } else if(msg.type == 'image') {
      return `${room.latestMessage.sender} send an image`
    }
  }
  return (
    <div className={styles.RoomTile}>
      <div className={styles.RoomAvatar} style={{background: getRandomColor()}}></div>
      <div className={styles.RoomDetail}>
        <div>{room.roomName}</div>
        <div>
          {renderMessage(room.latestMessage)} ·{" "}
          {formatTime(room.latestMessage.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default RoomTile;
