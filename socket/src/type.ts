interface JoinRoomData {
    roomId: string;
    userId: string;
}
interface RoomCreateData {
    member: Array<string>;
}
interface MessageData {
    roomId: string;
    senderId: string;
    sender: string;
    data: string;
    type: string;
    timestamp: string;
}
interface ServerToClientEvents {
    message: (data: MessageData) => void;
    roomCreated: (data: RoomCreateData) => void;
}

interface ClientToServerEvents {
    joinRoom: (data: JoinRoomData) => void;
    leaveRoom: (data: JoinRoomData) => void;
    chatMessage: (data: MessageData) => void;
    roomCreated: (data: RoomCreateData) => void;
}

interface InterServerEvents {
    ping: () => void;
}

interface SocketData {
    userId: string;
}


export { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData, JoinRoomData, MessageData, RoomCreateData };