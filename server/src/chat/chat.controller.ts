import { BadRequestException, Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { User } from "src/decorator/user.decorator";
import { JwtAuthGuard } from "src/user/jwt-auth.guard";
import { ChatService } from "./chat.service";
import { MessageDto } from "./dto/message.dto";

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post(':roomId/message')
    async sendMessage(@User() userId: string, @Body() message: MessageDto, @Param('roomId') roomId: string): Promise<any> {
        return this.chatService.saveMessage(userId, roomId, message.data, 'text')
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get(':roomId')
    async getMessages(@User() userId: string, @Param('roomId') roomId: string): Promise<any> {
        const userInRoom = await this.chatService.isUserInRoom(userId, roomId);
        if (!userInRoom) return new BadRequestException()
        return this.chatService.getMessage(roomId);
    }
}