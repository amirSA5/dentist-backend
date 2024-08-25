import { Controller, Get, Post, Body, Param, Patch, Query } from '@nestjs/common'; // Add Query
import { AppointmentService } from './appointment.service';
import { Appointment } from './appointment/appointment'; // Corrected path
import { Patient } from '../patient/patient.entity/patient.entity'; // Add Patient entity import

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  // Get all appointments (for admin)
  @Get('history')
  async getAllAppointments(): Promise<Appointment[]> {
    return this.appointmentService.getAllAppointments();
  }

  // Get appointment history for a specific patient
  @Get('history/:patientId')
  async getAppointmentsByPatientId(@Param('patientId') patientId: number): Promise<Appointment[]> {
    return this.appointmentService.getAppointmentsByPatientId(patientId);
  }

  @Post('book/:patientId')
  async bookAppointment(
    @Param('patientId') patientId: number,
    @Body('dentist') dentist: string,
    @Body('appointmentDate') appointmentDate: Date,
    @Body('reason') reason: string,
  ) {
    return this.appointmentService.bookAppointment(patientId, dentist, appointmentDate, reason);
  }

  @Patch('validate/:appointmentId')
  async validateAppointment(@Param('appointmentId') appointmentId: number): Promise<Appointment> {
    return this.appointmentService.validateAppointment(appointmentId);
  }

  // Get number of visits per day
  @Get('visits/day')
  async getVisitsPerDay(@Query('date') date: string): Promise<number> {
    return this.appointmentService.getVisitsPerDay(date);
  }

  // Get number of visits per month
  @Get('visits/month')
  async getVisitsPerMonth(
    @Query('year') year: number,
    @Query('month') month: number,
  ): Promise<number> {
    return this.appointmentService.getVisitsPerMonth(year, month);
  }

  // Get list of patients with appointments today
  @Get('today-patients')
  async getTodayPatients(): Promise<Patient[]> {
    return this.appointmentService.getTodayPatients();
  }

  // Get total number of patients
  @Get('total-patients')
  async getTotalPatients(): Promise<number> {
    return this.appointmentService.getTotalPatients();
  }
}
