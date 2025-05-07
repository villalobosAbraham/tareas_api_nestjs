import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    usuario: string;
    
    @IsString()
    correo: string;
    
    @IsString()
    password: string;
    
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    fechaCreacion?:Date;

    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    activo?:boolean;
}
