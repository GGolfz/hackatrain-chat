
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { User } from "src/decorator/user.decorator";
import { CreateUserDto } from "./dto/create-user.dto";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { UserService } from "./user.service";

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {

    }
    @Get('list')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async getUserList(@User() userId: string): Promise<any> {
        return this.userService.getUserList(userId);
    }
    @Get('')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async getUser(@User() userId: string): Promise<any> {
        return this.userService.findById(userId);
    }

    @ApiOperation({summary: 'Create a new user'})
    @Post()
    async createUser(@Body() data: CreateUserDto): Promise<any> {
        return this.userService.createUser(data);
    }
}