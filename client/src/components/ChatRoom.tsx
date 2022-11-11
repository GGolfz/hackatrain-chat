import { Icon, IconButton, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import styles from "../styles/ChatRoom.module.css";
import MessageData from "../type/MessageData";
import Room from "../type/Room";
import MessageBubble from "./MessageBubble";
interface Props {
  callback: (message: MessageData) => void;
  messageList: Array<MessageData>;
  room: Room;
  userId: string;
  setCurrentRoom: (room: Room | null) => void;
}
const ChatRoom = ({
  callback,
  room,
  userId,
  messageList,
  setCurrentRoom,
}: Props) => {
  const [message, setMessage] = useState("");
  const handleUploadFile = () => {
    document.getElementById("fileInput")?.click();
  };
  const handleSendImage = (file: File) => {
    const token = localStorage.getItem("token");
    if (token) {
      // if file is svg, convert to png file
      const fileName = file.name;
      const fileExtension = fileName.split(".").pop();
      if (fileExtension === "svg") {
        const reader = new FileReader();
        reader.onload = (e) => {
          const svg = e.target?.result;
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const img = new Image();
          img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
              const newFile = new File([blob as Blob], fileName, {
                type: "image/png",
              });
              const formData = new FormData();
              formData.append("image", newFile);
              axios
                .post(
                  `http://localhost:3000/api/chat/${room.id}/image`,
                  formData,
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
            });
          };
          img.src = svg as string;
        };
        reader.readAsDataURL(file);
      } else {
        const formData = new FormData();
        formData.append("image", file);
        axios
          .post(`http://localhost:3000/api/chat/${room.id}/image`, formData, {
            headers: {
              Authorization: "Bearer " + token,
            },
          })
          .then((res) => {
            callback(res.data);
            setMessage("");
          });
      }
    }
  };
  const handleSendMessage = () => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .post(
          `http://localhost:3000/api/chat/${room.id}/message`,
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

  const renderBackButton = () => {
    if (window.screen.width < 1000) {
      return (
        <IconButton onClick={() => setCurrentRoom(null)}>
          <Icon>chevron_left</Icon>
        </IconButton>
      );
    }
    return null;
  };

  return (
    <div className={styles.ChatRoom}>
      <div>
        {renderBackButton()}
        <span className={styles.RoomTitle}>{room.name}</span>
      </div>
      <div className={styles.MessageList}>
        {messageList.map((msg) => (
          <MessageBubble userId={userId} message={msg} />
        ))}
      </div>
      <div className={styles.MessageField}>
        <IconButton onClick={handleUploadFile}>
          <Icon>image</Icon>
          <input
            id="fileInput"
            accept=".png,.svg,.jpg,.jpeg"
            type="file"
            hidden
            onChange={(e) => {
              if (e.target && e.target.files != null) {
                handleSendImage(e.target.files[0]);
              }
            }}
          />
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
