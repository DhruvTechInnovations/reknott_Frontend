import { databaseErrorResponse, ensureDemoData, getDemoDatabase, getDemoSession, getPhotoBucket } from "@/lib/server/demo-chat";

export const dynamic = "force-dynamic";
const maxPhotoBytes = 5 * 1024 * 1024;
const allowedTypes = new Map([["image/jpeg", "jpg"], ["image/png", "png"], ["image/webp", "webp"]]);

export async function POST(request: Request) {
  let storageKey = "";
  try {
    const session = await getDemoSession(request);
    if (!session) return Response.json({ error: "Member sign-in required." }, { status: 401 });
    const formData = await request.formData();
    const photo = formData.get("photo");
    if (!(photo instanceof File)) return Response.json({ error: "Choose a photograph to upload." }, { status: 400 });
    const extension = allowedTypes.get(photo.type);
    if (!extension) return Response.json({ error: "Upload a JPEG, PNG or WebP photograph." }, { status: 400 });
    if (!photo.size || photo.size > maxPhotoBytes) return Response.json({ error: "Photographs must be smaller than 5 MB." }, { status: 400 });

    const database = getDemoDatabase();
    await ensureDemoData(database);
    const uploaded = await database.prepare("SELECT COUNT(*) AS count FROM demo_photos WHERE user_id = ? AND storage_key IS NOT NULL").bind(session.persona.id).first<{ count: number }>();
    if ((uploaded?.count ?? 0) >= 5) return Response.json({ error: "You can add up to five personal photographs in this demonstration." }, { status: 400 });
    const last = await database.prepare("SELECT COALESCE(MAX(sort_order), 0) AS sortOrder FROM demo_photos WHERE user_id = ?").bind(session.persona.id).first<{ sortOrder: number }>();

    storageKey = `demo-profile-photos/${session.persona.id}/${crypto.randomUUID()}.${extension}`;
    await getPhotoBucket().put(storageKey, photo.stream(), { httpMetadata: { contentType: photo.type } });
    const result = await database.prepare(`
      INSERT INTO demo_photos (user_id, asset_path, crop_key, alt_text, sort_order, is_primary, storage_key, created_at)
      VALUES (?, '', 'uploaded', ?, ?, 0, ?, ?) RETURNING id
    `).bind(session.persona.id, `${session.persona.displayName} member photograph`, (last?.sortOrder ?? 0) + 1, storageKey, new Date().toISOString()).first<{ id: number }>();
    return Response.json({ photo: { id: result?.id, url: `/api/demo/photos/${result?.id}` } }, { status: 201 });
  } catch (error) {
    if (storageKey) {
      try { await getPhotoBucket().delete(storageKey); } catch { /* best effort cleanup */ }
    }
    return databaseErrorResponse(error);
  }
}
