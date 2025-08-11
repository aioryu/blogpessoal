import { IsNotEmpty } from "class-validator";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Tema } from "../../tema/entities/tema.entity";
import { Usuario } from "../../usuario/entities/usuario.entities";



@Entity({ name: "tb_postagens" })

// Exporta a classe "Postagem".
export class Postagem {
  
  @PrimaryGeneratedColumn()
  id: number;

  
  @IsNotEmpty()
  @Column({ length: 100, nullable: false })
  titulo: string;

  
  @IsNotEmpty()
  @Column({ length: 1000, nullable: false })
  texto: string;

 
  @UpdateDateColumn()
  data: Date;

  
  @ManyToOne(() => Tema, (tema) => tema.postagem, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "tema_id" })
  tema: Tema;

  
  @ManyToOne(() => Usuario, (usuario) => usuario.postagem, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "usuario_id" })
  usuario: Usuario;
}