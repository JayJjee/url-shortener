import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
@Entity()
export class Url {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  originalUrl: string;

  @Column({ unique: true })
  shortUrl: string;

  @Column()
  @ManyToOne(() => User, (user) => user.urls, { nullable: true })
  userId: number | null;

  @Column({ default: 0 })
  clicks: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;
}
