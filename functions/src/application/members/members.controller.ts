import { Body, Controller, Get, Inject, Patch, Post, UseFilters } from '@nestjs/common';
import { MembersApi } from '../../domain/MembersApi';
import { ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';
import { MemberDto } from './model/MemberDto';
import { MembersDto } from './model/MembersDto';
import { LeaderboardMemberDto } from './model/LeaderboardMemberDto';
import { MemberIdDto } from './model/MemberIdDto';
import { ProfileDto } from './model/ProfileDto';
import { MeDto } from './model/MeDto';
import { EditableProfileDto } from './model/EditableProfileDto';
import { MembersExceptionFilter } from './members.http-exception.filter';

@Controller('members')
export class MembersController {
  constructor(@Inject('MembersApi') private membersApi: MembersApi) {}

  @Get()
  @ApiCreatedResponse({
    description: 'Gallery with all members',
    type: MembersDto,
  })
  @ApiResponse({ status: 200, description: 'The gallery is returned' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async loadGallery(): Promise<MemberDto[]> {
    const members = await this.membersApi.fetchAll();
    return members.map(({ firstName, lastName, picture }) => ({
      firstName,
      lastName,
      picture,
    }));
  }

  @Get('leaderboard')
  @ApiCreatedResponse({
    description: 'Leaderboard',
    type: LeaderboardMemberDto,
  })
  @ApiResponse({ status: 200, description: 'The leaderboard is returned' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async loadLeaderBoard(): Promise<LeaderboardMemberDto[]> {
    const leaderboard = await this.membersApi.fetchLeaderboard();
    return leaderboard.map(({ firstName, lastName, score }) => ({
      firstName,
      lastName,
      score,
    }));
  }

  @Post('me')
  @ApiCreatedResponse({
    description: 'Create profile member',
  })
  @ApiResponse({ status: 201, description: 'The profile is created' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async addProfile(@Body() profile: ProfileDto): Promise<MemberIdDto> {
    return {
      id: await this.membersApi.createProfile(profile),
    };
  }

  @Get('me')
  @ApiCreatedResponse({
    description: 'Get profile member',
  })
  @ApiResponse({ status: 200, description: 'The profile is returned' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: "The profile doesn't exist." })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  @UseFilters(new MembersExceptionFilter())
  async getProfile(@Body() me: MeDto): Promise<EditableProfileDto> {
    return await this.membersApi.fetchProfile(me);
  }

  @Patch('me')
  @ApiCreatedResponse({
    description: 'Create profile member',
  })
  @ApiResponse({ status: 204, description: 'The profile is saved' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 500, description: 'Internal server error.' })
  async patchProfile(@Body() me: MeDto) {
    return;
  }
}
