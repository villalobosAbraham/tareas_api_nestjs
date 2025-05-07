import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Tarea {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    tarea: string;

    @Column()
    descripcion: string;

    @ManyToOne(() => User, { nullable: false }) 
    @JoinColumn({ name: 'id_usuario' })         
    usuario: User;

    @Column( {
        name: 'fecha_creacion',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP'
    })
    fechaCreacion: Date;

    @Column( {
        name: 'fecha_completada',
        type: 'timestamp',
        nullable: true,
    })
    fechaCompletado: Date;

    @Column( { default: true })
    activo: boolean;
}
