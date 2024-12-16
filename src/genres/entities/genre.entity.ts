import { VideoGame } from 'src/video-games/entities/video-game.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'genres' })
export class Genre {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, unique: true })
  slug: string;

  @ManyToMany(() => VideoGame, (videoGame) => videoGame.genres)
  videoGames: VideoGame[];
}
