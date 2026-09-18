import { databaseErrorResponse, getDemoDatabase, getPlatformUserId } from "@/lib/server/demo-chat";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    if (!getPlatformUserId(request)) return Response.json({ error: "Secure sign-in is required." }, { status: 401 });
    const payload = await request.json() as { email?: string };
    const email = payload.email?.trim().toLowerCase() ?? "";
    if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 160) return Response.json({ error: "Enter a valid registered email." }, { status: 400 });
    await getDemoDatabase().prepare("INSERT INTO demo_password_reset_requests (email, requested_at, status) VALUES (?, ?, 'requested')").bind(email, new Date().toISOString()).run();
    return Response.json({ message: "If the email belongs to a member account, our support team will follow up with reset instructions." });
  } catch (error) {
    return databaseErrorResponse(error);
  }
}
