import { sql } from 'drizzle-orm';
import {
  sqliteTable,
  text,
  integer,
  primaryKey,
} from 'drizzle-orm/sqlite-core';

export const roles = sqliteTable('roles', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  role: text('role').notNull().unique(),
});

export const users = sqliteTable('users', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  roleId: integer('role_id').references(() => roles.id),
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

export const exercises = sqliteTable('exercises', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  image_url: text('image_url'),
  video_url: text('video_url'),
});

export const muscleGroups = sqliteTable('musclegroups', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  name: text('name').notNull(),
});

export const stages = sqliteTable('stages', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  name: text('name').notNull(),
});

export const exercisesToMuscleGroups = sqliteTable(
  'exercises_musclegroups',
  {
    exerciseId: integer('exercise_id')
      .notNull()
      .references(() => exercises.id),
    muscleGroupId: integer('musclegroup_id')
      .notNull()
      .references(() => muscleGroups.id),
  },
  (table) => {
    return {
      pk: primaryKey(table.exerciseId, table.muscleGroupId),
    };
  }
);

export const exercisesToStages = sqliteTable(
  'exercises_stages',
  {
    exerciseId: integer('exercise_id')
      .notNull()
      .references(() => exercises.id),
    stagesId: integer('stages_id')
      .notNull()
      .references(() => stages.id),
  },
  (table) => {
    return {
      pk: primaryKey(table.exerciseId, table.stagesId),
    };
  }
);
