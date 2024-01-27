import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { Book } from './entity/book.entity';
import { Member } from './entity/member.entity';
import { MemberModule } from './module/member.module';

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
      database: configuration().database.password,
      entities: [Book, Member],
    }),
    MemberModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
