import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Item } from './item.entity';
import { User } from './user.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  total: number;

  @CreateDateColumn() // sets automatically to the date attribute the entity`s insertion time
  date: Date;

  @ManyToOne(() => User, (user) => user.orders) // indicates a relation where 'Order' contains only one 'User' instance
  user: User; // 'Order' is only assigned to a specific 'User'
  // will create some foreign keys in the database tables

  @OneToMany(() => Item, (item) => item.order, { cascade: ['insert'] }) // indicates a relation where 'Order' contains multiple 'Items' instances
  items: Item[]; // when we save the order instance, the array of items of that order will be saved too

  getId(): number {
    return this.id;
  }

  setId(id: number) {
    this.id = id;
  }

  getTotal(): number {
    return this.total;
  }

  setTotal(total: number) {
    this.total = total;
  }

  getDate() {
    return this.date;
  }

  setDate(date: Date) {
    this.date = date;
  }

  getUser(): User {
    return this.user;
  }

  setUser(user: User) {
    this.user = user;
  }

  getItems(): Item[] {
    return this.items;
  }

  setItems(items: Item[]) {
    this.items = items;
  }
}
