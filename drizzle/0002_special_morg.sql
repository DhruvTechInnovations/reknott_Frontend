CREATE TABLE `demo_password_reset_requests` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`requested_at` text NOT NULL,
	`status` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_demo_password_resets_email_time` ON `demo_password_reset_requests` (`email`,`requested_at`);--> statement-breakpoint
ALTER TABLE `demo_photos` ADD `storage_key` text;--> statement-breakpoint
ALTER TABLE `demo_users` ADD `gender` text;--> statement-breakpoint
ALTER TABLE `demo_users` ADD `preferred_gender` text;--> statement-breakpoint
ALTER TABLE `demo_users` ADD `preferred_age_min` integer;--> statement-breakpoint
ALTER TABLE `demo_users` ADD `preferred_age_max` integer;--> statement-breakpoint
ALTER TABLE `demo_users` ADD `preferred_cities` text;
--> statement-breakpoint
PRAGMA optimize;
