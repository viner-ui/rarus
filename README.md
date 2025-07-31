# Rarus API

REST API для управления товарами и категориями с поддержкой иерархических категорий до 3 уровней вложенности.

## Технологии

- **Node.js** с **Express.js**
- **TypeScript**
- **PostgreSQL** с **Knex.js** (без ORM)
- **Jest** для тестирования
- **Swagger/OpenAPI** документация
- **Docker** для контейнеризации

## Требования

- Node.js 18+
- PostgreSQL 15+
- Docker (опционально)

## Установка и запуск

### Способ 1: Локальная установка

1. **Клонируйте репозиторий:**
   ```bash
   git clone <repository-url>
   cd rarus
   ```

2. **Установите зависимости:**
   ```bash
   npm install
   ```

3. **Настройте базу данных:**
   - Создайте базу данных PostgreSQL
   - Скопируйте `env.example` в `.env` и настройте параметры подключения:
   ```bash
   cp env.example .env
   ```

4. **Запустите миграции:**
   ```bash
   npm run build
   npx knex migrate:latest
   ```

5. **Запустите приложение:**
   ```bash
   # Для разработки
   npm run dev
   
   # Для продакшена
   npm run build
   npm start
   ```

### Способ 2: Docker

1. **Клонируйте репозиторий:**
   ```bash
   git clone <repository-url>
   cd rarus
   ```

2. **Запустите с помощью Docker Compose:**
   ```bash
   docker-compose up --build
   ```

Приложение будет доступно по адресу: http://localhost:3000

## API Документация

Swagger документация доступна по адресу: http://localhost:3000/api-docs

## Основные эндпоинты

### Категории

- `POST /api/categories` - Создание категории
- `GET /api/categories` - Получение всех активных категорий с количеством товаров
- `GET /api/categories/tree` - Получение дерева категорий
- `GET /api/categories/:id` - Получение категории по ID
- `PUT /api/categories/:id` - Обновление категории
- `DELETE /api/categories/:id` - Удаление категории

### Товары

- `POST /api/products` - Создание товара
- `GET /api/products/grouped` - Получение товаров, сгруппированных по категориям
- `GET /api/products/:id` - Получение товара по ID
- `PUT /api/products/:id` - Обновление товара
- `DELETE /api/products/:id` - Удаление товара
- `GET /api/products/category/:categoryId` - Получение активных товаров в категории
- `GET /api/products/category/:categoryId/count` - Получение количества товаров в категории

## Тестирование

```bash
# Запуск всех тестов
npm test

# Запуск тестов в режиме watch
npm run test:watch

# Запуск тестов с покрытием
npm run test:coverage
```

## Структура проекта

```
src/
├── config/
│   └── database.ts          # Конфигурация базы данных
├── controllers/
│   ├── categoryController.ts # Контроллер категорий
│   └── productController.ts  # Контроллер товаров
├── routes/
│   ├── categoryRoutes.ts     # Маршруты категорий
│   └── productRoutes.ts      # Маршруты товаров
├── services/
│   ├── categoryService.ts    # Бизнес-логика категорий
│   └── productService.ts     # Бизнес-логика товаров
├── types/
│   └── index.ts             # TypeScript типы
├── test/
│   ├── database.ts          # Тестовая конфигурация БД
│   └── mockDb.ts            # Мок базы данных
└── index.ts                 # Точка входа приложения

migrations/
├── 001_create_categories_table.ts
└── 002_create_products_table.ts
```

## Возможности

### Категории
- ✅ Создание, редактирование, удаление категорий
- ✅ Поддержка иерархии до 3 уровней вложенности
- ✅ Получение списка активных категорий с подсчетом товаров
- ✅ Древовидная структура категорий

### Товары
- ✅ Создание, редактирование, удаление товаров
- ✅ Получение товаров по категориям
- ✅ Группировка товаров по категориям и подкатегориям
- ✅ Подсчет количества товаров в категориях

### Дополнительные возможности
- ✅ REST JSON API
- ✅ OpenAPI/Swagger документация
- ✅ Покрытие кода тестами
- ✅ TypeScript
- ✅ Docker поддержка
- ✅ Валидация данных
- ✅ Обработка ошибок
- ✅ Rate limiting
- ✅ CORS поддержка
- ✅ Безопасность (Helmet)

## Примеры использования

### Создание категории
```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Electronics",
    "description": "Electronic devices"
  }'
```

### Создание подкатегории
```bash
curl -X POST http://localhost:3000/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Smartphones",
    "description": "Mobile phones",
    "parent_id": 1
  }'
```

### Создание товара
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15",
    "description": "Latest iPhone model",
    "price": 999.99,
    "category_id": 2
  }'
```

### Получение дерева категорий
```bash
curl http://localhost:3000/api/categories/tree
```

## Лицензия

MIT 