import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BaseResponse } from '../../model/base-response.model';
import { BookService } from './book.service';
import { BorrowBookRequest } from '../../model/requests.types';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {
  }

  @Get()
  async findAll() {
    const existingBooks = await this.bookService.findAllExist();
    return new BaseResponse('Success.', existingBooks);
  }

  @Get(':code')
  async findByCode(@Param('code') code: string) {
    const book = await this.bookService.findOneByCode(code);
    return new BaseResponse('Found.', book);
  }

  @Post(':code/borrow')
  async borrow(@Param('code') code: string, @Body() payload: BorrowBookRequest) {
    await this.bookService.createBorrow(code, payload);
    return new BaseResponse('Success.');
  }

  @Post(':code/return')
  async return(@Param('code') code: string, @Body() payload: BorrowBookRequest) {
    await this.bookService.returnBorrow(code, payload);
    return new BaseResponse('Success.');
  }
}
