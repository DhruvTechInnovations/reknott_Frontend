import {
  authenticateDemoUser,
  createDemoSession,
  databaseErrorResponse,
  ensureDemoData,
  getDemoDatabase,
  getPlatformUserId,
  sessionCookie,
} from "@/lib/server/demo-chat";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const platformUserId = getPlatformUserId(request);
    if (!platformUserId) {
      return Response.json(
        { error: "Please open the private Site while signed in to continue." },
        { status: 401 },
      );
    }

    const payload = await request.json() as { login?: string; password?: string };
    const login = payload.login?.trim() ?? "";
    const password = payload.password ?? "";
    if (!login || !password) {
      return Response.json({ error: "Enter your username or email and password." }, { status: 400 });
    }

    const database = getDemoDatabase();
    await ensureDemoData(database);
    const persona = await authenticateDemoUser(database, login, password);
    if (!persona) {
      return Response.json({ error: "The username, email or password is incorrect." }, { status: 401 });
    }
    const session = await createDemoSession(database, platformUserId, persona.id);
    return Response.json(
      { persona },
      { headers: { "Set-Cookie": sessionCookie(session.cookieToken, request) } },
    );
  } catch (error) {
    return databaseErrorResponse(error);
  }
}
