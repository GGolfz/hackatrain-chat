import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { UserModule } from "src/user/user.module";
import { UserService } from "src/user/user.service";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";

@Module({
    imports: [UserModule],
    providers: [ChatService, PrismaService],
    controllers: [ChatController],
    exports: [ChatService],
})
export class ChatModule { }
