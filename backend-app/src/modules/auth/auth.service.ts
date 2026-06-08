import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { LoginFormandoDto, LoginEquipeDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async loginFormando(loginDto: LoginFormandoDto) {
    const cpfLimpo = loginDto.cpf.replace(/\D/g, '');
    const usuario = await this.usersService.findByCpf(cpfLimpo);

    if (!usuario || !usuario.formando) {
      throw new UnauthorizedException('Credenciais inválidas ou usuário não é formando');
    }

    if (usuario.formando.turma.codigoAcesso !== loginDto.codigoTurma) {
      throw new UnauthorizedException('Credenciais inválidas (Código da turma incorreto)');
    }

    const payload = {
      sub: usuario.id,
      email: usuario.email,
      tipoUsuario: usuario.tipoUsuario,
      turmaId: usuario.formando.turmaId,
      nivelAcesso: null,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        cpf: usuario.cpf,
        tipoUsuario: usuario.tipoUsuario,
      },
    };
  }

  async loginEquipe(loginDto: LoginEquipeDto) {
    const usuario = await this.usersService.findByEmail(loginDto.email);

    if (!usuario || !usuario.equipeInterna) {
      throw new UnauthorizedException('Credenciais inválidas ou usuário não pertence à Equipe Interna');
    }

    if (!usuario.senha) {
      throw new UnauthorizedException('Credenciais inválidas (Usuário sem senha)');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.senha, usuario.senha);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = {
      sub: usuario.id,
      email: usuario.email,
      tipoUsuario: usuario.tipoUsuario,
      turmaId: null,
      nivelAcesso: usuario.equipeInterna.nivelAcesso,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipoUsuario: usuario.tipoUsuario,
        nivelAcesso: usuario.equipeInterna.nivelAcesso,
      },
    };
  }
}
