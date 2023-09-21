import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  roleId: integer('role_id').references(() => roles.id),
});

export const roles = sqliteTable('roles', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  role: text('role').notNull().unique(),
});

export const profiles = sqliteTable('profiles', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  userId: integer('user_id').references(() => users.id),
  firstName: text('first_name').notNull(),
  lastName: text('last_name'),
  phone: text('phone'),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
});
