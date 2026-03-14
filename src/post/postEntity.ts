import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { postType } from "./enum/postTypeEnum";
import { postStatus } from "./enum/postStatusEnum";
import { MetaOption } from "src/meta-options/metaOptions.entity";
import { User } from "src/user/userEntity";
import { Tag } from "src/tags/tag.entity";

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
    length: 96,
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
  @JoinColumn()
  metaOptions: MetaOption;
  @ManyToOne(() => User, (user) => user.posts, { eager: true })
  author: User;
  @ManyToMany(() => Tag, (tag) => tag.posts, { eager: true })
  @JoinTable()
  tags?: Tag[];
}
