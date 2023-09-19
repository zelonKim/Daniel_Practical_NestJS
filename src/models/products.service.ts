import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable() // '@Injectable()' declares that 'ProductService' can be injected and instantiated as provider
export class ProductsService {
  constructor(
    // @InjectRepository() injects the product repository into ProductsService constructor
    @InjectRepository(Product) private productsRepository: Repository<Product>,
  ) {} // 'productsRepository' is an instance of the Repository class that works with 'Product' entity

  findAll(): Promise<Product[]> {
    return this.productsRepository.find(); // find() retrieves all products from the DB
  } // 'productsRepository' invokes the 'find' method inherited from the Repository class

  findOne(id: string): Promise<Product> {
    return this.productsRepository.findOne({
      where: { id: parseInt(id) },
    });
  }

  createOrUpdate(product: Product): Promise<Product> {
    return this.productsRepository.save(product);
  } // Saves a given entity in the database. If the entity does not exist in the database then inserts, otherwise updates.

  
  async remove(id: string): Promise<void> {
    await this.productsRepository.delete(id);
  }

  findByIds(ids: string[]): Promise<Product[]> {
    return this.productsRepository.findByIds(ids); // findByIds() receives an array of strings and returns a Promise consisting of an array 
  } // takes the arrary of ids, and returns the corresponding products based on those ids
}
