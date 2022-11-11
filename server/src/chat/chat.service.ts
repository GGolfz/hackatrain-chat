import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";

@Injectable()
export class ChatService {
    constructor(private prismaService: PrismaService) { }
    async saveMessage(user_id: string, room_id: string, data: string, type: string) {
        return this.prismaService.message.create({
            data: {
                user_id,
                room_id,
                data,
                type,
            }
        })
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
        return this.prismaService.message.findMany({
            where: {
                room_id: room_id
            },
            orderBy: {
                created_at: "asc"
            }
        })
    }
}