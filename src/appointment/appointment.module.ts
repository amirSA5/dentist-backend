import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { Appointment } from './appointment/appointment';
import { Patient } from '../patient/patient.entity/patient.entity';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, Patient]), // Import entities here
    NotificationModule,
  ],
  providers: [AppointmentService],
  controllers: [AppointmentController],
})
export class AppointmentModule {}
