import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    usuario: string;

    @Column()
    correo: string;
    
    @Column()
    password: string;

    @Column( {
        name: 'fecha_creacion',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    fechaCreacion: Date;

    @Column( { default: true })
    activo: boolean;
}
