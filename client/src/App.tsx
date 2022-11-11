import { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import "./App.css";
import RoomTile from "./components/RoomTile";
import MessageData from "./type/MessageData";
import Room from "./type/Room";
import UserData from "./type/UserData";
let socket;
function App() {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    setUser({
      userId: "1",
      name: "Tester"
    })
  }, [])
  const mockRoom = [
    {
      roomId: "1",
      roomName: "Room 1",
      latestMessage: {
        roomId: "1",
        senderId: "1",
        sender: "Sender 1",
        data: "สวัสดี",
        type: "image",
        timestamp: new Date().toUTCString(),
      } as MessageData,
    } as Room,
    {
      roomId: "2",
      roomName: "Room 2",
      latestMessage: {
        roomId: "1",
        senderId: "1",
        sender: "Sender 1",
        data: "สวัสดี",
        type: "text",
        timestamp: new Date().toUTCString(),
      } as MessageData,
    } as Room,
    {
      roomId: "3",
      roomName: "Room 3",
      latestMessage: {
        roomId: "1",
        senderId: "1",
        sender: "Sender 1",
        data: "สวัสดี",
        type: "text",
        timestamp: new Date().toUTCString(),
      } as MessageData,
    } as Room,
  ];
  const msgList = [
    {
      roomId: "1",
      senderId: "1",
      sender: "Sender 1",
      data: "สวัสดี",
      type: "text",
      timestamp: new Date().toUTCString(),
    },
    {
      roomId: "1",
      senderId: "2",
      sender: "Sender 1",
      data: "สวัสดี",
      type: "text",
      timestamp: new Date().toUTCString(),
    },
  ];
  useEffect(() => {
    socket = socketIOClient("http://localhost:5050");
  }, []);

  return (
    <div className="App">
      <div className="roomList">
        <div className="roomListTitle">Room List</div>
        {mockRoom.map((room) => (
          <RoomTile room={room} />
        ))}
      </div>
      <div className="room">
        {
          msgList.map((msg) => (
            <div>{msg.data}</div>
          ))
        }
      </div>
    </div>
  );
}

export default App;
