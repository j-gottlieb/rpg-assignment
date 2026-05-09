import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TestService } from './test.service';
import { Test } from './test.entity';

@Resolver(() => Test)
export class TestResolver {
  constructor(private readonly testService: TestService) {}

  @Query(() => [Test], { name: 'tests' })
  findAll(): Promise<Test[]> {
    return this.testService.findAll();
  }

  @Query(() => Test, { name: 'test', nullable: true })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<Test | null> {
    return this.testService.findOne(id);
  }

  @Mutation(() => Test)
  createTest(@Args('name') name: string): Promise<Test> {
    return this.testService.create(name);
  }
}
