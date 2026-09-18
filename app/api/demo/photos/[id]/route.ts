import { databaseErrorResponse, getDemoDatabase, getDemoSession, getPhotoBucket } from "@/lib/server/demo-chat";

export const dynamic = "force-dynamic";
type RouteContext = { params: Promise<{ id: string }> };
type StoredPhoto = { id: number; userId: string; storageKey: string | null };

export async function GET(request: Request, context: RouteContext) {
  try {
    const session = await getDemoSession(request);
    if (!session) return Response.json({ error: "Member sign-in required." }, { status: 401 });
    const photo = await findPhoto((await context.params).id);
    if (!photo?.storageKey) return Response.json({ error: "Photograph not found." }, { status: 404 });
    const object = await getPhotoBucket().get(photo.storageKey);
    if (!object) return Response.json({ error: "Photograph not found." }, { status: 404 });
    return new Response(object.body, { headers: { "Content-Type": object.httpMetadata?.contentType ?? "image/jpeg", "Cache-Control": "private, max-age=300" } });
  } catch (error) {
    return databaseErrorResponse(error);
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const session = await getDemoSession(request);
    if (!session) return Response.json({ error: "Member sign-in required." }, { status: 401 });
    const photo = await findPhoto((await context.params).id);
    if (!photo || photo.userId !== session.persona.id || !photo.storageKey) return Response.json({ error: "This photograph cannot be removed." }, { status: 403 });
    await getPhotoBucket().delete(photo.storageKey);
    await getDemoDatabase().prepare("DELETE FROM demo_photos WHERE id = ? AND user_id = ?").bind(photo.id, session.persona.id).run();
    return Response.json({ ok: true });
  } catch (error) {
    return databaseErrorResponse(error);
  }
}

async function findPhoto(rawId: string): Promise<StoredPhoto | null> {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id < 1) return null;
  return getDemoDatabase().prepare("SELECT id, user_id AS userId, storage_key AS storageKey FROM demo_photos WHERE id = ?").bind(id).first<StoredPhoto>();
}
