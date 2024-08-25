import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Appointment } from '../../appointment/appointment/appointment';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @Column({ default: false })
  viewed: boolean;

  @ManyToOne(() => Appointment, (appointment) => appointment.notifications)
  appointment: Appointment;

  @CreateDateColumn()
  createdAt: Date;
}
