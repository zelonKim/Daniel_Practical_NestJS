import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './models/product.entity';
import { ProductsService } from './models/products.service';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { User } from './models/user.entity';
import { UsersService } from './models/users.service';
import { CartModule } from './cart/cart.module';

@Global()
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
    TypeOrmModule.forFeature([Product, User]), // imports the 'Product' entity
    AdminModule,
    AuthModule,
    CartModule,
  ], // forFeature() defines which repositories are registered in the current scope
  controllers: [AppController, ProductsController],
  providers: [ProductsService, UsersService], // registers 'ProductsService' in the module -> 'ProductsService' is available to be injected and used across the module
  exports: [ProductsService, UsersService], // can inject the 'ProductsSevice' to 'AdminProductsController' constructor without requiring to import and register it in the 'AdminModule'
})
export class AppModule {}
