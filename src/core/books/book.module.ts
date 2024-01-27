import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { BookController } from './book.controller';
import { BookRepository } from './book.repository';
import { BookService } from './book.service';
import { MemberModule } from '../members/member.module';
import { BookMemberBorrow } from './book-member-borrow.entity';
import { BookMemberBorrowRepository } from './book-member-borrow.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book]),
    TypeOrmModule.forFeature([BookMemberBorrow]),
    MemberModule,
  ],
  providers: [BookService, BookRepository, BookMemberBorrowRepository],
  controllers: [BookController],
})
export class BookModule {}
