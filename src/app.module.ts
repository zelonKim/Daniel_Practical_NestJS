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
import { Order } from './models/order.entity';
import { OrdersService } from './models/orders.service';
import { AccountModule } from './account/account.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'bjktx3it2su2hysxadv0-mysql.services.clever-cloud.com',
      port: 3306,
      username: 'ug92yp7mrosd6mi7',
      password: '0diFfJVC7B967nYuiZJQ',
      database: 'bjktx3it2su2hysxadv0',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Product, User, Order]), // imports the 'Product' entity
    AdminModule,
    AuthModule,
    CartModule,
    AccountModule,
  ], // forFeature() defines which repositories are registered in the current scope
  controllers: [AppController, ProductsController],
  providers: [ProductsService, UsersService, OrdersService], // registers 'ProductsService' in the module -> 'ProductsService' is available to be injected and used across the module
  exports: [ProductsService, UsersService, OrdersService], // can inject the 'ProductsSevice' to 'AdminProductsController' constructor without requiring to import and register it in the 'AdminModule'
})
export class AppModule {}
