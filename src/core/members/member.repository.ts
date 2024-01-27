import { Repository } from 'typeorm';
import { Member } from './member.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MemberBorrowsModel } from '../../model/models.types';

@Injectable()
export class MemberRepository extends Repository<Member> {
  constructor(
    @InjectRepository(Member)
    private readonly repository: Repository<Member>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findWithBorrowingsCount() {
    const members: any[] = await this.repository
      .createQueryBuilder('members')
      .select(['members.code', 'members.name'])
      .loadRelationCountAndMap('members.borrowings', 'members.books')
      .getMany();

    return members.map(
      (value): MemberBorrowsModel => ({
        code: value.code,
        name: value.name,
        endPenaltyAt: value.endPenaltyAt,
        borrowings: value.borrowings,
      }),
    );
  }

  async findOneByCodeWithBooks(code: string): Promise<Member> {
    return await this.repository.findOne({
      where: { code },
      relations: { books: true },
    });
  }
}
