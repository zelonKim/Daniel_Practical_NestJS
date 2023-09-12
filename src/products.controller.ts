import { Controller, Get, Render, Param, Res } from '@nestjs/common';
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
    // @Res() decorator allows to access the Express response object
    const product = await this.productsService.findOne(params.id);
    if (product === undefined) {
      return response.redirect('/products');
    }
    const viewData = [];
    viewData['title'] = product.name + ' - Online Store';
    viewData['subtitle'] = product.name + ' - Product Information';
    viewData['product'] = product;
    return response.render('products/show.hbs', { viewData }); // set the 'viewData' and render the 'products/show.hbs'
  }
}
