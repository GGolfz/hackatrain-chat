import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import { RoomController } from "./room.controller";
import { RoomService } from "./room.service";

@Module({
    providers: [RoomService, PrismaService],
    controllers: [RoomController],
    exports: [RoomService],
})
export class RoomModule { }
