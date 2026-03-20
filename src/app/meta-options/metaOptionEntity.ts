/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Post } from "../post/entities/post.entity";

@Entity()
export class MetaOption {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    type: "json",
    nullable: false
  })
  metaValue: string;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => Post, (post) => post.metaOptions, { onDelete: "CASCADE" })
  post: Post;
}
