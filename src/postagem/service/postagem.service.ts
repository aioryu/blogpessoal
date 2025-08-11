import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Postagem } from "../entities/postagem.entity";
import { DeleteResult, ILike, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { TemaService } from "../../tema/service/tema.service";


@Injectable()
export class PostagemService {
  constructor(
    @InjectRepository(Postagem)
    private postagemRepository: Repository<Postagem>,
    private temaService: TemaService,
  ) {}

  
  async findAll(): Promise<Postagem[]> {
    
    const postList = await this.postagemRepository.find({
      relations: {
        tema: true,
        usuario: true,
      },
    });

    
    if (postList.length === 0) {
      throw new HttpException(
        "Nenhuma postagem encontrada.",
        HttpStatus.NOT_FOUND,
      );
    }

    
    return postList;
  }

  
  async findById(id: number): Promise<Postagem> {
    
    const postagem = await this.postagemRepository.findOne({
      where: {
        id,
      },
      relations: {
        tema: true,
        usuario: true,
      },
    });

    
    if (!postagem)
      throw new HttpException("Postagem não encontrada", HttpStatus.NOT_FOUND);

    return postagem;
  }

  
  async findAllByTitulo(titulo: string): Promise<Postagem[]> {
    
    const postList = await this.postagemRepository.find({
      where: {
        
        titulo: ILike(`%${titulo}%`),
      },
      relations: {
        tema: true,
        usuario: true,
      },
    });

    
    if (postList.length === 0) {
      throw new HttpException(
        "Nenhuma postagem encontrada.",
        HttpStatus.NOT_FOUND,
      );
    }

    
    return postList;
  }

  
  async create(
    postagem: Postagem,
  ): Promise<{ message: string; postagem: Postagem }> {
    try {
      
      await this.temaService.findById(postagem.tema.id);
      
      const createdPost = await this.postagemRepository.save(postagem);
      return {
        message: "Postagem criada com sucesso!",
        postagem: createdPost,
      };
    } catch (error) {
      throw new HttpException(
        "Erro ao criar postagem! Verifique os dados enviados.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  
  async update(
    postagem: Postagem,
  ): Promise<{ message: string; postagem: Postagem }> {
    
    await this.findById(postagem.id);
    if (!postagem.id) {
      throw new HttpException("Postagem não encontrada", HttpStatus.NOT_FOUND);
    }

    
    await this.temaService.findById(postagem.tema.id);

    try {
      
      const updatedPost = await this.postagemRepository.save(postagem);
      return {
        message: "Postagem atualizada com sucesso!",
        postagem: updatedPost,
      };
    } catch (error) {
      throw new HttpException(
        "Erro ao atualizar a postagem! Verifique os dados enviados.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  
  async delete(id: number): Promise<{ message: string }> {
    
    await this.findById(id);
    try {
      await this.postagemRepository.delete(id);
      return {
        message: `Postagem de id ${id} deletada com sucesso!`,
      };
    } catch (error) {
      throw new HttpException(
        "Erro ao deletar postagem.",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}