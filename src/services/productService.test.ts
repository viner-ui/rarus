import { ProductService } from './productService';
import { db } from '../config/database';
import { CreateProductRequest, UpdateProductRequest } from '../types';

describe('ProductService', () => {
  let productService: ProductService;

  beforeEach(() => {
    productService = new ProductService();
  });

  describe('createProduct', () => {
    it('should create a product successfully', async () => {
      const category = await db('categories').insert({
        name: 'Electronics',
        level: 0,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      }).returning('*').then(rows => rows[0]);

      const data: CreateProductRequest = {
        name: 'iPhone',
        description: 'Smartphone',
        price: 999.99,
        category_id: category.id,
      };

      const product = await productService.createProduct(data);

      expect(product).toBeDefined();
      expect(product.name).toBe(data.name);
      expect(product.description).toBe(data.description);
      expect(product.price).toBe(data.price);
      expect(product.category_id).toBe(category.id);
      expect(product.is_active).toBe(true);
    });

    it('should throw error when category does not exist', async () => {
      const data: CreateProductRequest = {
        name: 'iPhone',
        price: 999.99,
        category_id: 999,
      };

      await expect(productService.createProduct(data)).rejects.toThrow('Category not found');
    });
  });

  describe('updateProduct', () => {
    it('should update product successfully', async () => {
      const category = await db('categories').insert({
        name: 'Electronics',
        level: 0,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      }).returning('*').then(rows => rows[0]);

      const product = await db('products').insert({
        name: 'iPhone',
        price: 999.99,
        category_id: category.id,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      }).returning('*').then(rows => rows[0]);

      const updateData: UpdateProductRequest = {
        name: 'iPhone Pro',
        price: 1299.99,
      };

      const updated = await productService.updateProduct(product.id, updateData);

      expect(updated.name).toBe(updateData.name);
      expect(updated.price).toBe(updateData.price);
    });

    it('should throw error when updating non-existent product', async () => {
      const updateData: UpdateProductRequest = { name: 'Updated' };

      await expect(productService.updateProduct(999, updateData)).rejects.toThrow('Product not found');
    });
  });

  describe('deleteProduct', () => {
    it('should delete product successfully', async () => {
      const category = await db('categories').insert({
        name: 'Electronics',
        level: 0,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      }).returning('*').then(rows => rows[0]);

      const product = await db('products').insert({
        name: 'iPhone',
        price: 999.99,
        category_id: category.id,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      }).returning('*').then(rows => rows[0]);

      await expect(productService.deleteProduct(product.id)).resolves.not.toThrow();
    });

    it('should throw error when deleting non-existent product', async () => {
      await expect(productService.deleteProduct(999)).rejects.toThrow('Product not found');
    });
  });

  describe('getActiveProductsByCategory', () => {
    it('should return active products by category', async () => {
      const category = await db('categories').insert({
        name: 'Electronics',
        level: 0,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      }).returning('*').then(rows => rows[0]);

      await db('products').insert([
        {
          name: 'iPhone',
          price: 999.99,
          category_id: category.id,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Samsung',
          price: 899.99,
          category_id: category.id,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);

      const products = await productService.getActiveProductsByCategory(category.id);

      expect(products).toHaveLength(2);
      expect(products[0].category_name).toBe('Electronics');
    });
  });

  describe('getProductsGroupedByCategories', () => {
    it('should return products grouped by categories', async () => {
      const category = await db('categories').insert({
        name: 'Electronics',
        level: 0,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      }).returning('*').then(rows => rows[0]);

      await db('products').insert({
        name: 'iPhone',
        price: 999.99,
        category_id: category.id,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const result = await productService.getProductsGroupedByCategories();

      expect(result.categories).toHaveLength(1);
      expect(result.products).toHaveLength(1);
      expect(result.categories[0].product_count).toBe(1);
    });
  });

  describe('getProductCountByCategory', () => {
    it('should return correct product count for category', async () => {
      const category = await db('categories').insert({
        name: 'Electronics',
        level: 0,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      }).returning('*').then(rows => rows[0]);

      await db('products').insert([
        {
          name: 'iPhone',
          price: 999.99,
          category_id: category.id,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Samsung',
          price: 899.99,
          category_id: category.id,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);

      const count = await productService.getProductCountByCategory(category.id);

      expect(count).toBe(2);
    });
  });
}); 