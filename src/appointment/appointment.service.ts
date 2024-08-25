import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm'; // Add Between import
import { Appointment } from './appointment/appointment'; // Corrected path
import { Patient } from '../patient/patient.entity/patient.entity'; // Corrected path
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    private notificationService: NotificationService,
  ) {}

  // Get all appointments (for admin)
  async getAllAppointments(): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      relations: ['patient'],
      order: { appointmentDate: 'DESC' },
    });
  }

  // Get appointments by patient ID (for patients)
  async getAppointmentsByPatientId(patientId: number): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      where: { patient: { id: patientId } },
      relations: ['patient'],
      order: { appointmentDate: 'DESC' },
    });
  }

  async bookAppointment(patientId: number, dentist: string, appointmentDate: Date, reason: string): Promise<Appointment> {
    const patient = await this.patientRepository.findOne({ where: { id: patientId } });
    if (!patient) {
      throw new Error('Patient not found');
    }

    const appointment = this.appointmentRepository.create({
      patient,
      dentist,
      appointmentDate,
      reason,
    });

    await this.appointmentRepository.save(appointment);

    // Send notification to the admin
    await this.notificationService.sendAppointmentNotification(appointment);

    return appointment;
  }

  async validateAppointment(appointmentId: number): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointmentId },
      relations: ['patient'],
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${appointmentId} not found`);
    }

    appointment.status = 'validated'; // Update the status to validated
    await this.appointmentRepository.save(appointment);

    // Send notification to the patient about the validation
    await this.notificationService.sendValidationNotification(appointment);

    return appointment;
  }

  // Get the number of visits per day
  async getVisitsPerDay(date: string): Promise<number> {
    const visits = await this.appointmentRepository.count({
      where: { appointmentDate: new Date(date) }, // Ensure appointmentDate is a Date object
    });
    return visits;
  }

  // Get the number of visits per month
  async getVisitsPerMonth(year: number, month: number): Promise<number> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const visits = await this.appointmentRepository.count({
      where: {
        appointmentDate: Between(startDate, endDate),
      },
    });
    return visits;
  }

  // Get patients who have an appointment on the current day
  async getTodayPatients(): Promise<Patient[]> {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const appointments = await this.appointmentRepository.find({
      where: { appointmentDate: new Date(today) }, // Ensure appointmentDate is a Date object
      relations: ['patient'],
    });
    return appointments.map((appointment) => appointment.patient);
  }

  // Get the total number of registered patients
  async getTotalPatients(): Promise<number> {
    return this.patientRepository.count();
  }
}
