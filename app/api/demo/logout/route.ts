import {
  clearSessionCookie,
  databaseErrorResponse,
  deleteDemoSession,
} from "@/lib/server/demo-chat";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await deleteDemoSession(request);
    return Response.json(
      { ok: true },
      { headers: { "Set-Cookie": clearSessionCookie(request) } },
    );
  } catch (error) {
    return databaseErrorResponse(error);
  }
}
