import { databaseErrorResponse, getDemoSession } from "@/lib/server/demo-chat";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await getDemoSession(request);
    if (!session) return Response.json({ authenticated: false }, { status: 401 });
    return Response.json({ authenticated: true, persona: session.persona });
  } catch (error) {
    return databaseErrorResponse(error);
  }
}
