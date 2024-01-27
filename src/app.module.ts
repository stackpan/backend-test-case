import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { Book } from './core/books/book.entity';
import { Member } from './core/members/member.entity';
import { MemberModule } from './core/members/member.module';
import { BookModule } from './core/books/book.module';
import { BookMemberBorrow } from './core/books/book-member-borrow.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TypeOrmModule.forRoot({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      type: configuration().database.type,
      host: configuration().database.host,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      port: configuration().database.port,
      username: configuration().database.user,
      password: configuration().database.password,
      database: configuration().database.name,
      entities: [Book, Member, BookMemberBorrow],
    }),
    MemberModule,
    BookModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
