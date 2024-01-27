import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import { Book } from '../books/book.entity';

@Entity({ name: 'members' })
export class Member {
  @PrimaryColumn()
  code: string;

  @Column()
  name: string;

  @ManyToMany(() => Book, (book) => book.members)
  @JoinTable({
    name: 'book_member_borrows',
    joinColumn: { name: 'member_code', referencedColumnName: 'code' },
    inverseJoinColumn: { name: 'book_code', referencedColumnName: 'code' },
  })
  books: Book[];

  @Column({ name: 'end_penalty_at' })
  endPenaltyAt: Date | null;
}
