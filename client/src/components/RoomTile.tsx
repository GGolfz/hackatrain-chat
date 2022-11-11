import styles from "../styles/RoomTile.module.css";
import MessageData from "../type/MessageData";
import Room from "../type/Room";
interface Props {
  room: Room;
  currentRoom: Room | null;
  handleChangeRoom: () => void;
}
const RoomTile = ({ room, currentRoom, handleChangeRoom }: Props) => {
  const formatTime = (time: string) => {
    const date = new Date(time);
    return date.getHours() + ":" + date.getMinutes();
  };
  const renderMessage = (msg: MessageData) => {
    if (msg.type == "text") {
      return `${msg.sender}: ${msg.data}`;
    } else if (msg.type == "image") {
      return `${msg.sender} send an image`;
    }
  };
  const getRoomStyle = () => {
    if (currentRoom != null) {
      if (room.id == currentRoom.id) {
        return {
          background: "#eee",
        };
      }
    }
    return {}
  };
  return (
    <div className={styles.RoomTile} style={getRoomStyle()} onClick={() => handleChangeRoom()}>
      <div className={styles.RoomAvatar}></div>
      <div className={styles.RoomDetail}>
        <div>{room.name}</div>
        {room.latestMessage ? (
          <div>
            {renderMessage(room.latestMessage)} ·{" "}
            {formatTime(room.latestMessage.timestamp)}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default RoomTile;
