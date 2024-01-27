import { Injectable } from '@nestjs/common';
import { MemberRepository } from './member.repository';
import { MemberBorrowsModel } from '../../model/models.types';

@Injectable()
export class MemberService {
  constructor(private readonly memberRepository: MemberRepository) {}

  async getAll(): Promise<MemberBorrowsModel[]> {
    return this.memberRepository.findWithBorrowingsCount();
  }
}
