import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { VideoGame } from './entities/video-game.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GenresService } from 'src/genres/genres.service';
import { IVideoGamesQueries } from 'src/interfaces/video-games.interface';

@Injectable()
export class VideoGamesService {
  constructor(
    @InjectRepository(VideoGame)
    private videoGamesRepository: Repository<VideoGame>,
    private genreService: GenresService,
  ) {}

  async findById(id: string): Promise<VideoGame> {
    const videoGame = await this.videoGamesRepository.findOneBy({
      id: parseInt(id),
    });
    if (!videoGame) {
      throw new HttpException('VideoGame not found', HttpStatus.NOT_FOUND);
    }
    return videoGame;
  }

  async findAll(queries: IVideoGamesQueries) {
    const slugs = queries.genres?.split(',');
    const minimumRating = parseInt(queries.minimumRating);

    const genres = slugs ? await this.genreService.findBySlugs(slugs) : [];
    const videoGames = await this.videoGamesRepository.find({
      where: {
        genres: genres,
        rating: minimumRating ? MoreThanOrEqual(minimumRating) : undefined,
      },
      relations: ['genres'],
    });
    return videoGames;
  }

  async bulkInsertVideoGames() {
    try {
      const { data } = await axios.get(`${process.env.RAWG_API_URL}/games`, {
        params: { key: process.env.RAWG_API_KEY, page_size: 50 },
      });

      for (const videoGame of data.results) {
        const existingVideoGame = await this.videoGamesRepository.findOne({
          where: { slug: videoGame.slug },
        });
        const slugs = videoGame.genres.map((genre) => genre.slug);
        const genres = await this.genreService.findBySlugs(slugs);
        if (existingVideoGame) {
          existingVideoGame.name = videoGame.name;
          existingVideoGame.slug = videoGame.slug;
          existingVideoGame.image = videoGame.background_image;
          existingVideoGame.rating = parseFloat(videoGame.rating);
          existingVideoGame.genres = genres;
          existingVideoGame.ratingsCount = parseInt(videoGame.ratings_count);
          existingVideoGame.releaseDate = videoGame.released;
          await this.videoGamesRepository.save(existingVideoGame);
        } else {
          const newVideoGame = this.videoGamesRepository.create({
            name: videoGame.name,
            slug: videoGame.slug,
            image: videoGame.background_image,
            rating: parseFloat(videoGame.rating),
            genres: genres,
            ratingsCount: parseInt(videoGame.ratings_count),
            releaseDate: videoGame.released,
          });
          await this.videoGamesRepository.save(newVideoGame);
        }
      }
    } catch (error) {
      console.error("Erreur lors de l'insertion des données:", error);
      throw error;
    }
  }
}
