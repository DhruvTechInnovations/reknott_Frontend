import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const demoUsers = sqliteTable("demo_users", {
  id: text("id").primaryKey(),
  displayName: text("display_name").notNull(),
  email: text("email").notNull(),
  age: integer("age").notNull(),
  city: text("city").notNull(),
  profession: text("profession").notNull(),
  bio: text("bio").notNull(),
  gender: text("gender"),
  preferredGender: text("preferred_gender"),
  preferredAgeMin: integer("preferred_age_min"),
  preferredAgeMax: integer("preferred_age_max"),
  preferredCities: text("preferred_cities"),
  phone: text("phone"),
  height: text("height"),
  motherTongue: text("mother_tongue"),
  education: text("education"),
  annualIncome: text("annual_income"),
  hometown: text("hometown"),
  children: text("children"),
  familyDetails: text("family_details"),
  valuesText: text("values_text"),
  interestsText: text("interests_text"),
  eligibilityLabel: text("eligibility_label"),
  passwordSalt: text("password_salt"),
  passwordHash: text("password_hash"),
  createdAt: text("created_at").notNull(),
}, (table) => [uniqueIndex("idx_demo_users_email").on(table.email)]);

export const demoSessions = sqliteTable("demo_sessions", {
  tokenHash: text("token_hash").primaryKey(),
  platformUserId: text("platform_user_id").notNull(),
  personaId: text("persona_id").notNull().references(() => demoUsers.id),
  createdAt: text("created_at").notNull(),
  expiresAt: text("expires_at").notNull(),
}, (table) => [
  index("idx_demo_sessions_platform_expiry").on(table.platformUserId, table.expiresAt),
]);

export const demoPhotos = sqliteTable("demo_photos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => demoUsers.id),
  assetPath: text("asset_path").notNull(),
  cropKey: text("crop_key").notNull(),
  altText: text("alt_text").notNull(),
  sortOrder: integer("sort_order").notNull(),
  isPrimary: integer("is_primary", { mode: "boolean" }).notNull(),
  storageKey: text("storage_key"),
  createdAt: text("created_at").notNull(),
}, (table) => [
  uniqueIndex("idx_demo_photos_user_order").on(table.userId, table.sortOrder),
]);

export const demoPasswordResetRequests = sqliteTable("demo_password_reset_requests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull(),
  requestedAt: text("requested_at").notNull(),
  status: text("status").notNull(),
}, (table) => [
  index("idx_demo_password_resets_email_time").on(table.email, table.requestedAt),
]);

export const demoConnections = sqliteTable("demo_connections", {
  id: text("id").primaryKey(),
  userOneId: text("user_one_id").notNull().references(() => demoUsers.id),
  userTwoId: text("user_two_id").notNull().references(() => demoUsers.id),
  status: text("status").notNull(),
  createdAt: text("created_at").notNull(),
}, (table) => [
  uniqueIndex("idx_demo_connections_pair").on(table.userOneId, table.userTwoId),
]);

export const demoMessages = sqliteTable("demo_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  connectionId: text("connection_id").notNull().references(() => demoConnections.id),
  senderId: text("sender_id").notNull().references(() => demoUsers.id),
  body: text("body").notNull(),
  sentAt: text("sent_at").notNull(),
  deliveredAt: text("delivered_at"),
  readAt: text("read_at"),
}, (table) => [
  index("idx_demo_messages_connection_sent").on(table.connectionId, table.sentAt),
  index("idx_demo_messages_receipt").on(table.connectionId, table.senderId, table.readAt),
]);
