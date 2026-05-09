import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test } from './test.entity';
import { TestService } from './test.service';
import { TestResolver } from './test.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Test])],
  providers: [TestService, TestResolver],
})
export class TestModule {}
