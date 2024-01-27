import { BookService } from './book.service';
import { BookRepository } from './book.repository';
import { BookMemberBorrowRepository } from './book-member-borrow.repository';
import { MemberRepository } from '../members/member.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { Member } from '../members/member.entity';
import booksMock from '../../mocks/books.mock';
import { BookMemberBorrow } from './book-member-borrow.entity';
import membersMock from '../../mocks/members.mock';
import * as moment from 'moment';

describe('BookService', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let bookRepository: jest.Mocked<BookRepository>;
  let memberRepository: jest.Mocked<MemberRepository>;
  let bookMemberBorrowRepository: jest.Mocked<BookMemberBorrowRepository>;

  let bookService: BookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(BookRepository),
          useFactory: () => ({
            findBy: jest.fn(),
            save: jest.fn(),
          }),
        },
        {
          provide: getRepositoryToken(MemberRepository),
          useFactory: () => ({
            findOneByCodeWithBooks: jest.fn(),
            save: jest.fn(),
          }),
        },
        {
          provide: getRepositoryToken(BookMemberBorrowRepository),
          useFactory: () => ({
            save: jest.fn(),
            delete: jest.fn(),
            findOneBy: jest.fn(),
          }),
        },
        BookService,
      ],
    }).compile();

    bookRepository = module.get(BookRepository);
    memberRepository = module.get(MemberRepository);
    bookMemberBorrowRepository = module.get(BookMemberBorrowRepository);

    bookService = module.get(BookService);
  });

  it('createBorrow(): members may not borrow more than 2 books.', () => {
    const memberDummy: Member = {
      ...membersMock[0],
      endPenaltyAt: null,
      books: [new Book(), new Book()],
    };

    const bookDummy: Book = {
      ...booksMock[0],
      members: [],
    };

    jest
      .spyOn(bookService, '_findOneByCodeOrThrows')
      .mockResolvedValue(bookDummy);

    jest
      .spyOn(memberRepository, 'findOneByCodeWithBooks')
      .mockResolvedValue(memberDummy);

    expect(async () => {
      await bookService.createBorrow(bookDummy.code, {
        memberCode: memberDummy.code,
      });
    }).rejects.toThrow(
      `Member with identity: '${memberDummy.code}' cannot borrow more than 2 books.`,
    );
  });

  it('createBorrow(): borrowed books are not borrowed by other members.', () => {
    const memberDummy: Member = {
      ...membersMock[0],
      endPenaltyAt: null,
      books: [],
    };

    const bookDummy: Book = {
      ...booksMock[0],
      stock: 0,
      members: [],
    };

    jest
      .spyOn(bookService, '_findOneByCodeOrThrows')
      .mockResolvedValue(bookDummy);

    jest
      .spyOn(memberRepository, 'findOneByCodeWithBooks')
      .mockResolvedValue(memberDummy);

    expect(async () => {
      await bookService.createBorrow(bookDummy.code, {
        memberCode: memberDummy.code,
      });
    }).rejects.toThrow(
      `Book with identity: '${bookDummy.code}' is out of stock.`,
    );
  });

  it('createBorrow(): member is currently not being penalized.', () => {
    jest.useFakeTimers().setSystemTime(new Date());

    const memberDummy: Member = {
      ...membersMock[0],
      endPenaltyAt: moment().add(3, 'day').toDate(),
      books: [],
    };

    const bookDummy: Book = {
      ...booksMock[0],
      members: [],
    };

    jest
      .spyOn(bookService, '_findOneByCodeOrThrows')
      .mockResolvedValue(bookDummy);

    jest
      .spyOn(memberRepository, 'findOneByCodeWithBooks')
      .mockResolvedValue(memberDummy);

    expect(async () => {
      await bookService.createBorrow(bookDummy.code, {
        memberCode: memberDummy.code,
      });
    }).rejects.toThrow(
      `Member with identity: '${memberDummy.code}' is being penalized. Cannot borrow a book.`,
    );
  });

  it('returnBorrow(): the returned book is a book that the member has borrowed.', () => {
    jest.spyOn(bookMemberBorrowRepository, 'findOneBy').mockResolvedValue(null);

    expect(async () => {
      await bookService.returnBorrow(booksMock[0].code, {
        memberCode: membersMock[0].code,
      });
    }).rejects.toThrow(
      `The book with identity: '${booksMock[0].code}' is not being borrowed by member with identity: '${membersMock[0].code}'`,
    );
  });

  it('returnBorrow(): if the book is returned after more than 7 days, the member will be subject to a penalty. Member with penalty cannot able to borrow the book for 3 days.', async () => {
    jest.useFakeTimers().setSystemTime(new Date());

    const memberDummy: Member = {
      ...membersMock[0],
      endPenaltyAt: null,
      books: [],
    };

    const bookDummy: Book = {
      ...booksMock[0],
      members: [],
    };

    const bookMemberBorrowDummy: BookMemberBorrow = {
      id: 1,
      book: bookDummy,
      member: memberDummy,
      createdAt: moment().subtract(9, 'd').subtract(1, 's').toDate(),
    };

    jest
      .spyOn(bookMemberBorrowRepository, 'findOneBy')
      .mockResolvedValue(bookMemberBorrowDummy);

    jest.spyOn(memberRepository, 'save');

    await bookService.returnBorrow(booksMock[0].code, {
      memberCode: membersMock[0].code,
    });

    expect(memberRepository.save).toHaveBeenCalledWith({
      ...memberDummy,
      endPenaltyAt: moment().add(3, 'd').toDate(),
    });
  });
});
