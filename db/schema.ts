import { relations, sql } from 'drizzle-orm';
import {
  sqliteTable,
  text,
  integer,
  primaryKey,
  uniqueIndex,
  index,
} from 'drizzle-orm/sqlite-core';

export const roles = sqliteTable(
  'roles',
  {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    role: text('role').notNull().unique(),
  },
  (table) => {
    return {
      roleIdx: uniqueIndex('role_idx').on(table.role),
    };
  }
);

export const rolesRelations = relations(roles, ({ many }) => ({
  users: many(users),
}));

export const users = sqliteTable(
  'users',
  {
    id: text('id').primaryKey(),
    createdAt: integer('created_at').default(sql`(cast (unixepoch () as int))`),
    updatedAt: integer('updated_at').default(sql`(cast (unixepoch () as int))`),
    email: text('email').notNull().unique(),
    firstName: text('first_name').notNull(),
    lastName: text('last_name'),
    phone: text('phone'),
    avatarUrl: text('avatar_url'),
    roleId: integer('role_id')
      .notNull()
      .references(() => roles.id),
  },
  (table) => {
    return {
      emailIdx: uniqueIndex('email_idx').on(table.email),
      firstNameLastNameIdx: index('first_name_last_name_idx').on(
        table.firstName,
        table.lastName
      ),
    };
  }
);

export const usersRelations = relations(users, ({ one }) => ({
  role: one(roles, {
    fields: [users.roleId],
    references: [roles.id],
  }),
}));

export const exercises = sqliteTable(
  'exercises',
  {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    createdAt: integer('created_at').default(sql`(cast (unixepoch () as int))`),
    updatedAt: integer('updated_at').default(sql`(cast (unixepoch () as int))`),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    image_url: text('image_url'),
    video_url: text('video_url'),
  },
  (table) => {
    return {
      slugIdx: uniqueIndex('exercise_slug_idx').on(table.slug),
      nameIdx: index('exercise_name_idx').on(table.name),
    };
  }
);

export const exercisesRelations = relations(exercises, ({ many }) => ({
  exercisesToMuscleGroups: many(exercisesToMuscleGroups),
  exercisesToStages: many(exercisesToStages),
}));

export const muscleGroups = sqliteTable(
  'musclegroups',
  {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    createdAt: integer('created_at').default(sql`(cast (unixepoch () as int))`),
    updatedAt: integer('updated_at').default(sql`(cast (unixepoch () as int))`),
    name: text('name').notNull(),
  },
  (table) => {
    return {
      nameIdx: index('musclegroups_name_idx').on(table.name),
    };
  }
);

export const muscleGroupsRelations = relations(muscleGroups, ({ many }) => ({
  exercisesToMuscleGroups: many(exercisesToMuscleGroups),
}));

export const stages = sqliteTable(
  'stages',
  {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    createdAt: integer('created_at').default(sql`(cast (unixepoch () as int))`),
    updatedAt: integer('updated_at').default(sql`(cast (unixepoch () as int))`),
    name: text('name').notNull(),
  },
  (table) => {
    return {
      nameIdx: index('stages_name_idx').on(table.name),
    };
  }
);

export const stagesRelations = relations(stages, ({ many }) => ({
  exercisesToStages: many(exercisesToStages),
}));

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

export const exercisesToMuscleGroupsRelations = relations(
  exercisesToMuscleGroups,
  ({ one }) => ({
    exercises: one(exercises, {
      fields: [exercisesToMuscleGroups.exerciseId],
      references: [exercises.id],
    }),
    muscleGroups: one(muscleGroups, {
      fields: [exercisesToMuscleGroups.muscleGroupId],
      references: [muscleGroups.id],
    }),
  })
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

export const exercisesToStagesRelations = relations(
  exercisesToStages,
  ({ one }) => ({
    exercises: one(exercises, {
      fields: [exercisesToStages.exerciseId],
      references: [exercises.id],
    }),
    stages: one(stages, {
      fields: [exercisesToStages.stagesId],
      references: [stages.id],
    }),
  })
);

// Types
export type MuscleGroups = typeof muscleGroups.$inferSelect;
export type Stages = typeof stages.$inferSelect;
