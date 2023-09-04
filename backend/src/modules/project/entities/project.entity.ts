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
import { IProjectParams, IProject } from '@lib/types';
import { User } from 'src/modules/user/entities/user.entity';
import { throws } from 'assert';

@Entity({ name: `project` })
export class Project implements IProject {
  constructor(params?: IProjectParams) {
    if (params) {
      this.projectName = params.projectName;
      this.projectInfo = params.projectInfo;
      this.projectCompensation = params.projectCompensation;
      this.users = params.users;
    }
  }

  // PrimaryGeneratedColumn decorator create error it store in uuid but return string
  // which cause in cassandra that's why we are using transformer feature
  @PrimaryColumn()
  @Generated('uuid')
  readonly id: string;

  @Column({
    length: 30,
    nullable: false,
  })
  projectName: string;

  @Column({
    length: 30,
    nullable: false,
  })
  projectInfo: string;

  @Column({
    length: 30,
    nullable: false,
  })
  projectCompensation: string;

  @Column({
    length: 100,
    nullable: true,
  })
  image: string;

  @Column()
  @CreateDateColumn()
  readonly createdAt: Date;

  @Column()
  @UpdateDateColumn()
  readonly updatedAt: Date;

  @ManyToMany(() => User, (user) => user.projects, { eager: true })
  @JoinTable()
  users: User[];

  setProjectName(projectName: string) {
    this.projectName = projectName;
  }

  setprojectInfo(projectInfo: string) {
    this.projectInfo = projectInfo;
  }
  setprojectCompensationName(projectCompensation: string) {
    this.projectCompensation = projectCompensation;
  }
  setImage(url: any) {
    this.image = url;
  }
}
