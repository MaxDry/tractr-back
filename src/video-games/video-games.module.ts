import { Module } from '@nestjs/common';
import { VideoGamesService } from './video-games.service';
import { VideoGamesController } from './video-games.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoGame } from './entities/video-game.entity';
import { GenresModule } from 'src/genres/genres.module';

@Module({
  imports: [TypeOrmModule.forFeature([VideoGame]), GenresModule],
  controllers: [VideoGamesController],
  providers: [VideoGamesService],
  exports: [VideoGamesService],
})
export class VideoGamesModule {}
