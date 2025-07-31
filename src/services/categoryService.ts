import { Category, CategoryWithProductCount, CategoryTree, CreateCategoryRequest, UpdateCategoryRequest } from '../types';
import { Knex } from 'knex';

export class CategoryService {
  constructor(private db: Knex) {}

  async createCategory(data: CreateCategoryRequest): Promise<Category> {
    const parentLevel = data.parent_id ? await this.getCategoryLevel(data.parent_id) : 0;
    
    if (parentLevel >= 3) {
      throw new Error('Maximum nesting level is 3');
    }

    const [category] = await this.db('categories')
      .insert({
        ...data,
        level: parentLevel + 1,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning('*');

    return category;
  }

  async updateCategory(id: number, data: UpdateCategoryRequest): Promise<Category> {
    if (data.parent_id) {
      const parentLevel = await this.getCategoryLevel(data.parent_id);
      const currentLevel = await this.getCategoryLevel(id);
      
      if (parentLevel >= 3) {
        throw new Error('Maximum nesting level is 3');
      }
      
      (data as any).level = parentLevel + 1;
    }

    const [category] = await this.db('categories')
      .where({ id })
      .update({
        ...data,
        updated_at: new Date(),
      })
      .returning('*');

    if (!category) {
      throw new Error('Category not found');
    }

    return category;
  }

  async deleteCategory(id: number): Promise<void> {
    const hasChildren = await this.db('categories').where({ parent_id: id }).first();
    if (hasChildren) {
      throw new Error('Cannot delete category with children');
    }

    const hasProducts = await this.db('products').where({ category_id: id }).first();
    if (hasProducts) {
      throw new Error('Cannot delete category with products');
    }

    const deleted = await this.db('categories').where({ id }).del();
    if (!deleted) {
      throw new Error('Category not found');
    }
  }

  async getActiveCategories(): Promise<CategoryWithProductCount[]> {
    return this.db('categories as c')
      .select(
        'c.*',
        this.db.raw('COALESCE(COUNT(p.id), 0) as product_count')
      )
      .leftJoin('products as p', function() {
        this.on('c.id', '=', 'p.category_id')
          .andOn('p.is_active', '=', 'true');
      })
      .where('c.is_active', true)
      .groupBy('c.id')
      .orderBy('c.level', 'asc')
      .orderBy('c.name', 'asc');
  }

  async getCategoryById(id: number): Promise<Category | null> {
    return this.db('categories').where({ id }).first();
  }

  async getCategoryTree(): Promise<CategoryTree[]> {
    const categories = await this.getActiveCategories();
    return this.buildCategoryTree(categories);
  }

  private async getCategoryLevel(id: number): Promise<number> {
    const category = await this.db('categories').where({ id }).first();
    if (!category) {
      throw new Error('Parent category not found');
    }
    return category.level;
  }

  private buildCategoryTree(categories: CategoryWithProductCount[], parentId?: number): CategoryTree[] {
    return categories
      .filter(cat => cat.parent_id === parentId)
      .map(cat => ({
        ...cat,
        children: this.buildCategoryTree(categories, cat.id),
      }));
  }
} 
