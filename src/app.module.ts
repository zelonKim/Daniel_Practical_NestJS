import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './models/product.entity';
import { ProductsService } from './models/products.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'ksz40204',
      database: 'online_store',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Product]), // imports the 'Product' entity
  ], // forFeature() defines which repositories are registered in the current scope
  controllers: [AppController, ProductsController],
  providers: [ProductsService], // registers 'ProductsService' in the module -> 'ProductsService' is available to be injected and used across the module
})
export class AppModule {}
