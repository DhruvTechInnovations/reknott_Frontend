let env: Record<string, unknown> = {};
try {
  // @ts-ignore -- cloudflare:workers is available in Cloudflare Workers runtime
  env = require("cloudflare:workers").env;
} catch {
  env = (process.env as unknown as Record<string, unknown>) ?? {};
}
import { demoPersonas, getDemoPersona, type DemoPersona } from "@/lib/demo-personas";
import { demoCredentials, demoPhotoSeeds, demoProfileSeeds } from "@/lib/server/demo-profiles";

export const DEMO_CONNECTION_ID = "ananya-rahul";
export const DEMO_SESSION_COOKIE = "reknott_demo_session";
const SESSION_LENGTH_SECONDS = 60 * 60 * 24 * 7;

type RuntimeEnv = { DB?: D1Database; BUCKET?: R2Bucket };

export type DemoSession = {
  tokenHash: string;
  platformUserId: string;
  persona: DemoPersona;
  expiresAt: string;
};

export function getDemoDatabase(): D1Database {
  const database = (env as unknown as RuntimeEnv).DB;
  if (!database) {
    throw new Error("The ReKnott message database is temporarily unavailable.");
  }
  return database;
}

export function getPhotoBucket(): R2Bucket {
  const bucket = (env as unknown as RuntimeEnv).BUCKET;
  if (!bucket) throw new Error("Profile photo storage is temporarily unavailable.");
  return bucket;
}

export function getPlatformUserId(request: Request): string | null {
  return request.headers.get("oai-authenticated-user-id");
}

export async function ensureDemoData(database: D1Database): Promise<void> {
  const now = new Date().toISOString();
  const userStatements = demoProfileSeeds.map((profile) => database.prepare(`
    INSERT OR IGNORE INTO demo_users
      (id, display_name, email, age, city, profession, bio, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    profile.id,
    profile.displayName,
    profile.email,
    profile.age,
    profile.city,
    profile.profession,
    profile.bio,
    now,
  ));

  const profileStatements = await Promise.all(demoProfileSeeds.map(async (profile) => {
    const credential = demoCredentials.find((item) => item.personaId === profile.id);
    const passwordHash = credential && profile.passwordSalt
      ? await hashPassword(profile.passwordSalt, credential.password)
      : null;
    return database.prepare(`
      UPDATE demo_users
      SET gender = COALESCE(gender, ?), preferred_gender = COALESCE(preferred_gender, ?),
        preferred_age_min = COALESCE(preferred_age_min, ?), preferred_age_max = COALESCE(preferred_age_max, ?),
        preferred_cities = COALESCE(preferred_cities, ?), phone = COALESCE(phone, ?),
        height = COALESCE(height, ?), mother_tongue = COALESCE(mother_tongue, ?),
        education = COALESCE(education, ?), annual_income = COALESCE(annual_income, ?),
        hometown = COALESCE(hometown, ?), children = COALESCE(children, ?),
        family_details = COALESCE(family_details, ?), values_text = COALESCE(values_text, ?),
        interests_text = COALESCE(interests_text, ?), eligibility_label = COALESCE(eligibility_label, ?),
        password_salt = COALESCE(password_salt, ?), password_hash = COALESCE(password_hash, ?)
      WHERE id = ?
    `).bind(
      profile.gender,
      profile.preferredGender,
      profile.preferredAgeMin,
      profile.preferredAgeMax,
      profile.preferredCities,
      profile.phone,
      profile.height,
      profile.motherTongue,
      profile.education,
      profile.annualIncome,
      profile.hometown,
      profile.children,
      profile.familyDetails,
      profile.valuesText,
      profile.interestsText,
      profile.eligibilityLabel,
      profile.passwordSalt ?? null,
      passwordHash,
      profile.id,
    );
  }));

  const photoStatements = demoPhotoSeeds.map((photo) => database.prepare(`
    INSERT OR IGNORE INTO demo_photos
      (user_id, asset_path, crop_key, alt_text, sort_order, is_primary, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(
    photo.userId,
    photo.assetPath,
    photo.cropKey,
    photo.altText,
    photo.sortOrder,
    photo.isPrimary,
    now,
  ));

  await database.batch([
    ...userStatements,
    ...profileStatements,
    database.prepare("DELETE FROM demo_photos WHERE user_id IN ('ananya', 'rahul') AND sort_order > 1 AND storage_key IS NULL"),
    ...photoStatements,
    database.prepare(`
      INSERT OR IGNORE INTO demo_connections
        (id, user_one_id, user_two_id, status, created_at)
      VALUES (?, ?, ?, 'connected', ?)
    `).bind(DEMO_CONNECTION_ID, demoPersonas[0].id, demoPersonas[1].id, now),
  ]);
}

export async function authenticateDemoUser(
  database: D1Database,
  login: string,
  password: string,
): Promise<DemoPersona | null> {
  const normalizedLogin = login.trim().toLowerCase();
  const row = await database.prepare(`
    SELECT id, password_salt AS passwordSalt, password_hash AS passwordHash
    FROM demo_users
    WHERE email = ? OR id = ?
  `).bind(normalizedLogin, normalizedLogin).first<{
    id: string;
    passwordSalt: string | null;
    passwordHash: string | null;
  }>();

  if (!row?.passwordSalt || !row.passwordHash) return null;
  const suppliedHash = await hashPassword(row.passwordSalt, password);
  if (!safeEqual(suppliedHash, row.passwordHash)) return null;
  return getDemoPersona(row.id) ?? null;
}

export async function createDemoSession(
  database: D1Database,
  platformUserId: string,
  personaId: string,
): Promise<{ cookieToken: string; expiresAt: string }> {
  const persona = getDemoPersona(personaId);
  if (!persona) throw new Error("Unknown demo member.");

  const cookieToken = createRandomToken();
  const tokenHash = await hashToken(cookieToken);
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + SESSION_LENGTH_SECONDS * 1000).toISOString();

  await database.batch([
    database.prepare("DELETE FROM demo_sessions WHERE expires_at <= ?").bind(createdAt.toISOString()),
    database.prepare(`
      INSERT INTO demo_sessions
        (token_hash, platform_user_id, persona_id, created_at, expires_at)
      VALUES (?, ?, ?, ?, ?)
    `).bind(tokenHash, platformUserId, persona.id, createdAt.toISOString(), expiresAt),
  ]);

  return { cookieToken, expiresAt };
}

export async function getDemoSession(request: Request): Promise<DemoSession | null> {
  const platformUserId = getPlatformUserId(request);
  const cookieToken = readCookie(request.headers.get("cookie"), DEMO_SESSION_COOKIE);
  if (!platformUserId || !cookieToken) return null;

  const tokenHash = await hashToken(cookieToken);
  const database = getDemoDatabase();
  const row = await database.prepare(`
    SELECT
      s.token_hash AS tokenHash,
      s.platform_user_id AS platformUserId,
      s.persona_id AS personaId,
      s.expires_at AS expiresAt
    FROM demo_sessions s
    WHERE s.token_hash = ?
      AND s.platform_user_id = ?
      AND s.expires_at > ?
  `).bind(tokenHash, platformUserId, new Date().toISOString()).first<{
    tokenHash: string;
    platformUserId: string;
    personaId: string;
    expiresAt: string;
  }>();

  if (!row) return null;
  const persona = getDemoPersona(row.personaId);
  if (!persona) return null;

  return {
    tokenHash: row.tokenHash,
    platformUserId: row.platformUserId,
    persona,
    expiresAt: row.expiresAt,
  };
}

export async function deleteDemoSession(request: Request): Promise<void> {
  const cookieToken = readCookie(request.headers.get("cookie"), DEMO_SESSION_COOKIE);
  if (!cookieToken) return;
  const database = getDemoDatabase();
  await database.prepare("DELETE FROM demo_sessions WHERE token_hash = ?")
    .bind(await hashToken(cookieToken))
    .run();
}

export function sessionCookie(token: string, request: Request): string {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${DEMO_SESSION_COOKIE}=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=${SESSION_LENGTH_SECONDS}${secure}`;
}

export function clearSessionCookie(request: Request): string {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${DEMO_SESSION_COOKIE}=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0${secure}`;
}

export function databaseErrorResponse(error: unknown): Response {
  console.error("ReKnott demo chat error", error);
  return Response.json(
    { error: "Member services are temporarily unavailable. Please try again." },
    { status: 500 },
  );
}

function readCookie(header: string | null, name: string): string | null {
  if (!header) return null;
  for (const item of header.split(";")) {
    const [key, ...valueParts] = item.trim().split("=");
    if (key === name) return decodeURIComponent(valueParts.join("="));
  }
  return null;
}

function createRandomToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

async function hashToken(token: string): Promise<string> {
  const bytes = new TextEncoder().encode(token);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function hashPassword(salt: string, password: string): Promise<string> {
  const bytes = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function safeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return mismatch === 0;
}
