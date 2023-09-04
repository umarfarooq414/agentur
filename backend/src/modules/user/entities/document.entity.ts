/* eslint-disable prettier/prettier */
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  Generated,
} from 'typeorm';
import { Uuid, UuidTransformer } from '@lib/utils';
import {
  IProjectParams,
  IProject,
  DocumentStatusEnum,
  DocumentNameEnum,
} from '@lib/types';
import { User } from 'src/modules/user/entities/user.entity';
import { throws } from 'assert';

@Entity({ name: `documents` })
export class Documents {
  @PrimaryColumn()
  @Generated('uuid')
  readonly id: string;

  @Column({
    type: 'enum',
    nullable: true,
    enum: DocumentNameEnum,
  })
  name: DocumentNameEnum;

  @Column({
    length: 250,
    nullable: true,
  })
  link: string;

  @Column({
    length: 250,
    nullable: true,
  })
  reason: string;

  @Column({
    type: 'enum',
    enum: DocumentStatusEnum,
    default: DocumentStatusEnum.PENDING,
  })
  status: DocumentStatusEnum;

  @Column()
  @CreateDateColumn()
  readonly createdAt: Date;

  @Column()
  @UpdateDateColumn()
  readonly updatedAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;
}
