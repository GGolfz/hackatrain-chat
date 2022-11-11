import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class ImageDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;
}