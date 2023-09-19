import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Redirect,
  Render,
  Req,
} from '@nestjs/common';
import { Product } from 'src/models/product.entity';
import { ProductsService } from 'src/models/products.service';

@Controller('/cart')
export class CartController {
  constructor(private readonly productsService: ProductsService) {}

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
}
