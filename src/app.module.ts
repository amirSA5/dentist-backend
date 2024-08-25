import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PatientModule } from './patient/patient.module';
import { AuthModule } from './auth/auth.module';
import { AppointmentModule } from './appointment/appointment.module';
import { NotificationModule } from './notification/notification.module';
import { Patient } from './patient/patient.entity/patient.entity';
import { Appointment } from './appointment/appointment/appointment';
import { Notification } from './notification/notification.entity/notification.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Patient, Appointment,Notification],  // Explicitly list entities here
      synchronize: true,
    }),
    PatientModule,
    AuthModule,
    AppointmentModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
