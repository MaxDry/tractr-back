import { Command, CommandRunner } from 'nest-commander';
import { VideoGamesService } from 'src/video-games/video-games.service';

@Command({
  name: 'seed-video-games',
  description: 'Bulk insert video games',
})
export class SeedVideoGamesCommand extends CommandRunner {
  constructor(private readonly videoGamesService: VideoGamesService) {
    super();
  }

  async run(
    passedParam: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    await this.videoGamesService.bulkInsertVideoGames();
    console.log('[VideoGames] Bulk insert completed successfully');
  }
}
