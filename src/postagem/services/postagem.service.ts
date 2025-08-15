import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TemaService } from "../../tema/services/tema.service";
import { DeleteResult, ILike, Repository } from "typeorm";
import { Postagem } from "../entities/postagem.entity";
//import { Postagem } from "src/postagem/entities/postagem.entity";

@Injectable()
export class PostagemService{
    findByTitulo(titulo: string): Promise<Postagem[]> {
        throw new Error("Method not implemented.");
    }
    constructor(
        @InjectRepository(Postagem)
        private postagemRepository: Repository<Postagem>,
        private temaService: TemaService
    ){}
    // buscar todas as informaçoes
    async findAll(): Promise<Postagem[]>{
        return await this.postagemRepository.find({
            relations:{
                tema: true,
                usuario:true
            }
        });
    }

    //busca por id
    async findbyId(id: number): Promise<Postagem>{
        const postagem = await this.postagemRepository.findOne({
            where :{
                id
            },
            relations:{
                tema: true,
                usuario:true
            }
        });

        if(!postagem)
            throw new HttpException('Postagem não encontrada', HttpStatus.NOT_FOUND);

        return postagem; 
    }

    // busca por titulo
    async findAllbyTitulo(titulo: string): Promise<Postagem[]>{
        return await this.postagemRepository.find({
            where:{
                titulo: ILike(`%${titulo}%`)
            },
            relations:{
                tema: true,
                usuario:true
            }
        })
    }

    // cadastrar postagem
    async create(postagem : Postagem): Promise<Postagem>{
        await this.temaService.findById(postagem.tema.id)

        return await this.postagemRepository.save(postagem);
    }

    // atualizar postagem
    async update(postagem : Postagem): Promise<Postagem>{
        await this.findbyId(postagem.id)

        await this.temaService.findById(postagem.tema.id)

        return await this.postagemRepository.save(postagem);
    }

    // deletar postagem
    async delete(id: number): Promise<DeleteResult>{
        await this.findbyId(id)

        return await this.postagemRepository.delete(id);
    }

}