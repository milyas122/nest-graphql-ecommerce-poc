import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';

import { User } from './entities/user.entity';

@EventSubscriber()
export class AuthSubscriber implements EntitySubscriberInterface<User> {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return User;
  }

  beforeInsert(event: InsertEvent<User>): void | Promise<User> {
    event.entity.password = bcrypt.hashSync(event.entity.password, 10);
  }
}
