import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PatientService } from '../patient/patient.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly patientService: PatientService,
    private readonly jwtService: JwtService,
  ) {}

  async validatePatient(email: string, password: string): Promise<any> {
    const patient = await this.patientService.findByEmail(email);
    if (patient && (await bcrypt.compare(password, patient.password))) {
      const { password, ...result } = patient;
      return result;
    }
    return null;
  }

  async login(patient: any) {
    const payload = { email: patient.email, sub: patient.id };
   
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
