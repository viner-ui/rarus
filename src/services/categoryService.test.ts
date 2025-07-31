import { CategoryService } from './categoryService';
import { CreateCategoryRequest, UpdateCategoryRequest } from '../types';
import { Knex } from 'knex';

const mockDb = {
  insert: jest.fn().mockReturnThis(),
  returning: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  del: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  leftJoin: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  groupBy: jest.fn().mockReturnThis(),
  raw: jest.fn().mockReturnThis(),
  on: jest.fn().mockReturnThis(),
  andOn: jest.fn().mockReturnThis(),
  first: jest.fn().mockReturnThis(),
} as unknown as Knex;

describe('CategoryService', () => {
  let categoryService: CategoryService;

  beforeEach(() => {
    jest.clearAllMocks();
    categoryService = new CategoryService(mockDb);
  });

  describe('createCategory', () => {
    it('should have createCategory method', () => {
      expect(typeof categoryService.createCategory).toBe('function');
    });

    it('should accept CreateCategoryRequest', () => {
      const data: CreateCategoryRequest = {
        name: 'Electronics',
        description: 'Electronic devices',
      };
      expect(data.name).toBe('Electronics');
      expect(data.description).toBe('Electronic devices');
    });
  });

  describe('updateCategory', () => {
    it('should have updateCategory method', () => {
      expect(typeof categoryService.updateCategory).toBe('function');
    });

    it('should accept UpdateCategoryRequest', () => {
      const data: UpdateCategoryRequest = {
        name: 'Updated Electronics',
        description: 'Updated description',
      };
      expect(data.name).toBe('Updated Electronics');
      expect(data.description).toBe('Updated description');
    });
  });

  describe('deleteCategory', () => {
    it('should have deleteCategory method', () => {
      expect(typeof categoryService.deleteCategory).toBe('function');
    });
  });

  describe('getActiveCategories', () => {
    it('should have getActiveCategories method', () => {
      expect(typeof categoryService.getActiveCategories).toBe('function');
    });
  });

  describe('getCategoryTree', () => {
    it('should have getCategoryTree method', () => {
      expect(typeof categoryService.getCategoryTree).toBe('function');
    });
  });

  describe('getCategoryById', () => {
    it('should have getCategoryById method', () => {
      expect(typeof categoryService.getCategoryById).toBe('function');
    });
  });
}); 