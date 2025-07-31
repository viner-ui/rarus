import { CategoryService } from './categoryService';
import { db } from '../config/database';
import { CreateCategoryRequest, UpdateCategoryRequest } from '../types';

describe('CategoryService', () => {
  let categoryService: CategoryService;

  beforeEach(() => {
    categoryService = new CategoryService();
  });

  describe('createCategory', () => {
    it('should create a category successfully', async () => {
      const data: CreateCategoryRequest = {
        name: 'Electronics',
        description: 'Electronic devices',
      };

      const category = await categoryService.createCategory(data);

      expect(category).toBeDefined();
      expect(category.name).toBe(data.name);
      expect(category.description).toBe(data.description);
      expect(category.level).toBe(0);
      expect(category.is_active).toBe(true);
    });

    it('should create a subcategory with correct level', async () => {
      const parentData: CreateCategoryRequest = {
        name: 'Electronics',
      };
      const parent = await categoryService.createCategory(parentData);

      const childData: CreateCategoryRequest = {
        name: 'Smartphones',
        parent_id: parent.id,
      };
      const child = await categoryService.createCategory(childData);

      expect(child.level).toBe(1);
      expect(child.parent_id).toBe(parent.id);
    });

    it('should throw error when trying to create category with level > 3', async () => {
      const level1 = await categoryService.createCategory({ name: 'Level 1' });
      const level2 = await categoryService.createCategory({ name: 'Level 2', parent_id: level1.id });
      const level3 = await categoryService.createCategory({ name: 'Level 3', parent_id: level2.id });

      await expect(
        categoryService.createCategory({ name: 'Level 4', parent_id: level3.id })
      ).rejects.toThrow('Maximum nesting level is 3');
    });
  });

  describe('updateCategory', () => {
    it('should update category successfully', async () => {
      const category = await categoryService.createCategory({ name: 'Electronics' });
      const updateData: UpdateCategoryRequest = {
        name: 'Updated Electronics',
        description: 'Updated description',
      };

      const updated = await categoryService.updateCategory(category.id, updateData);

      expect(updated.name).toBe(updateData.name);
      expect(updated.description).toBe(updateData.description);
    });

    it('should throw error when updating non-existent category', async () => {
      const updateData: UpdateCategoryRequest = { name: 'Updated' };

      await expect(categoryService.updateCategory(999, updateData)).rejects.toThrow('Category not found');
    });
  });

  describe('deleteCategory', () => {
    it('should delete category successfully', async () => {
      const category = await categoryService.createCategory({ name: 'Electronics' });

      await expect(categoryService.deleteCategory(category.id)).resolves.not.toThrow();
    });

    it('should throw error when deleting category with children', async () => {
      const parent = await categoryService.createCategory({ name: 'Electronics' });
      await categoryService.createCategory({ name: 'Smartphones', parent_id: parent.id });

      await expect(categoryService.deleteCategory(parent.id)).rejects.toThrow('Cannot delete category with children');
    });

    it('should throw error when deleting category with products', async () => {
      const category = await categoryService.createCategory({ name: 'Electronics' });
      await db('products').insert({
        name: 'iPhone',
        price: 999.99,
        category_id: category.id,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      });

      await expect(categoryService.deleteCategory(category.id)).rejects.toThrow('Cannot delete category with products');
    });
  });

  describe('getActiveCategories', () => {
    it('should return active categories with product count', async () => {
      const category = await categoryService.createCategory({ name: 'Electronics' });
      await db('products').insert({
        name: 'iPhone',
        price: 999.99,
        category_id: category.id,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const categories = await categoryService.getActiveCategories();

      expect(categories).toHaveLength(1);
      expect(categories[0].product_count).toBe(1);
    });
  });

  describe('getCategoryTree', () => {
    it('should return category tree structure', async () => {
      const parent = await categoryService.createCategory({ name: 'Electronics' });
      const child = await categoryService.createCategory({ name: 'Smartphones', parent_id: parent.id });

      const tree = await categoryService.getCategoryTree();

      expect(tree).toHaveLength(1);
      expect(tree[0].children).toHaveLength(1);
      expect(tree[0].children[0].id).toBe(child.id);
    });
  });
}); 