import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Tema } from '../../tema/entities/tema.entity';
import { Postagem } from '../../postagem/entities/postagem.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProdService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    // Verifica se está usando DATABASE_URL (para produção) ou variáveis separadas
    const databaseUrl = this.configService.get('DATABASE_URL');
    
    if (databaseUrl) {
      // Configuração para produção (usando URL)
      return {
        type: 'postgres',
        url: databaseUrl,
        logging: false,
        dropSchema: false,
        ssl: {
          rejectUnauthorized: false,
        },
        synchronize: true,
        autoLoadEntities: true,
        entities: [Usuario, Tema, Postagem]
      };
    } else {
      // Configuração para desenvolvimento local
      return {
        type: 'postgres',
        host: this.configService.get('DB_HOST', 'localhost'),
        port: this.configService.get('DB_PORT', 5432),
        username: this.configService.get('DB_USERNAME', 'postgres'),
        password: this.configService.get('DB_PASSWORD', 'postgres'),
        database: this.configService.get('DB_DATABASE', 'blogpessoal'),
        logging: false,
        synchronize: true,
        autoLoadEntities: true,
        entities: [Usuario, Tema, Postagem]
      };
    }
  }
}