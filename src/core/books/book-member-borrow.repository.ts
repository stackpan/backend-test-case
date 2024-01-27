import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { BookMemberBorrow } from './book-member-borrow.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BookMemberBorrowRepository extends Repository<BookMemberBorrow> {
  constructor(
    @InjectRepository(BookMemberBorrow)
    private readonly repository: Repository<BookMemberBorrow>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}