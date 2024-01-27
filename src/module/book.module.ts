import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from '../entity/book.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book])],
})
export class BookModule {}
