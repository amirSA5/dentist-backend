import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from '../appointment/appointment/appointment';
import { Notification } from './notification.entity/notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async sendAppointmentNotification(appointment: Appointment) {
    // Ensure appointmentDate is a Date object
    const appointmentDate = new Date(appointment.appointmentDate);

    // Save the notification to the database
    const notification = this.notificationRepository.create({
      message: `New appointment booked by ${appointment.patient.firstName} ${appointment.patient.lastName} with ${appointment.dentist} on ${appointmentDate.toISOString()}.`,
      appointment,
      viewed: false, // New notifications are initially marked as not viewed
    });
    await this.notificationRepository.save(notification);

    console.log('Notification sent for appointment:', notification);
  }

  async getAllNotifications(): Promise<Notification[]> {
    return this.notificationRepository.find({
      relations: ['appointment', 'appointment.patient'],
      order: { createdAt: 'DESC' },
    });
  }

  async sendValidationNotification(appointment: Appointment) {
    const notification = this.notificationRepository.create({
      message: `Your appointment with ${appointment.dentist} on ${appointment.appointmentDate.toISOString()} has been validated.`,
      appointment,
      viewed: false,
    });

    await this.notificationRepository.save(notification);

    console.log('Validation notification sent:', notification);
  }
}
