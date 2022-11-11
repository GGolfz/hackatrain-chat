interface JoinRoomData {
    roomId: string;
    userId: string;
}

interface MessageData {
    roomId: string;
    senderId: string;
    sender: string;
    message: string;
    timestamp: string;
}
interface ServerToClientEvents {
    message: (data: MessageData) => void;
}

interface ClientToServerEvents {
    joinRoom: (data: JoinRoomData) => void;
    chatMessage: (data: MessageData) => void;
}

interface InterServerEvents {
    ping: () => void;
}

interface SocketData {
    userId: string;
}


export { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData, JoinRoomData, MessageData };