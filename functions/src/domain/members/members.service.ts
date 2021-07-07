import { Inject, Injectable } from '@nestjs/common';
import { MemberRepositorySpi } from '../MemberRepositorySpi';
import { MembersApi } from '../MembersApi';
import { Gender, Member, MemberWithPicture, MemberWithScore } from '../model/Member';
import { ProfileDto } from '../../application/members/model/ProfileDto';

@Injectable()
export class MembersService implements MembersApi {
  constructor(@Inject('MemberRepositorySpi') private memberRepositorySpi: MemberRepositorySpi) {}

  async fetchAll(): Promise<MemberWithPicture[]> {
    return await this.memberRepositorySpi.loadGalleryMembers();
  }

  async fetchLeaderboard(): Promise<MemberWithScore[]> {
    return await this.memberRepositorySpi.getMembersScores();
  }

  async createProfile(profileDto: ProfileDto): Promise<string> {
    const member = {
      firstName: profileDto.firstName,
      firstName_unaccent: profileDto.firstName.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
      lastName: profileDto.lastName,
      email: profileDto.email,
      gender: (<any>Gender)[profileDto.gender],
      picture: profileDto.picture,
    } as Member;
    return await this.memberRepositorySpi.addMember(member);
  }
}
