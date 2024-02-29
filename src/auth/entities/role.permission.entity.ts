import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class RolePermission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  permission: string;

  @Column()
  description: string;

  @ManyToMany(() => User, (user) => user.permissions)
  @JoinTable()
  users: Relation<User[]>;

  constructor(entity: Partial<RolePermission>) {
    Object.assign(this, entity);
  }
}
