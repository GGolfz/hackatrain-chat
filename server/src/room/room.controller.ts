import { Body, Post } from "@nestjs/common";

export class RoomController {
    constructor() {

    }
    @Post('')
    async createRoom(@Body() data): Promise<any> {
        
    }
}