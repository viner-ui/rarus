import { Request, Response } from 'express';
import { CategoryService } from '../services/categoryService';
import { CreateCategoryRequest, UpdateCategoryRequest } from '../types';

export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateCategoryRequest = req.body;
      const category = await this.categoryService.createCategory(data);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const data: UpdateCategoryRequest = req.body;
      const category = await this.categoryService.updateCategory(id, data);
      res.json(category);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      await this.categoryService.deleteCategory(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getActiveCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await this.categoryService.getActiveCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getCategoryTree(req: Request, res: Response): Promise<void> {
    try {
      const tree = await this.categoryService.getCategoryTree();
      res.json(tree);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const category = await this.categoryService.getCategoryById(id);
      
      if (!category) {
        res.status(404).json({ error: 'Category not found' });
        return;
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
} 