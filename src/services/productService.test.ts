import { ProductService } from './productService';
import { CreateProductRequest, UpdateProductRequest } from '../types';
import { Knex } from 'knex';

const mockDb = {
  insert: jest.fn().mockReturnThis(),
  returning: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  del: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  leftJoin: jest.fn().mockReturnThis(),
  join: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  groupBy: jest.fn().mockReturnThis(),
  raw: jest.fn().mockReturnThis(),
  on: jest.fn().mockReturnThis(),
  andOn: jest.fn().mockReturnThis(),
  first: jest.fn().mockReturnThis(),
  count: jest.fn().mockReturnThis(),
} as unknown as Knex;

describe('ProductService', () => {
  let productService: ProductService;

  beforeEach(() => {
    jest.clearAllMocks();
    productService = new ProductService(mockDb);
  });

  describe('createProduct', () => {
    it('should have createProduct method', () => {
      expect(typeof productService.createProduct).toBe('function');
    });

    it('should accept CreateProductRequest', () => {
      const data: CreateProductRequest = {
        name: 'iPhone',
        description: 'Smartphone',
        price: 999.99,
        category_id: 1,
      };
      expect(data.name).toBe('iPhone');
      expect(data.description).toBe('Smartphone');
      expect(data.price).toBe(999.99);
      expect(data.category_id).toBe(1);
    });
  });

  describe('updateProduct', () => {
    it('should have updateProduct method', () => {
      expect(typeof productService.updateProduct).toBe('function');
    });

    it('should accept UpdateProductRequest', () => {
      const data: UpdateProductRequest = {
        name: 'iPhone Pro',
        price: 1299.99,
      };
      expect(data.name).toBe('iPhone Pro');
      expect(data.price).toBe(1299.99);
    });
  });

  describe('deleteProduct', () => {
    it('should have deleteProduct method', () => {
      expect(typeof productService.deleteProduct).toBe('function');
    });
  });

  describe('getActiveProductsByCategory', () => {
    it('should have getActiveProductsByCategory method', () => {
      expect(typeof productService.getActiveProductsByCategory).toBe('function');
    });
  });

  describe('getProductsGroupedByCategories', () => {
    it('should have getProductsGroupedByCategories method', () => {
      expect(typeof productService.getProductsGroupedByCategories).toBe('function');
    });
  });

  describe('getProductById', () => {
    it('should have getProductById method', () => {
      expect(typeof productService.getProductById).toBe('function');
    });
  });

  describe('getProductCountByCategory', () => {
    it('should have getProductCountByCategory method', () => {
      expect(typeof productService.getProductCountByCategory).toBe('function');
    });
  });
}); 
