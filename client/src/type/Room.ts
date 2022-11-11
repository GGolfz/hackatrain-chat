import MessageData from "./MessageData";

interface Room {
    id: string;
    name: string;
    latestMessage?: MessageData;
}

export default Room;