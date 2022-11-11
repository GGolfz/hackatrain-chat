import { BadRequestException, Body, Controller, Get, Header, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBearerAuth, ApiConsumes } from "@nestjs/swagger";
import { Response } from "express";
import { createReadStream, existsSync, mkdir, mkdirSync, renameSync } from "fs";
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
        const fileExt = image.mimetype.split('/')[1].split('+')[0];
        const filepath = `${uploadPath}/images/${roomId}/${message.id}.${fileExt}`;
        if (!existsSync(`${uploadPath}/images/${roomId}`)) {
            mkdirSync(`${uploadPath}/images/${roomId}`)
        }
        renameSync(image.path, filepath);
        const data = await this.chatService.updateMesssageImagePath(message.id, filepath.split(`${uploadPath}/images/`)[1]);
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

    @Get('image/:roomId/:fileName')
    @Header('Content-Type', '')
    async getImage(@Res() response: Response, @Param('roomId') roomId: string, @Param('fileName') fileName: string) {
        // console.log(fileName)
        const pipe = createReadStream(`${uploadPath}/images/${roomId}/${fileName}`);
        pipe.pipe(response)
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