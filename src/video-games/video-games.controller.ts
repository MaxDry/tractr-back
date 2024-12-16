import { Controller, Get, Param, Query } from '@nestjs/common';
import { VideoGamesService } from './video-games.service';
import { IVideoGamesQueries } from 'src/interfaces/video-games.interface';

@Controller('video-games')
export class VideoGamesController {
  constructor(private readonly videoGamesService: VideoGamesService) {}
  @Get()
  findAll(@Query() queries: IVideoGamesQueries) {
    return this.videoGamesService.findAll(queries);
  }

  @Get('/:id')
  findById(@Param('id') id: string) {
    return this.videoGamesService.findById(id);
  }
}
