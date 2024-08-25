import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './patient.entity/patient.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  findAll(): Promise<Patient[]> {
    return this.patientRepository.find();
  }

  findOne(id: number): Promise<Patient> {
    return this.patientRepository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<Patient> {
    return this.patientRepository.findOneBy({ email });
  }

  async create(patient: Patient): Promise<Patient> {
    const salt = await bcrypt.genSalt();
    patient.password = await bcrypt.hash(patient.password, salt);
    return this.patientRepository.save(patient);
  }

  async update(id: number, updateData: Partial<Patient>): Promise<Patient> {
    const patient = await this.patientRepository.findOneBy({ id });
    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    if (updateData.password) {
      const salt = await bcrypt.genSalt();
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    Object.assign(patient, updateData);
    return this.patientRepository.save(patient);
  }

  async remove(id: number): Promise<void> {
    await this.patientRepository.delete(id);
  }

  async login(email: string, password: string): Promise<Patient> {
    const patient = await this.findByEmail(email);
    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    const isPasswordValid = await bcrypt.compare(password, patient.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return patient;
  }
}
