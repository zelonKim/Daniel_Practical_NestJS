import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forRoot()], // if no parameter is passed to forRoot(), the 'ormconfig.json' file will pass the information to the TypeORM library
  controllers: [AppController, ProductsController],
  providers: [],
})
export class AppModule {}
