import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Redirect,
  Render,
  Req,
  Res,
} from '@nestjs/common';
import { Item } from 'src/models/item.entity';
import { Order } from 'src/models/order.entity';
import { OrdersService } from 'src/models/orders.service';
import { Product } from 'src/models/product.entity';
import { ProductsService } from 'src/models/products.service';
import { UsersService } from 'src/models/users.service';

@Controller('/cart')
export class CartController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
    private readonly ordersService: OrdersService,
  ) {}

  @Get('/')
  @Render('cart/index')
  async index(@Req() request) {
    let total = 0;
    let productsInCart: Product[] = null;

    const productsInSession = request.session.products;
    if (productsInSession) {
      // check if the current request has products stored in session
      productsInCart = await this.productsService.findByIds(
        Object.keys(productsInSession), // extract the related products from the database
      );
      total = Product.sumPricesByQuantities(productsInCart, productsInSession);
    } // update the total value

    const viewData = [];
    viewData['title'] = 'Cart - Online Store';
    viewData['subtitle'] = 'Shopping Cart';
    viewData['total'] = total;
    viewData['productsInCart'] = productsInCart;
    return {
      viewData,
    };
  }

  @Post('/add/:id')
  @Redirect('/cart')
  add(@Param('id') id: number, @Body() body, @Req() request) {
    let productsInSession = request.session.products; // get the products stored in the session
    if (!productsInSession) {
      productsInSession = {}; // first time, 'request.session.products' will not exist
    }
    productsInSession[id] = body.quantity; // includes the collected product 'id' as a key with product 'quantity' as a value
    request.session.products = productsInSession; // updates the products stored in the session
  }

  @Get('/delete')
  @Redirect('/cart/')
  delete(@Req() request) {
    // removes the products stored in the session associated to that request
    request.session.products = null;
  }


  
  @Get('/purchase')
  async purchase(@Req() request, @Res() response) {
    if (!request.session.user) { // check if the user is logged in
      return response.redirect('/auth/login');
    } else if (!request.session.products) { // check if the user has products
      return response.redirect('/cart');
    } else {
      const user = await this.usersService.findOne(request.session.user.id);
      const productsInSession = request.session.products;
      const productsInCart = await this.productsService.findByIds(
        Object.keys(productsInSession),// extracts the corresponding products from the database
      );

      let total = 0;
      const items: Item[] = [];
      for (let i = 0; i < productsInCart.length; i++) {
        const quantity = productsInSession[productsInCart[i].getId()];
        const item = new Item();
        item.setQuantity(quantity);
        item.setPrice(productsInCart[i].getPrice());
        item.setProduct(productsInCart[i]);
        items.push(item);
        total = total + productsInCart[i].getPrice() * quantity;
      }

      const newOrder = new Order();
      newOrder.setTotal(total);
      newOrder.setItems(items);
      newOrder.setUser(user);
      const order = await this.ordersService.createOrUpdate(newOrder);

      const newBalance = user.getBalance() - total;
      await this.usersService.updateBalance(user.getId(), newBalance);

      request.session.products = null;

      const viewData = [];
      (viewData['title'] = 'Purchase - Online Store'),
        (viewData['subtitle'] = 'Purchase Status');
      viewData['orderId'] = order.getId();
      return response.render('cart/purchase', { viewData: viewData });
    }
  }
}
