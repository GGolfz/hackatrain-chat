import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) { }
    async generateToken(user_id: string): Promise<string> {
        return await this.jwtService.signAsync({ id: user_id });
    }
    async createUser(data: CreateUserDto) {
        const user = await this.prisma.user.create({
            data: {
                name: data.name,
            }
        })
        const token = await this.generateToken(user.id);
        return {
            message: "User created successfully",
            token,
            status: 201
        }
    }

    async findById(id: string) {
        const data = await this.prisma.user.findUnique({
            where: {
                id
            }
        })
        return data;
    }

    async getUserList(userId: string) {
        const data = await this.prisma.user.findMany({
            where: {
                NOT: {
                    id: userId
                }
            }
        });
        return data;
    }
}