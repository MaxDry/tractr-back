import { Module } from '@nestjs/common';
import { AppModule } from '../app.module';
import { GenresModule } from 'src/genres/genres.module';
import { SeedGenresCommand } from './commands/seed-genres.command';
import { VideoGamesModule } from 'src/video-games/video-games.module';
import { SeedVideoGamesCommand } from './commands/seed-video-games.command';

@Module({
  imports: [AppModule, GenresModule, VideoGamesModule],
  providers: [SeedGenresCommand, SeedVideoGamesCommand],
})
export class CliModule {}
