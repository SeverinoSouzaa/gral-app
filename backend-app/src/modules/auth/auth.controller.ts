import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginFormandoDto, LoginEquipeDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/formando')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login de Formando (App)' })
  @ApiResponse({ status: 200, description: 'Login bem-sucedido.' })
  @ApiResponse({ status: 400, description: 'Dados incompletos ou formato inválido.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  async loginFormando(@Body() loginDto: LoginFormandoDto) {
    return this.authService.loginFormando(loginDto);
  }

  @Post('login/equipe')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login da Equipe Interna (Admin)' })
  @ApiResponse({ status: 200, description: 'Login bem-sucedido.' })
  @ApiResponse({ status: 400, description: 'Dados incompletos ou formato inválido.' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  async loginEquipe(@Body() loginDto: LoginEquipeDto) {
    return this.authService.loginEquipe(loginDto);
  }
}
