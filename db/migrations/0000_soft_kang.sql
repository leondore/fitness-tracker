CREATE TABLE `exercises` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer DEFAULT (cast (unixepoch () as int)),
	`updated_at` integer DEFAULT (cast (unixepoch () as int)),
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
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`musclegroup_id`) REFERENCES `musclegroups`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `exercises_stages` (
	`exercise_id` integer NOT NULL,
	`stages_id` integer NOT NULL,
	PRIMARY KEY(`exercise_id`, `stages_id`),
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`stages_id`) REFERENCES `stages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `musclegroups` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer DEFAULT (cast (unixepoch () as int)),
	`updated_at` integer DEFAULT (cast (unixepoch () as int)),
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`role` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `stages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` integer DEFAULT (cast (unixepoch () as int)),
	`updated_at` integer DEFAULT (cast (unixepoch () as int)),
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`created_at` integer DEFAULT (cast (unixepoch () as int)),
	`updated_at` integer DEFAULT (cast (unixepoch () as int)),
	`email` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text,
	`phone` text,
	`avatar_url` text,
	`role_id` integer NOT NULL,
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `exercises_slug_unique` ON `exercises` (`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `exercise_slug_idx` ON `exercises` (`slug`);--> statement-breakpoint
CREATE INDEX `exercise_name_idx` ON `exercises` (`name`);--> statement-breakpoint
CREATE INDEX `musclegroups_name_idx` ON `musclegroups` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `roles_role_unique` ON `roles` (`role`);--> statement-breakpoint
CREATE UNIQUE INDEX `role_idx` ON `roles` (`role`);--> statement-breakpoint
CREATE INDEX `stages_name_idx` ON `stages` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `first_name_last_name_idx` ON `users` (`first_name`,`last_name`);