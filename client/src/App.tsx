import { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import "./App.css";
import RoomTile from "./components/RoomTile";
import MessageData from "./type/MessageData";
import Room from "./type/Room";
let socket;
function App() {
  const mockRoom = [
    {
      roomId: "1",
      roomName: 'Room 1',
      latestMessage: {
        roomId: "1",
        senderId: "1",
        sender: 'Sender 1',
        message: 'สวัสดี',
        timestamp: new Date().toUTCString()
      } as MessageData
    } as Room,
    {
      roomId: "2",
      roomName: 'Room 2',
      latestMessage: {
        roomId: "1",
        senderId: "1",
        sender: 'Sender 1',
        message: 'สวัสดี',
        timestamp: new Date().toUTCString()
      } as MessageData
    } as Room,
    {
      roomId: "3",
      roomName: 'Room 3',
      latestMessage: {
        roomId: "1",
        senderId: "1",
        sender: 'Sender 1',
        message: 'สวัสดี',
        timestamp: new Date().toUTCString()
      } as MessageData
    } as Room
  ]
  useEffect(() => {
    socket = socketIOClient("http://localhost:5050");
  }, []);

  return <div className="App">
    <div className="roomList">
      <div className="roomListTitle">Room List</div>
      {
        mockRoom.map(room => <RoomTile room={room} />)
      }
    </div>
    <div className="room">

    </div>
  </div>;
}

export default App;
