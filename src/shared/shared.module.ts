import { Module, Global } from '@nestjs/common';
import { databaseProviders } from './database/providers/database.providers';

@Global()
@Module({
  providers: [...databaseProviders],
  exports: [...databaseProviders]
})
export class SharedModule {}
