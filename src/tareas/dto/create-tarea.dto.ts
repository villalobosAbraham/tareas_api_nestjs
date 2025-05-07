import { Type } from "class-transformer";
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTareaDto {
    @IsNotEmpty()
    @IsString()
    tarea: string;

    @IsNotEmpty()
    @IsString()
    descripcion: string;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    fechaCreacion?: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    fechaCompletado?: Date;

    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    activo?: boolean;
}
