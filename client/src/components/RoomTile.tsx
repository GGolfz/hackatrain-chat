import styles from "../styles/RoomTile.module.css";
import MessageData from "../type/MessageData";
import Room from "../type/Room";
import { formatTime } from "../utils/format";
interface Props {
  room: Room;
  currentRoom: Room | null;
  handleChangeRoom: () => void;
}
const RoomTile = ({ room, currentRoom, handleChangeRoom }: Props) => {
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
      </div>
    </div>
  );
};

export default RoomTile;
