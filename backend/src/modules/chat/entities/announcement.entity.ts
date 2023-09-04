import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  PrimaryColumn,
} from 'typeorm';
@Entity({ name: `announcement` })
export class Announcement {
  @PrimaryColumn()
  id: string;

  @Column({
    nullable: true,
  })
  @CreateDateColumn()
  readonly createdAt: Date;

  @Column({ type: 'text', nullable: true })
  announcement: string;

  @Column({ length: 36, nullable: true })
  sender: string;

  @Column({ nullable: true })
  expiresAt: Date;

  @Column({ nullable: true })
  @UpdateDateColumn()
  readonly updatedAt: Date;
}
