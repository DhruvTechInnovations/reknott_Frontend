import { databaseErrorResponse, ensureDemoData, getDemoDatabase, getDemoSession } from "@/lib/server/demo-chat";

export const dynamic = "force-dynamic";

type ProfilePayload = {
  age?: number; city?: string; profession?: string; bio?: string; phone?: string; height?: string;
  education?: string; children?: string; familyDetails?: string; valuesText?: string; interestsText?: string;
  preferredAgeMin?: number; preferredAgeMax?: number; preferredCities?: string;
};

export async function PATCH(request: Request) {
  try {
    const session = await getDemoSession(request);
    if (!session) return Response.json({ error: "Member sign-in required." }, { status: 401 });
    const payload = await request.json() as ProfilePayload;
    const age = wholeNumber(payload.age, 21, 80);
    const preferredAgeMin = wholeNumber(payload.preferredAgeMin, 21, 80);
    const preferredAgeMax = wholeNumber(payload.preferredAgeMax, 21, 80);
    if (age === null || preferredAgeMin === null || preferredAgeMax === null || preferredAgeMin > preferredAgeMax) {
      return Response.json({ error: "Check the age and preference ranges before saving." }, { status: 400 });
    }

    const city = clean(payload.city, 80);
    const profession = clean(payload.profession, 100);
    const bio = clean(payload.bio, 600);
    if (!city || !profession || !bio) return Response.json({ error: "City, profession and profile introduction are required." }, { status: 400 });

    const database = getDemoDatabase();
    await ensureDemoData(database);
    await database.prepare(`
      UPDATE demo_users SET age = ?, city = ?, profession = ?, bio = ?, phone = ?, height = ?, education = ?,
        children = ?, family_details = ?, values_text = ?, interests_text = ?, preferred_age_min = ?,
        preferred_age_max = ?, preferred_cities = ? WHERE id = ?
    `).bind(
      age, city, profession, bio, clean(payload.phone, 40), clean(payload.height, 40), clean(payload.education, 140),
      clean(payload.children, 120), clean(payload.familyDetails, 500), clean(payload.valuesText, 400),
      normalizeList(payload.interestsText, 12), preferredAgeMin, preferredAgeMax,
      normalizeList(payload.preferredCities, 8), session.persona.id,
    ).run();
    return Response.json({ ok: true });
  } catch (error) {
    return databaseErrorResponse(error);
  }
}

function wholeNumber(value: unknown, minimum: number, maximum: number): number | null {
  const number = Number(value);
  return Number.isInteger(number) && number >= minimum && number <= maximum ? number : null;
}

function clean(value: unknown, maximum: number): string {
  return typeof value === "string" ? value.trim().slice(0, maximum) : "";
}

function normalizeList(value: unknown, maximumItems: number): string {
  return clean(value, 500).split(",").map((item) => item.trim()).filter(Boolean).slice(0, maximumItems).join(",");
}
