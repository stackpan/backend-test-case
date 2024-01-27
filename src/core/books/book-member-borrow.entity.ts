import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Book } from './book.entity';
import { Member } from '../members/member.entity';

@Entity({ name: 'book_member_borrows' })
export class BookMemberBorrow {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Book, (book) => book.members, { eager: true })
  @JoinColumn({ name: 'book_code' })
  book: Book;

  @ManyToOne(() => Member, (member) => member.books, { eager: true })
  @JoinColumn({ name: 'member_code' })
  member: Member;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}