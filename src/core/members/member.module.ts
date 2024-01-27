import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './member.entity';
import { MemberController } from './member.controller';
import { MemberRepository } from './member.repository';
import { MemberService } from './member.service';

@Module({
  imports: [TypeOrmModule.forFeature([Member])],
  providers: [MemberService, MemberRepository],
  controllers: [MemberController],
  exports: [MemberRepository],
})
export class MemberModule {}
