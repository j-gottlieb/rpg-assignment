import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { User } from '../user/user.entity';
import { CreatePostInput } from './dto/create-post.input';
import { pubSub, POST_CREATED } from '../pubsub';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
  ) {}

  findAll(): Promise<Post[]> {
    return this.postRepo.find({ order: { createdAt: 'DESC' } });
  }

  async create(input: CreatePostInput, author: User): Promise<Post> {
    const post = await this.postRepo.save(
      this.postRepo.create({ ...input, author }),
    );
    await pubSub.publish(POST_CREATED, { postCreated: post });
    return post;
  }
}
