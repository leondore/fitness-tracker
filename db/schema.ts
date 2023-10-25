import { relations, sql } from 'drizzle-orm';
import {
  sqliteTable,
  text,
  integer,
  primaryKey,
  uniqueIndex,
  index,
} from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

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
      .references(() => exercises.id, { onDelete: 'cascade' }),
    muscleGroupId: integer('musclegroup_id')
      .notNull()
      .references(() => muscleGroups.id, { onDelete: 'cascade' }),
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
      .references(() => exercises.id, { onDelete: 'cascade' }),
    stagesId: integer('stages_id')
      .notNull()
      .references(() => stages.id, { onDelete: 'cascade' }),
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

// Zod schemas
export const selectExerciseSchema = createSelectSchema(exercises);

export const insertExerciseSchema = createInsertSchema(exercises, {
  name: (schema) =>
    schema.name
      .min(3, { message: 'Name must be at least 3 characters long' })
      .max(255),
  video_url: (schema) => schema.video_url.url(),
  image_url: (schema) => schema.image_url.url(),
});

export const submitExerciseSchema = insertExerciseSchema.extend({
  slug: z.string().optional(),
  stages: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
      })
    )
    .optional(),
  musclegroups: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
      })
    )
    .optional(),
});

export const joinedToExercises = z.object({
  exercisesToMuscleGroups: z
    .array(
      z.object({
        muscleGroups: z.object({
          id: z.number(),
          name: z.string(),
        }),
      })
    )
    .optional(),
  exercisesToStages: z
    .array(
      z.object({
        stages: z.object({
          id: z.number(),
          name: z.string(),
        }),
      })
    )
    .optional(),
});

export const selectExerciseJoinedSchema =
  selectExerciseSchema.merge(joinedToExercises);

export const submitExerciseJoinedSchema =
  submitExerciseSchema.merge(joinedToExercises);

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email address field is required' })
    .email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password field is required' }),
});

export const signupSchema = z
  .object({
    firstName: z.string().min(1, { message: 'First name field is required' }),
    email: z
      .string()
      .min(1, { message: 'Email address field is required' })
      .email({ message: 'Please enter a valid email address' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter',
      })
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter',
      })
      .regex(/[0-9]/, {
        message: 'Password must contain at least one number',
      })
      .regex(/[@$!%*?&]/, {
        message: 'Password must contain at least one of the following: @$!%*?&',
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Types
export type Exercise = z.infer<typeof selectExerciseSchema>;
export type ExerciseFull = z.infer<typeof selectExerciseJoinedSchema>;

export type ExerciseInsert = z.infer<typeof insertExerciseSchema>;
export type ExerciseSubmit = z.infer<typeof submitExerciseSchema>;
export type ExerciseSubmitBody = z.infer<typeof submitExerciseJoinedSchema>;

export type MuscleGroup = typeof muscleGroups.$inferSelect;
export type Stage = typeof stages.$inferSelect;
export type ExerciseToMuscleGroup = typeof exercisesToMuscleGroups.$inferInsert;
export type ExerciseToStage = typeof exercisesToStages.$inferInsert;
