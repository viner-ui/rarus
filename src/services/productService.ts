import { db } from '../config/database';
import { Product, ProductWithCategory, CreateProductRequest, UpdateProductRequest } from '../types';

export class ProductService {
  async createProduct(data: CreateProductRequest): Promise<Product> {
    const category = await db('categories').where({ id: data.category_id }).first();
    if (!category) {
      throw new Error('Category not found');
    }

    const [product] = await db('products')
      .insert({
        ...data,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning('*');

    return product;
  }

  async updateProduct(id: number, data: UpdateProductRequest): Promise<Product> {
    if (data.category_id) {
      const category = await db('categories').where({ id: data.category_id }).first();
      if (!category) {
        throw new Error('Category not found');
      }
    }

    const [product] = await db('products')
      .where({ id })
      .update({
        ...data,
        updated_at: new Date(),
      })
      .returning('*');

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  }

  async deleteProduct(id: number): Promise<void> {
    const deleted = await db('products').where({ id }).del();
    if (!deleted) {
      throw new Error('Product not found');
    }
  }

  async getActiveProductsByCategory(categoryId: number): Promise<ProductWithCategory[]> {
    return db('products as p')
      .select(
        'p.*',
        'c.name as category_name'
      )
      .join('categories as c', 'p.category_id', 'c.id')
      .where('p.category_id', categoryId)
      .where('p.is_active', true)
      .where('c.is_active', true)
      .orderBy('p.name', 'asc');
  }

  async getProductsGroupedByCategories(): Promise<any[]> {
    const categories = await db('categories as c')
      .select(
        'c.id',
        'c.name',
        'c.level',
        'c.parent_id',
        db.raw('COALESCE(COUNT(p.id), 0) as product_count')
      )
      .leftJoin('products as p', function() {
        this.on('c.id', '=', 'p.category_id')
          .andOn('p.is_active', '=', db.raw('true'));
      })
      .where('c.is_active', true)
      .groupBy('c.id')
      .orderBy('c.level', 'asc')
      .orderBy('c.name', 'asc');

    const products = await db('products as p')
      .select(
        'p.*',
        'c.name as category_name',
        'c.level as category_level'
      )
      .join('categories as c', 'p.category_id', 'c.id')
      .where('p.is_active', true)
      .where('c.is_active', true)
      .orderBy('c.level', 'asc')
      .orderBy('c.name', 'asc')
      .orderBy('p.name', 'asc');

    return {
      categories,
      products,
    };
  }

  async getProductById(id: number): Promise<Product | null> {
    return db('products').where({ id }).first();
  }

  async getProductCountByCategory(categoryId: number): Promise<number> {
    const result = await db('products')
      .where({ category_id: categoryId, is_active: true })
      .count('id as count')
      .first();
    
    return parseInt(result?.count as string || '0');
  }
} 