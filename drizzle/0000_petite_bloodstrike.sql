CREATE TABLE `demo_connections` (
	`id` text PRIMARY KEY NOT NULL,
	`user_one_id` text NOT NULL,
	`user_two_id` text NOT NULL,
	`status` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_one_id`) REFERENCES `demo_users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_two_id`) REFERENCES `demo_users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_demo_connections_pair` ON `demo_connections` (`user_one_id`,`user_two_id`);--> statement-breakpoint
CREATE TABLE `demo_messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`connection_id` text NOT NULL,
	`sender_id` text NOT NULL,
	`body` text NOT NULL,
	`sent_at` text NOT NULL,
	`delivered_at` text,
	`read_at` text,
	FOREIGN KEY (`connection_id`) REFERENCES `demo_connections`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`sender_id`) REFERENCES `demo_users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_demo_messages_connection_sent` ON `demo_messages` (`connection_id`,`sent_at`);--> statement-breakpoint
CREATE INDEX `idx_demo_messages_receipt` ON `demo_messages` (`connection_id`,`sender_id`,`read_at`);--> statement-breakpoint
CREATE TABLE `demo_sessions` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`platform_user_id` text NOT NULL,
	`persona_id` text NOT NULL,
	`created_at` text NOT NULL,
	`expires_at` text NOT NULL,
	FOREIGN KEY (`persona_id`) REFERENCES `demo_users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_demo_sessions_platform_expiry` ON `demo_sessions` (`platform_user_id`,`expires_at`);--> statement-breakpoint
CREATE TABLE `demo_users` (
	`id` text PRIMARY KEY NOT NULL,
	`display_name` text NOT NULL,
	`email` text NOT NULL,
	`age` integer NOT NULL,
	`city` text NOT NULL,
	`profession` text NOT NULL,
	`bio` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_demo_users_email` ON `demo_users` (`email`);--> statement-breakpoint
PRAGMA optimize;
