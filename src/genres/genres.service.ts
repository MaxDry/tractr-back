import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre } from './entities/genre.entity';
import { In, Repository } from 'typeorm';
import axios from 'axios';

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre)
    private genreRepository: Repository<Genre>,
  ) {}

  findAll() {
    return this.genreRepository.find();
  }

  async findBySlugs(slugs: string[]) {
    const genres = await this.genreRepository.find({
      where: {
        slug: In(slugs),
      },
    });

    if (!genres.length) {
      throw new HttpException(
        'No genres found for the provided slugs',
        HttpStatus.NOT_FOUND,
      );
    }

    return genres;
  }

  async bulkInsertGenres() {
    try {
      const { data } = await axios.get(`${process.env.RAWG_API_URL}/genres`, {
        params: { key: process.env.RAWG_API_KEY },
      });

      for (const genre of data.results) {
        const existingGenre = await this.genreRepository.findOne({
          where: { slug: genre.slug },
        });

        if (existingGenre) return;

        const newGenre = this.genreRepository.create({
          name: genre.name,
          slug: genre.slug,
        });
        await this.genreRepository.save(newGenre);
      }
    } catch (error) {
      console.error("Erreur lors de l'insertion des données:", error);
      throw error;
    }
  }
}
