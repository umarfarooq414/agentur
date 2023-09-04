import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  PrimaryColumn,
  Generated,
  OneToOne,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import {
  IUserParams,
  IUser,
  UserStatusEnum,
  UserRoleEnum,
  SocialProviderEnum,
} from '@lib/types';
import { Project } from 'src/modules/project/entities/project.entity';
import { Documents } from './document.entity';
@Entity({ name: `user` })
export class User implements IUser {
  constructor(params?: IUserParams) {
    if (params) {
      this.userName = params.userName;
      this.firstName = params.firstName;
      this.lastName = params.lastName;
      this.email = params.email;
      if (params.status) this.setStatus(params.status);
      if (params.role) this.role = params.role;
    }
  }

  @PrimaryColumn()
  @Generated('uuid')
  readonly id: string;

  @Column({
    length: 30,
    nullable: false,
    unique: true,
  })
  userName: string;

  @Column({
    length: 30,
    nullable: true,
  })
  firstName: string;

  @Column({
    length: 30,
    nullable: true,
  })
  lastName: string;

  @Index({ unique: true })
  @Column({
    length: 100,
    nullable: false,
  })
  readonly email: string;

  @Column({ nullable: true })
  password?: string;

  @Column({
    nullable: true,
    type: `enum`,
    enum: SocialProviderEnum,
    default: null,
  })
  SocialProvider?: SocialProviderEnum;

  @Column({
    type: `enum`,
    enum: UserStatusEnum,
    default: UserStatusEnum.INACTIVE,
  })
  status: UserStatusEnum = UserStatusEnum.INACTIVE;

  @Column({
    type: `enum`,
    enum: UserRoleEnum,
    default: UserRoleEnum.MEMBER,
  })
  role: UserRoleEnum = UserRoleEnum.MEMBER;

  @Column()
  @CreateDateColumn()
  readonly createdAt: Date;

  @Column()
  @UpdateDateColumn()
  readonly updatedAt: Date;

  @ManyToMany(() => Project, (project) => project.users, {
    onDelete: 'CASCADE',
  })
  projects: Project[];

  @OneToMany(() => Documents, (document) => document.user, {
    eager: true,
    cascade: true,
  })
  documents: Documents[];

  // Methods
  setStatus(status: UserStatusEnum) {
    this.status = status;
  }

  setPassword(password: string) {
    this.password = password;
  }

  setFirstName(firstName: string) {
    this.firstName = firstName;
  }

  setLastName(lastName: string) {
    this.lastName = lastName;
  }
}
