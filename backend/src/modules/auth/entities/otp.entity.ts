import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  Generated,
} from 'typeorm';
import { IOtp, IOtpParams } from '@lib/types';

@Entity({ name: `otp` })
export class Otp implements IOtp {
  constructor(params?: IOtpParams) {
    if (params) {
      this.userId = params.userId;
      this.otp = params.otp;
    }
  }

  @PrimaryColumn()
  @Generated('uuid')
  readonly id: string;

  @Column({
    nullable: false,
  })
  readonly userId: string;

  @Column({
    nullable: false,
  })
  readonly otp: number;

  @Column()
  @CreateDateColumn()
  readonly createdAt: Date;

  @Column()
  @UpdateDateColumn()
  readonly updatedAt: Date;
}
