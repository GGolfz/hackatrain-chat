import MessageData from "./MessageData";

interface Room {
    roomId: string;
    roomName: string;
    latestMessage: MessageData;
}

export default Room;