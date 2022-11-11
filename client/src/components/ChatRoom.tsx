import { Icon, IconButton, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import styles from "../styles/ChatRoom.module.css";
import MessageData from "../type/MessageData";
import MessageBubble from "./MessageBubble";
interface Props {
  callback: (message: MessageData) => void;
  messageList: Array<MessageData>;
  roomId: string;
  userId: string;
}
const ChatRoom = ({ callback, roomId, userId, messageList }: Props) => {
  const [message, setMessage] = useState("");
  const handleUploadFile = () => {
    document.getElementById('fileInput')?.click();
  }
  const handleSendImage = (file: File) => {
    const token = localStorage.getItem("token");
    if (token) {
      const formData = new FormData()
      formData.append('image', file)
      axios
        .post(
          `http://localhost:3000/api/chat/${roomId}/image`,
          formData,
          {
            headers: {
              Authorization: "Bearer " + token
            },
          }
        )
        .then((res) => {
          callback(res.data);
          setMessage("");
        });
    }

  }
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
          <MessageBubble userId={userId} message={msg} />
        ))}
      </div>
      <div className={styles.MessageField}>
        <IconButton onClick={handleUploadFile}>
          <Icon>file</Icon>
          <input id="fileInput" accept=".png,.svg,.jpg,.jpeg" type="file" hidden onChange={(e) => {
            if(e.target && e.target.files != null) {
              handleSendImage(e.target.files[0])
            }
          }} />
        </IconButton>
        <TextField
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => (e.key == "Enter" ? handleSendMessage() : () => {})}
        ></TextField>
        <IconButton onClick={handleSendMessage}>
          <Icon>send</Icon>
        </IconButton>
      </div>
    </div>
  );
};

export default ChatRoom;
