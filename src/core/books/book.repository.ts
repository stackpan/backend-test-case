import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Member } from '../members/member.entity';

@Injectable()
export class BookRepository extends Repository<Book>{
  constructor(
    @InjectRepository(Book)
    private readonly repository: Repository<Book>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async createBorrow(book: Book, member: Member) {
    book.members.push(member);
    book.stock--;
    await this.repository.save(book);
  }

  async returnBorrow(book: Book, memberCode: string) {
    book.members.filter((member) => member.code === memberCode);
    book.stock++;
    await this.repository.save(book);
  }
}