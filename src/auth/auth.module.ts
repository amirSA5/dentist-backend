import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { PatientModule } from '../patient/patient.module';

@Module({
  imports: [
    PatientModule,
    PassportModule,
    JwtModule.register({
      secret: "yoursecretjwt",  // Ensure this matches your environment variable
      signOptions: { expiresIn: `3600s` },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
