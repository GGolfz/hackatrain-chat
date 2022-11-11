import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { UserService } from "src/user/user.service";

@Injectable()
export class ChatService {
    constructor(private prismaService: PrismaService) { }
    async updateMesssageImagePath(message_id: string, path: string) {
        return await this.prismaService.message.update({
            data: {
                data: path
            }, where: {
                id: message_id,
            }
        });
    }
    async saveMessage(user_id: string, room_id: string, data: string, type: string) {
        const message = await this.prismaService.message.create({
            data: {
                user_id,
                room_id,
                data,
                type,
            }
        })
        return message;
    }
    async isUserInRoom(user_id: string, room_id: string) {
        const data = await this.prismaService.user_room.findFirst({
            where: {
                user_id,
                room_id
            }
        });
        return data != null
    }
    async getMessage(room_id: string) {
        const messageList = await this.prismaService.message.findMany({
            where: {
                room_id: room_id
            },
            include: {
                user: true
            },
            orderBy: {
                created_at: "asc"
            }
        })
        return messageList.map(m => ({
            roomId: m.room_id,
            senderId: m.user.id,
            sender: m.user.name,
            data: m.data,
            type: m.type,
            timestamp: m.created_at
        }))
    }
}