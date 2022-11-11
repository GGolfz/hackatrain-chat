import { Fragment, useEffect, useState } from "react";
import socketIOClient, { Socket } from "socket.io-client";
import "./App.css";
import LoginScreen from "./components/LoginScreen";
import RoomTile from "./components/RoomTile";
import MessageData from "./type/MessageData";
import Room from "./type/Room";
import UserData from "./type/UserData";
import axios from "axios";
import ReactModal from "react-modal";
import CreateRoomModal from "./components/CreateRoomModal";
import { Button, IconButton, TextField } from "@mui/material";
import Icon from "@mui/material/Icon";
import ChatRoom from "./components/ChatRoom";

let socket: Socket;
function App() {
  const [user, setUser] = useState<UserData | null>(null);
  const [roomList, setRoomList] = useState<Array<Room>>([]);
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchVal, setSearch] = useState("");

  const [messageList, setMessageList] = useState<Array<MessageData>>([]);

  useEffect(() => {
    socket = socketIOClient("http://localhost:5050");
    socket.on("roomCreated", (member) => {
      handleRoomCreatedNotified(member.member);
    });
    socket.on("message", (message) => {
      handleReceiveMessage(message);
    });
    return () => {
      socket.off("roomCreated");
      socket.off("message");
    };
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getUserData(token);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchRoomList();
      socket.off("roomCreated");
      socket.on("roomCreated", (member) => {
        handleRoomCreatedNotified(member.member);
      });
    }
  }, [user]);

  useEffect(() => {
    if (currentRoom == null) {
      if (roomList.length > 0) {
        setCurrentRoom(roomList[0]);
      }
    }
  }, [roomList]);

  useEffect(() => {
    if (currentRoom) {
      if (socket) {
        socket.emit("joinRoom", {
          roomId: currentRoom.id,
          userId: user?.id,
        });
      }
      fetchMessageList(currentRoom.id);
    }
  }, [currentRoom]);

  useEffect(() => {
    if (socket) {
      socket.off("message");
      socket.on("message", (message) => {
        handleReceiveMessage(message);
      });
    }
  }, [messageList]);

  const handleRoomCreatedNotified = (member: Array<string>) => {
    if (user) {
      const userId = user.id;
      if (member.includes(userId)) {
        fetchRoomList();
      }
    }
  };

  const handleCreateRoom = (member: Array<string>) => {
    if (socket) {
      socket.emit("roomCreated", {
        member: member,
      });
    }
    fetchRoomList();
    setShowModal(false);
  };

  const handleReceiveMessage = (message: MessageData) => {
    if (message.senderId != user?.id) {
      setMessageList([...messageList, message]);
    }
  };

  const handleSendMessage = (message: MessageData) => {
    if (socket) {
      setMessageList([...messageList, message]);
      socket.emit("chatMessage", message);
    }
  };

  const fetchMessageList = (id: string) => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:3000/api/chat/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setMessageList(res.data);
      });
  };

  const fetchRoomList = () => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:3000/api/room", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setRoomList(res.data);
      });
  };

  const getUserData = (token: string) => {
    axios
      .get("http://localhost:3000/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleLogin = (name: string) => {
    axios
      .post("http://localhost:3000/api/user", { name })
      .then((res) => {
        const token = res.data.token;
        if (token) {
          localStorage.setItem("token", token);
          getUserData(token);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleChangeRoom = (room: Room) => {
    if (socket) {
      socket.emit("leaveRoom", {
        roomId: currentRoom?.id,
        userId: user?.id,
      });
    }
    setCurrentRoom(room);
  };

  return (
    <div className="App">
      {user ? (
        <Fragment>
          {showModal ? (
            <CreateRoomModal
              setShowModal={setShowModal}
              showModal={showModal}
              callback={handleCreateRoom}
            />
          ) : null}
          <div className="leftPanel">
            <div className="userDetail">
              <div className="userAvatar"></div>
              <div>{user.name}</div>
              <div className="searchContainer">
                <TextField
                  fullWidth
                  placeholder="Search"
                  value={searchVal}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                ></TextField>
                <IconButton onClick={() => setShowModal(true)}>
                  <Icon>add</Icon>
                </IconButton>
              </div>
            </div>
            <div className="roomList">
              <div className="roomListTitle">Chats</div>
              <div className="roomListScroll">
                {roomList
                  .filter((room) =>
                    room.name.toLowerCase().includes(searchVal.toLowerCase())
                  )
                  .map((room) => (
                    <RoomTile
                      room={room}
                      currentRoom={currentRoom}
                      handleChangeRoom={() => handleChangeRoom(room)}
                    />
                  ))}
              </div>
            </div>
          </div>
          <div className="rightPanel">
            {currentRoom ? (
              <ChatRoom
                messageList={messageList}
                userId={user.id}
                roomId={currentRoom.id}
                callback={handleSendMessage}
              />
            ) : null}
          </div>
        </Fragment>
      ) : (
        <LoginScreen handleLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
