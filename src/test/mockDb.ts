import { Knex } from 'knex';

const mockDb = jest.fn(() => ({
  migrate: {
    latest: jest.fn().mockResolvedValue([]),
  },
  destroy: jest.fn().mockResolvedValue(undefined),
  insert: jest.fn().mockReturnThis(),
  returning: jest.fn().mockReturnThis(),
  then: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  first: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  del: jest.fn().mockReturnThis(),
  leftJoin: jest.fn().mockReturnThis(),
  join: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  groupBy: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  count: jest.fn().mockReturnThis(),
  raw: jest.fn().mockReturnThis(),
  on: jest.fn().mockReturnThis(),
  andOn: jest.fn().mockReturnThis(),
})) as unknown as Knex;

export { mockDb }; 