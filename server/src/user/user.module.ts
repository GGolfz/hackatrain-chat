import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { EnvironmentVariable } from "src/config/env.types";
import { PrismaService } from "src/prisma.service";
import { JwtStrategy } from "./jwt.strategy";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
    imports: [JwtModule.registerAsync({
        useFactory: async (
          configService: ConfigService<EnvironmentVariable>,
        ) => ({
          secret: configService.get('JWT_SECRET', { infer: true }),
          signOptions: { algorithm: 'HS512' },
          verifyOptions: { algorithms: ['HS512'] },
        }),
        inject: [ConfigService],
      }),],
    providers: [UserService, PrismaService, JwtStrategy],
    controllers: [UserController],
    exports: [UserService],
})
export class UserModule { }
