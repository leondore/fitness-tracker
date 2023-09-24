CREATE TABLE `exercises` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`image_url` text,
	`video_url` text
);
--> statement-breakpoint
CREATE TABLE `exercises_musclegroups` (
	`exercise_id` integer NOT NULL,
	`musclegroup_id` integer NOT NULL,
	PRIMARY KEY(`exercise_id`, `musclegroup_id`),
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`musclegroup_id`) REFERENCES `musclegroups`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `exercises_stages` (
	`exercise_id` integer NOT NULL,
	`stages_id` integer NOT NULL,
	PRIMARY KEY(`exercise_id`, `stages_id`),
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`stages_id`) REFERENCES `stages`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `musclegroups` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`user_id` integer,
	`first_name` text NOT NULL,
	`last_name` text,
	`phone` text,
	`avatar_url` text,
	`bio` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`role` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `stages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`role_id` integer,
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `exercises_slug_unique` ON `exercises` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `roles_role_unique` ON `roles` (`role`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);