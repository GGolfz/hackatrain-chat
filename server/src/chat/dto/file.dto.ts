import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsArray } from "class-validator";

export class FileDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;
}