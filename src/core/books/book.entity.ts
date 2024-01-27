import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import { Member } from '../members/member.entity';

@Entity({ name: 'books' })
export class Book {
  @PrimaryColumn()
  code: string;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  stock: number;

  @ManyToMany(() => Book, (book) => book.members)
  members: Member[];
}
