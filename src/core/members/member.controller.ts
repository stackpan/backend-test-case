import { Controller, Get } from '@nestjs/common';
import { BaseResponse } from '../../model/base-response.model';
import { MemberService } from './member.service';

@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get()
  async findAll() {
    const members = await this.memberService.getAll();
    return new BaseResponse('Success.', members);
  }
}
