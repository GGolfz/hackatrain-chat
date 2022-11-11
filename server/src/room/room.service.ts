import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { CreateRoomDto } from "./dto/create-room.dto";

@Injectable()
export class RoomService {
    constructor(private prismaService: PrismaService) { }
    async createRoom(data: CreateRoomDto): Promise<any> {
        const room = await this.prismaService.room.create({
            data: {
                name: data.name,
            }
        })
        await this.prismaService.user_room.createMany({
            data: data.members.map((user) => ({
                user_id: user,
                room_id: room.id,
            }))
        })
        return room;
    }

    async getRoomList(userId: string): Promise<any> {
        const roomList = await this.prismaService.user_room.findMany({
            include: {
                room: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            where: {
                user_id: userId,
            }
        })
        return roomList.map(r => r.room)
    }
}