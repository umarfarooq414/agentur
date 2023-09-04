/* eslint-disable prettier/prettier */
import { ChatStatusEnum, IChat } from '@lib/types';
/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IChatParams, UserRoleEnum } from '@lib/types';

@Entity({ name: `chat` })
export class Chat implements IChat {
  constructor(params?: IChatParams) {
    if (params) {
      this.message = params.message;
      this.email = params.email;
      if (params.status) this.status = params.status;
      if (params.role) this.role = params.role;
    }
  }
  email?: string;
  status?: ChatStatusEnum;
  role?: UserRoleEnum;
  @PrimaryGeneratedColumn({})
  readonly id: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  message: string;

  @Column({
    nullable: true,
  })
  @CreateDateColumn()
  readonly createdAt: Date;

  @Column({ length: 36 })
  userId: string;

  @Column({ length: 36, nullable: true })
  sender: string;

  @Column({ length: 36, nullable: true })
  receiver: string;

  @Column({ nullable: true })
  @UpdateDateColumn()
  readonly updatedAt: Date;

  @Column({
    length: 100,
    nullable: true,
  })
  file: string;

  @Column({
    length: 50,
    nullable: true,
  })
  fileName: string;

  @Column({ nullable: true })
  seen: boolean;

  setFile(url: any) {
    this.file = url;
  }
  setFileName(name: string) {
    this.fileName = name;
  }
}
