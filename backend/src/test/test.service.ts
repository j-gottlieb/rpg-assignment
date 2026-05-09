import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Test } from './test.entity';

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(Test)
    private readonly testRepo: Repository<Test>,
  ) {}

  findAll(): Promise<Test[]> {
    return this.testRepo.find();
  }

  findOne(id: number): Promise<Test | null> {
    return this.testRepo.findOneBy({ id });
  }

  create(name: string): Promise<Test> {
    return this.testRepo.save(this.testRepo.create({ name }));
  }
}
