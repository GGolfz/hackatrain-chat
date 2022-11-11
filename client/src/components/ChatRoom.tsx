import { Icon, IconButton, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import styles from "../styles/ChatRoom.module.css";
import MessageData from "../type/MessageData";
interface Props {
  callback: (message: MessageData) => void;
  messageList: Array<MessageData>;
  roomId: string;
}
const ChatRoom = ({ callback, roomId, messageList }: Props) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .post(
          `http://localhost:3000/api/chat/${roomId}/message`,
          {
            data: message,
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        )
        .then((res) => {
          callback(res.data);
          setMessage("");
        });
    }
  };

  return (
    <div className={styles.ChatRoom}>
      <div className={styles.MessageList}>
        {messageList.map((msg) => (
          <div>{msg.data}</div>
        ))}
      </div>
      <div className={styles.MessageField}>
        <TextField
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></TextField>
        <IconButton onClick={handleSendMessage}>
          <Icon>send</Icon>
        </IconButton>
      </div>
    </div>
  );
};

export default ChatRoom;
