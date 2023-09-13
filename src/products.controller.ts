import { Controller, Get, Render, Param, Res, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './models/products.service';

@Controller('/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {} // constructor injection
  // Nest resolves the 'productsService' attribute by creating and returning an instance of 'ProductsService' class

  @Get('/')
  @Render('products/index.hbs')
  async index() {
    const viewData = [];
    viewData['title'] = 'Products - Online Store';
    viewData['subtitle'] = 'List of products';
    viewData['products'] = await this.productsService.findAll(); // returns a 'Promise' with products collected from the DB
    return {
      // 'await' makes the application wait until that 'Promise' completes and returns its result
      viewData, // Once the products are returned from DB, passes the viewData to the 'View' and renders 'products/index.hbs'
    };
  }

  @Get('/:id')
  async show(@Param() params, @Res() response) {
    const product = await this.productsService.findOne(params.id);
    // @Res() decorator allows to access the Express response object
    if (product === undefined) {
      return response.redirect('/products');
    }
    const viewData = []; // access the 'product' attributes thru the corresponding getters
    viewData['title'] = product.getName() + ' - Online Store';
    viewData['subtitle'] = product.getName() + ' - Product Information';
    viewData['product'] = product;
    return response.render('products/show.hbs', { viewData }); // set the 'viewData' and render the 'products/show.hbs'
  }
}
