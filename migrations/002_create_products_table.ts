import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('products', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.text('description');
    table.decimal('price', 10, 2).notNullable();
    table.integer('category_id').unsigned().notNullable().references('id').inTable('categories').onDelete('CASCADE');
    table.boolean('is_active').notNullable().defaultTo(true);
    table.timestamps(true, true);
    
    table.index(['category_id']);
    table.index(['is_active']);
    table.index(['price']);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('products');
} 