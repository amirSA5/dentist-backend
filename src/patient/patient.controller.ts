import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { PatientService } from './patient.service';
import { Patient } from './patient.entity/patient.entity';
import { LoginPatientDto } from './dto/login-patient.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(): Promise<Patient[]> {
    return this.patientService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string): Promise<Patient> {
    return this.patientService.findOne(+id);
  }

  @Post()
  create(@Body() patient: Patient): Promise<Patient> {
    return this.patientService.create(patient);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateData: Partial<Patient>,
  ): Promise<Patient> {
    return this.patientService.update(+id, updateData);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.patientService.remove(+id);
  }
}
