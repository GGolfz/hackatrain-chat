import { app } from './app'
import { Server } from 'socket.io'
import { ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData, JoinRoomData, MessageData } from './type'
import { createServer } from 'http'

const PORT = 5050
const httpServer = createServer(app)
const io = new Server<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
>(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET"]
    }
});

io.on('connection', socket => {
    console.log('user connected')

    socket.on('joinRoom', (data: JoinRoomData) => {
        const { roomId, userId } = data
        console.log(`${userId} join ${roomId}`)
        socket.join(roomId);
    });

    socket.on('chatMessage', (data: MessageData) => {
        const { roomId,
            senderId,
            sender,
            message,
            timestamp } = data
        io.to(roomId).emit('message', { roomId, senderId, sender, message, timestamp });
    });


    socket.on('disconnect', () => {
        console.log(`user disconnected`)
    }
    );
});

httpServer.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})