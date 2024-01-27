import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from '../entity/member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
})
export class MemberModule {}
