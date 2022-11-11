import { BadRequestException, Body, Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiConsumes } from "@nestjs/swagger";
import { existsSync, mkdir, mkdirSync, renameSync } from "fs";
import { uploadPath } from "src/config/file.config";
import { User } from "src/decorator/user.decorator";
import { JwtAuthGuard } from "src/user/jwt-auth.guard";
import { UserService } from "src/user/user.service";
import { ChatService } from "./chat.service";
import { ImageDto } from "./dto/image.dto";
import { MessageDto } from "./dto/message.dto";

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService, private readonly userService: UserService) { }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post(':roomId/message')
    async sendMessage(@User() userId: string, @Body() message: MessageDto, @Param('roomId') roomId: string): Promise<any> {
        const data = await this.chatService.saveMessage(userId, roomId, message.data, 'text')

        const user = await this.userService.findById(data.user_id);

        return {
            roomId: data.room_id,
            senderId: user.id,
            sender: user.name,
            data: data.data,
            type: data.type,
            timestamp: data.created_at
        }
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FileInterceptor('image', {
            dest: uploadPath,
            limits: { fileSize: 5 << 20 },
        }),
    )
    @ApiConsumes('multipart/form-data')
    @Post(':roomId/image')
    async sendImage(@User() userId: string, @Body() body: ImageDto, @Param('roomId') roomId: string, @UploadedFile() image: Express.Multer.File) {
        const message = await this.chatService.saveMessage(userId, roomId, '', 'image')
        const filepath = `${uploadPath}/images/${roomId}/${message.id}.${image.mimetype.split('/')[1]
            }`;
        if (!existsSync(`${uploadPath}/images/${roomId}`)) {
            mkdirSync(`${uploadPath}/images/${roomId}`)
        }
        renameSync(image.path, filepath);
        const data = await this.chatService.updateMesssageImagePath(message.id, filepath);
        const user = await this.userService.findById(data.user_id);

        return {
            roomId: data.room_id,
            senderId: user.id,
            sender: user.name,
            data: data.data,
            type: data.type,
            timestamp: data.created_at
        }
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