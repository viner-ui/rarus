import { Request, Response } from 'express';
import { ProductService } from '../services/productService';
import { CreateProductRequest, UpdateProductRequest } from '../types';
import { db } from '../config/database';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService(db);
  }

  async createProduct(req: Request, res: Response): Promise<void> {
    try {
      const data: CreateProductRequest = req.body;
      const product = await this.productService.createProduct(data);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id || '0');
      const data: UpdateProductRequest = req.body;
      const product = await this.productService.updateProduct(id, data);
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id || '0');
      await this.productService.deleteProduct(id);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  async getActiveProductsByCategory(req: Request, res: Response): Promise<void> {
    try {
      const categoryId = parseInt(req.params.categoryId || '0');
      const products = await this.productService.getActiveProductsByCategory(categoryId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getProductsGroupedByCategories(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.productService.getProductsGroupedByCategories();
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getProductById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id || '0');
      const product = await this.productService.getProductById(id);
      
      if (!product) {
        res.status(404).json({ error: 'Product not found' });
        return;
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  async getProductCountByCategory(req: Request, res: Response): Promise<void> {
    try {
      const categoryId = parseInt(req.params.categoryId || '0');
      const count = await this.productService.getProductCountByCategory(categoryId);
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }
} 