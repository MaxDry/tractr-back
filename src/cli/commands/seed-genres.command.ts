import { Command, CommandRunner } from 'nest-commander';
import { GenresService } from '../../genres/genres.service';

@Command({
  name: 'seed-genres',
  description: 'Bulk insert genres',
})
export class SeedGenresCommand extends CommandRunner {
  constructor(private readonly genresService: GenresService) {
    super();
  }

  async run(
    passedParam: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    await this.genresService.bulkInsertGenres();
    console.log('[Genres] Bulk insert completed successfully');
  }
}
