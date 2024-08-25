import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginPatientDto } from '../patient/dto/login-patient.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginPatientDto: LoginPatientDto) {
    const patient = await this.authService.validatePatient(
      loginPatientDto.email,
      loginPatientDto.password,
    );
    if (!patient) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(patient);
  }
}
