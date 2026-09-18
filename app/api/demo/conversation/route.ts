import { getDemoPersona } from "@/lib/demo-personas";
import {
  databaseErrorResponse,
  DEMO_CONNECTION_ID,
  getDemoDatabase,
  getDemoSession,
} from "@/lib/server/demo-chat";

export const dynamic = "force-dynamic";

type MessageRow = {
  id: number;
  senderId: string;
  body: string;
  sentAt: string;
  deliveredAt: string | null;
  readAt: string | null;
};

export async function GET(request: Request) {
  try {
    const session = await getDemoSession(request);
    if (!session) return Response.json({ error: "Demo sign-in required." }, { status: 401 });

    const database = getDemoDatabase();
    const connection = await database.prepare(`
      SELECT id, user_one_id AS userOneId, user_two_id AS userTwoId, status
      FROM demo_connections
      WHERE id = ? AND (user_one_id = ? OR user_two_id = ?)
    `).bind(DEMO_CONNECTION_ID, session.persona.id, session.persona.id).first<{
      id: string;
      userOneId: string;
      userTwoId: string;
      status: string;
    }>();

    if (!connection) {
      return Response.json({ error: "This demo connection is unavailable." }, { status: 404 });
    }

    const deliveredAt = new Date().toISOString();
    await database.prepare(`
      UPDATE demo_messages
      SET delivered_at = ?
      WHERE connection_id = ? AND sender_id != ? AND delivered_at IS NULL
    `).bind(deliveredAt, connection.id, session.persona.id).run();

    const result = await database.prepare(`
      SELECT
        id,
        sender_id AS senderId,
        body,
        sent_at AS sentAt,
        delivered_at AS deliveredAt,
        read_at AS readAt
      FROM demo_messages
      WHERE connection_id = ?
      ORDER BY id ASC
      LIMIT 200
    `).bind(connection.id).all<MessageRow>();

    const otherId = connection.userOneId === session.persona.id
      ? connection.userTwoId
      : connection.userOneId;
    const other = getDemoPersona(otherId);
    if (!other) return Response.json({ error: "Demo member not found." }, { status: 404 });

    return Response.json({
      viewer: session.persona,
      other,
      connection: { id: connection.id, status: connection.status },
      messages: result.results,
    });
  } catch (error) {
    return databaseErrorResponse(error);
  }
}
