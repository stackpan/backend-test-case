import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { BookRepository } from './book.repository';
import { BookModel } from '../../model/models.types';
import { BorrowBookRequest } from '../../model/requests.types';
import { MemberRepository } from '../members/member.repository';
import { ResourceNotFoundException } from '../../exception/resource-not-found.exception';
import { MoreThan } from 'typeorm';
import { BookMemberBorrowRepository } from './book-member-borrow.repository';
import { BookMemberBorrow } from './book-member-borrow.entity';
import * as moment from 'moment';

@Injectable()
export class BookService {
  constructor(
    private readonly bookRepository: BookRepository,
    private readonly memberRepository: MemberRepository,
    private readonly bookMemberBorrowRepository: BookMemberBorrowRepository,
  ) {}

  async findAllExist(): Promise<BookModel[]> {
    return await this.bookRepository.findBy({
      stock: MoreThan(0),
    });
  }

  async findOneByCode(code: string): Promise<BookModel> {
    return await this._findOneByCodeOrThrows(code);
  }

  async createBorrow(code: string, request: BorrowBookRequest) {
    const book = await this._findOneByCodeOrThrows(code);

    if (!book.stock)
      throw new HttpException(
        `Book with identity: '${code}' is out of stock.`,
        HttpStatus.BAD_REQUEST,
      );

    const member = await this.memberRepository.findOneByCodeWithBooks(
      request.memberCode,
    );
    if (!member)
      throw new ResourceNotFoundException('member', request.memberCode);

    // Check for members is currently not being penalized
    if (member.endPenaltyAt && moment().isBefore(member.endPenaltyAt))
      throw new HttpException(
        `Member with identity: '${member.code}' is being penalized. Cannot borrow a book.`,
        HttpStatus.BAD_REQUEST,
      );

    // Member may not borrow more than 2 books check
    if (!(member.books.length < 2))
      throw new HttpException(
        `Member with identity: '${member.code}' cannot borrow more than 2 books.`,
        HttpStatus.BAD_REQUEST,
      );

    const bookMemberBorrow = new BookMemberBorrow();
    bookMemberBorrow.book = book;
    bookMemberBorrow.member = member;
    await this.bookMemberBorrowRepository.save(bookMemberBorrow);

    book.stock--;
    await this.bookRepository.save(book);
  }

  async returnBorrow(code: string, request: BorrowBookRequest) {
    const bookMemberBorrow = await this.bookMemberBorrowRepository.findOneBy({
      book: { code },
      member: { code: request.memberCode },
    });

    // Check the returned book is a book that the members has borrowed
    if (!bookMemberBorrow) {
      throw new HttpException(
        `The book with identity: '${code}' is not being borrowed by member with identity: '${request.memberCode}'`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const { book, member } = bookMemberBorrow;

    // Check for members penalty for not returning book after 7 days
    if (moment().isAfter(moment(bookMemberBorrow.createdAt).add(7, 'd'))) {
      // Give members a penalty for 3 days
      member.endPenaltyAt = moment().add(3, 'd').toDate();
      await this.memberRepository.save(member);
    }

    await this.bookMemberBorrowRepository.delete(bookMemberBorrow);

    book.stock++;
    await this.bookRepository.save(book);
  }

  async _findOneByCodeOrThrows(code: string) {
    const book = await this.bookRepository.findOneBy({ code });
    if (!book) throw new ResourceNotFoundException('book', code);
    return book;
  }
}
