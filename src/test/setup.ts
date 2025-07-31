import { db } from '../config/database';

beforeAll(async () => {
  await db.migrate.latest();
});

afterAll(async () => {
  await db.destroy();
});

beforeEach(async () => {
  await db('products').del();
  await db('categories').del();
}); 