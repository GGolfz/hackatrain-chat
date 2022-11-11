import { Body, Controller, Post } from "@nestjs/common";

@Controller('room')
export class RoomController {
    constructor() {

    }
    @Post('')
    async createRoom(@Body() data): Promise<any> {

    }
}