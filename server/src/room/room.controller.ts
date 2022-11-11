import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { User } from "src/decorator/user.decorator";
import { JwtAuthGuard } from "src/user/jwt-auth.guard";
import { CreateRoomDto } from "./dto/create-room.dto";
import { RoomService } from "./room.service";

@Controller('room')
export class RoomController {
    constructor(private readonly roomService: RoomService) {

    }
    @Post('')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async createRoom(@User() userId: string, @Body() data: CreateRoomDto): Promise<any> {
        return this.roomService.createRoom({...data, members: [userId, ...data.members]})
    }

    @Get('')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async getRoomList(@User() userId: string): Promise<any> {
        const roomList = await this.roomService.getRoomList(userId);
        return roomList
    }
}