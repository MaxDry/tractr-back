import { Genre } from 'src/genres/entities/genre.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'videoGames' })
export class VideoGame {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  image: string;

  @Column('float')
  rating: number;

  @Column()
  ratingsCount: number;

  @Column()
  releaseDate: Date;

  @ManyToMany(() => Genre, (genre) => genre.videoGames, {
    cascade: true,
    eager: true,
  })
  @JoinTable()
  genres: Genre[];
}
