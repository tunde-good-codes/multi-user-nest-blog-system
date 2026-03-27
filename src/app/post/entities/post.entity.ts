/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { postType } from "../enum/post-enum-types";
import { postStatus } from "../enum/post-status-type";
import { MetaOption } from "src/app/meta-options/entities/meta-option.entity";
import { User } from "src/app/user/entities/user.entity";
//import { Tag } from "src/tags/tag.entity";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "varchar",
    length: 512,
    nullable: false
  })
  title: string;

  @Column({
    type: "enum",
    enum: postType,
    default: postType.POST,
    nullable: true
  })
  postType: postType;

  @Column({
    type: "varchar",
    length: 256,
    nullable: false,
    unique: true
  })
  slug: string;

  @Column({
    type: "enum",
    enum: postStatus,
    default: postStatus.draft,
    nullable: true
  })
  status: postStatus;

  @Column({
    type: "text",
    nullable: true
  })
  content?: string;

  @Column({
    type: "text",
    nullable: true
  })
  schema?: string;

  @Column({
    type: "varchar",
    nullable: true,
    length: 1024
  })
  featuredImageUrl?: string;

  @Column({
    type: "timestamp",
    nullable: true
  })
  publishedOn?: Date;
  @OneToOne(() => MetaOption, (metaOption) => metaOption.post, { cascade: true, eager: true })
  // @JoinColumn()  this is to ensure metaOption get deleted when post is deleted
  metaOptions?: MetaOption;

  @ManyToOne(() => User, (user) => user.posts)
  author: User;

  //   //   @ManyToMany(() => Tag, (tag) => tag.posts, { eager: true })
  //   @JoinTable()
  //   tags?: Tag[];
}
