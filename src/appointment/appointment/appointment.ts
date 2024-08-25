import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany } from 'typeorm';
import { Patient } from '../../patient/patient.entity/patient.entity';
import { Notification } from '../../notification/notification.entity/notification.entity';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Patient, (patient) => patient.appointments)
  patient: Patient;

  @OneToMany(() => Notification, (notification) => notification.appointment)
  notifications: Notification[];

  @Column()
  dentist: string;

  @Column()
  appointmentDate: Date;

  @Column()
  reason: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: 'pending' }) // Add this column
  status: string;
}
