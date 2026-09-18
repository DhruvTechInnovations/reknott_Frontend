import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import test from "node:test";
import { DatabaseSync } from "node:sqlite";

const migrationDirectory = new URL("../drizzle/", import.meta.url);

function createDatabase() {
  const database = new DatabaseSync(":memory:");
  const migrations = readdirSync(migrationDirectory).filter((name) => name.endsWith(".sql")).sort();
  for (const migration of migrations) {
    const statements = readFileSync(new URL(migration, migrationDirectory), "utf8")
      .split("--> statement-breakpoint")
      .map((statement) => statement.trim())
      .filter(Boolean);
    for (const statement of statements) database.exec(statement);
  }
  return database;
}

test("message receipts move from sent to delivered to read", () => {
  const database = createDatabase();
  const now = "2026-09-08T12:00:00.000Z";

  const addUser = database.prepare(`
    INSERT INTO demo_users
      (id, display_name, email, age, city, profession, bio, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  addUser.run("ananya", "Ananya Rao", "ananya@reknott.demo", 36, "Hyderabad", "Architect", "Demo", now);
  addUser.run("rahul", "Rahul Varma", "rahul@reknott.demo", 41, "Bengaluru", "Entrepreneur", "Demo", now);
  database.prepare(`
    INSERT INTO demo_connections (id, user_one_id, user_two_id, status, created_at)
    VALUES (?, ?, ?, 'connected', ?)
  `).run("ananya-rahul", "ananya", "rahul", now);

  database.prepare(`
    INSERT INTO demo_messages (connection_id, sender_id, body, sent_at)
    VALUES (?, ?, ?, ?)
  `).run("ananya-rahul", "ananya", "Hello Rahul", now);

  let message = database.prepare("SELECT * FROM demo_messages WHERE id = 1").get();
  assert.equal(message.delivered_at, null);
  assert.equal(message.read_at, null);

  const deliveredAt = "2026-09-08T12:00:02.000Z";
  database.prepare(`
    UPDATE demo_messages SET delivered_at = ?
    WHERE connection_id = ? AND sender_id != ? AND delivered_at IS NULL
  `).run(deliveredAt, "ananya-rahul", "rahul");
  message = database.prepare("SELECT * FROM demo_messages WHERE id = 1").get();
  assert.equal(message.delivered_at, deliveredAt);
  assert.equal(message.read_at, null);

  const readAt = "2026-09-08T12:00:03.000Z";
  database.prepare(`
    UPDATE demo_messages
    SET delivered_at = COALESCE(delivered_at, ?), read_at = ?
    WHERE connection_id = ? AND sender_id != ? AND read_at IS NULL
  `).run(readAt, readAt, "ananya-rahul", "rahul");
  message = database.prepare("SELECT * FROM demo_messages WHERE id = 1").get();
  assert.equal(message.delivered_at, deliveredAt);
  assert.equal(message.read_at, readAt);
});

test("conversation query uses its composite index", () => {
  const database = createDatabase();
  const plan = database.prepare(`
    EXPLAIN QUERY PLAN
    SELECT * FROM demo_messages
    WHERE connection_id = ?
    ORDER BY sent_at ASC
  `).all("ananya-rahul");
  assert.match(plan.map((row) => row.detail).join(" "), /idx_demo_messages_connection_sent/);
});

test("member profiles support credentials, preferences, biodata and ordered photos", () => {
  const database = createDatabase();
  const columns = database.prepare("PRAGMA table_info(demo_users)").all().map((row) => row.name);
  assert.ok(columns.includes("phone"));
  assert.ok(columns.includes("password_hash"));
  assert.ok(columns.includes("eligibility_label"));
  assert.ok(columns.includes("gender"));
  assert.ok(columns.includes("preferred_gender"));
  assert.ok(columns.includes("preferred_age_min"));
  assert.ok(columns.includes("preferred_cities"));

  const photoColumns = database.prepare("PRAGMA table_info(demo_photos)").all().map((row) => row.name);
  assert.ok(photoColumns.includes("storage_key"));

  const indexes = database.prepare("SELECT name FROM sqlite_schema WHERE type = 'index'").all().map((row) => row.name);
  assert.ok(indexes.includes("idx_demo_photos_user_order"));
  assert.ok(indexes.includes("idx_demo_password_resets_email_time"));
});

test("profile edits, reset requests and uploaded photo metadata persist", () => {
  const database = createDatabase();
  const now = "2026-09-08T12:00:00.000Z";
  database.prepare(`INSERT INTO demo_users (id, display_name, email, age, city, profession, bio, gender, preferred_gender, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run("rahul", "Rahul Varma", "rahul@reknott.demo", 41, "Bengaluru", "Entrepreneur", "Demo", "man", "woman", now);
  database.prepare("UPDATE demo_users SET preferred_age_min = ?, preferred_age_max = ?, preferred_cities = ? WHERE id = ?")
    .run(33, 41, "Hyderabad,Pune", "rahul");
  database.prepare(`INSERT INTO demo_photos (user_id, asset_path, crop_key, alt_text, sort_order, is_primary, storage_key, created_at) VALUES (?, '', 'uploaded', ?, 1, 0, ?, ?)`)
    .run("rahul", "Member photo", "demo-profile-photos/rahul/one.jpg", now);
  database.prepare("INSERT INTO demo_password_reset_requests (email, requested_at, status) VALUES (?, ?, 'requested')")
    .run("rahul@reknott.demo", now);

  const user = database.prepare("SELECT preferred_age_min, preferred_age_max, preferred_cities FROM demo_users WHERE id = ?").get("rahul");
  assert.equal(user.preferred_age_min, 33);
  assert.equal(user.preferred_age_max, 41);
  assert.equal(user.preferred_cities, "Hyderabad,Pune");
  assert.equal(database.prepare("SELECT storage_key FROM demo_photos WHERE user_id = ?").get("rahul").storage_key, "demo-profile-photos/rahul/one.jpg");
  assert.equal(database.prepare("SELECT status FROM demo_password_reset_requests WHERE email = ?").get("rahul@reknott.demo").status, "requested");
});
