import { Tema } from "./../entities/tema.entity";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, ILike, Repository } from "typeorm";


@Injectable()
export class TemaService {
  constructor(
    @InjectRepository(Tema)
    private temaRepository: Repository<Tema>,
  ) {}

  // --- Encontrar todos: ---
  async findAll(): Promise<Tema[]> {
    return await this.temaRepository.find({
      relations: {
        postagem: true,
      },
    });
  }

  // --- Encontrar pelo ID relacionando com postagem: ---
  async findById(id: number): Promise<Tema> {
    const tema = await this.temaRepository.findOne({
      where: {
        id,
      },
      relations: {
        postagem: true,
      },
    });

    if (!tema)
      throw new HttpException("Tema não encontrado!", HttpStatus.NOT_FOUND);

    return tema;
  }

  // --- Encontrar pela descrição, relacionando com postagem: ---
  async findAllByDescricao(descricao: string): Promise<Tema[]> {
    return await this.temaRepository.find({
      where: {
        descricao: ILike(`%${descricao}%`),
      },
      relations: {
        postagem: true,
      },
    });
  }

  // --- Criar novo tema: ---
  async create(tema: Tema): Promise<Tema> {
    return await this.temaRepository.save(tema);
  }

  // --- Atualizar um tema: ---
  async update(tema: Tema): Promise<Tema> {
    await this.findById(tema.id);

    return await this.temaRepository.save(tema);
  }

  // --- Deleta um tema: ---
  async delete(id: number): Promise<DeleteResult> {
    await this.findById(id);
    return await this.temaRepository.delete(id);
  }
}