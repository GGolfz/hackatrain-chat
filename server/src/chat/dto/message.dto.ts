import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";

export class MessageDto {
    
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    data: string;
}