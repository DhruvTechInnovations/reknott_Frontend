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

    const payload = await request.json() as { body?: string };
    const body = payload.body?.trim() ?? "";
    if (!body) return Response.json({ error: "Write a message before sending." }, { status: 400 });
    if (body.length > 1000) {
      return Response.json({ error: "Messages can contain up to 1,000 characters." }, { status: 400 });
    }

    const database = getDemoDatabase();
    const connection = await database.prepare(`
      SELECT id
      FROM demo_connections
      WHERE id = ? AND status = 'connected' AND (user_one_id = ? OR user_two_id = ?)
    `).bind(DEMO_CONNECTION_ID, session.persona.id, session.persona.id).first<{ id: string }>();
    if (!connection) return Response.json({ error: "Connect before sending a message." }, { status: 403 });

    const sentAt = new Date().toISOString();
    const result = await database.prepare(`
      INSERT INTO demo_messages (connection_id, sender_id, body, sent_at)
      VALUES (?, ?, ?, ?)
      RETURNING
        id,
        sender_id AS senderId,
        body,
        sent_at AS sentAt,
        delivered_at AS deliveredAt,
        read_at AS readAt
    `).bind(connection.id, session.persona.id, body, sentAt).first();

    return Response.json({ message: result }, { status: 201 });
  } catch (error) {
    return databaseErrorResponse(error);
  }
}
