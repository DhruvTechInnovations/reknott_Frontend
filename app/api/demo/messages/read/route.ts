import {
  databaseErrorResponse,
  DEMO_CONNECTION_ID,
  getDemoDatabase,
  getDemoSession,
} from "@/lib/server/demo-chat";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await getDemoSession(request);
    if (!session) return Response.json({ error: "Demo sign-in required." }, { status: 401 });

    const readAt = new Date().toISOString();
    const result = await getDemoDatabase().prepare(`
      UPDATE demo_messages
      SET delivered_at = COALESCE(delivered_at, ?), read_at = ?
      WHERE connection_id = ? AND sender_id != ? AND read_at IS NULL
    `).bind(readAt, readAt, DEMO_CONNECTION_ID, session.persona.id).run();

    return Response.json({ ok: true, updated: result.meta.changes ?? 0 });
  } catch (error) {
    return databaseErrorResponse(error);
  }
}
