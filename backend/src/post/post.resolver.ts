import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { Post } from './post.entity';
import { CreatePostInput } from './dto/create-post.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../user/user.entity';
import { pubSub, POST_CREATED } from '../pubsub';
import { PubSubAsyncIterableIterator } from 'graphql-subscriptions/dist/pubsub-async-iterable-iterator';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Query(() => [Post], { name: 'posts' })
  findAll(): Promise<Post[]> {
    return this.postService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Post)
  createPost(
    @Args('input') input: CreatePostInput,
    @CurrentUser() user: User,
  ): Promise<Post> {
    return this.postService.create(input, user);
  }

  @Subscription(() => Post)
  postCreated(): PubSubAsyncIterableIterator<Post> {
    return pubSub.asyncIterableIterator(POST_CREATED);
  }
}
