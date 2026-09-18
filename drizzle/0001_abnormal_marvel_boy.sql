CREATE TABLE `demo_photos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`asset_path` text NOT NULL,
	`crop_key` text NOT NULL,
	`alt_text` text NOT NULL,
	`sort_order` integer NOT NULL,
	`is_primary` integer NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `demo_users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_demo_photos_user_order` ON `demo_photos` (`user_id`,`sort_order`);--> statement-breakpoint
ALTER TABLE `demo_users` ADD `phone` text;--> statement-breakpoint
ALTER TABLE `demo_users` ADD `height` text;--> statement-breakpoint
ALTER TABLE `demo_users` ADD `mother_tongue` text;--> statement-breakpoint
ALTER TABLE `demo_users` ADD `education` text;--> statement-breakpoint
ALTER TABLE `demo_users` ADD `annual_income` text;--> statement-breakpoint
ALTER TABLE `demo_users` ADD `hometown` text;--> statement-breakpoint
ALTER TABLE `demo_users` ADD `children` text;--> statement-breakpoint
ALTER TABLE `demo_users` ADD `family_details` text;--> statement-breakpoint
ALTER TABLE `demo_users` ADD `values_text` text;--> statement-breakpoint
ALTER TABLE `demo_users` ADD `interests_text` text;--> statement-breakpoint
ALTER TABLE `demo_users` ADD `eligibility_label` text;--> statement-breakpoint
ALTER TABLE `demo_users` ADD `password_salt` text;--> statement-breakpoint
ALTER TABLE `demo_users` ADD `password_hash` text;--> statement-breakpoint
PRAGMA optimize;
