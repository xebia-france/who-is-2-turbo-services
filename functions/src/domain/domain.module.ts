import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { GameService } from './game/game.service';
import { MembersService } from './members/members.service';

@Module({
  providers: [
    {
      provide: 'GameApi',
      useClass: GameService,
    },
    {
      provide: 'MembersApi',
      useClass: MembersService,
    },
  ],
  exports: ['GameApi', 'MembersApi'],
  imports: [InfrastructureModule],
})
export class DomainModule {}
