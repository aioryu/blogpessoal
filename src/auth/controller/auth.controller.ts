import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";
import { LocalAuthGuard } from "../guard/local-auth.guard";
import { AuthService } from "../service/auth.service";
import { UsuarioLogin } from "../entites/usuariologin.entites";

@Controller("/usuarios")
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post("/login")
  login(@Body() usuario: UsuarioLogin): Promise<any> {
    return this.authService.login(usuario);
  }
}