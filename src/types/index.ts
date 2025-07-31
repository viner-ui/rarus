export interface Category {
  id: number;
  name: string;
  description?: string;
  parent_id?: number;
  level: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  category_id: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CategoryWithProductCount extends Category {
  product_count: number;
}

export interface ProductWithCategory extends Product {
  category_name: string;
}

export interface CategoryTree extends Category {
  children: CategoryTree[];
  product_count: number;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  parent_id?: number;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  parent_id?: number;
  is_active?: boolean;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  category_id: number;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  category_id?: number;
  is_active?: boolean;
} 