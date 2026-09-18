import { databaseErrorResponse, ensureDemoData, getDemoDatabase, getDemoSession } from "@/lib/server/demo-chat";

export const dynamic = "force-dynamic";

type ProfileRow = {
  id: string; displayName: string; email: string; age: number; city: string; profession: string; bio: string;
  gender: "woman" | "man" | null; preferredGender: "woman" | "man" | null; preferredAgeMin: number | null;
  preferredAgeMax: number | null; preferredCities: string | null; phone: string | null; height: string | null;
  motherTongue: string | null; education: string | null; annualIncome: string | null; hometown: string | null;
  children: string | null; familyDetails: string | null; valuesText: string | null; interestsText: string | null;
  eligibilityLabel: string | null;
};

type PhotoRow = { id: number; userId: string; assetPath: string; cropKey: string; altText: string; sortOrder: number; isPrimary: number; storageKey: string | null };

type ConnectionRow = { id: string; userOneId: string; userTwoId: string; status: string };

const profileSelect = `
  SELECT id, display_name AS displayName, email, age, city, profession, bio, gender,
    preferred_gender AS preferredGender, preferred_age_min AS preferredAgeMin,
    preferred_age_max AS preferredAgeMax, preferred_cities AS preferredCities,
    phone, height, mother_tongue AS motherTongue, education, annual_income AS annualIncome,
    hometown, children, family_details AS familyDetails, values_text AS valuesText,
    interests_text AS interestsText, eligibility_label AS eligibilityLabel
  FROM demo_users`;

export async function GET(request: Request) {
  try {
    const session = await getDemoSession(request);
    if (!session) return Response.json({ error: "Member sign-in required." }, { status: 401 });

    const database = getDemoDatabase();
    await ensureDemoData(database);
    const viewer = await database.prepare(`${profileSelect} WHERE id = ?`).bind(session.persona.id).first<ProfileRow>();
    if (!viewer) return Response.json({ error: "Your member profile is unavailable." }, { status: 404 });

    const targetGender = viewer.preferredGender ?? (viewer.gender === "man" ? "woman" : "man");
    const [profilesResult, photosResult, connectionsResult] = await Promise.all([
      database.prepare(`${profileSelect} WHERE id <> ? AND gender = ?`).bind(viewer.id, targetGender).all<ProfileRow>(),
      database.prepare(`SELECT id, user_id AS userId, asset_path AS assetPath, crop_key AS cropKey, alt_text AS altText, sort_order AS sortOrder, is_primary AS isPrimary, storage_key AS storageKey FROM demo_photos ORDER BY sort_order ASC`).all<PhotoRow>(),
      database.prepare(`SELECT id, user_one_id AS userOneId, user_two_id AS userTwoId, status FROM demo_connections WHERE user_one_id = ? OR user_two_id = ?`).bind(viewer.id, viewer.id).all<ConnectionRow>(),
    ]);

    const photosByUser = new Map<string, PhotoRow[]>();
    for (const photo of photosResult.results) {
      const photos = photosByUser.get(photo.userId) ?? [];
      photos.push(photo);
      photosByUser.set(photo.userId, photos);
    }

    const matches = profilesResult.results.map((profile) => {
      const connection = connectionsResult.results.find((item) => item.userOneId === profile.id || item.userTwoId === profile.id);
      const ranking = rankMatch(viewer, profile);
      return {
        ...publicProfile(profile),
        email: connection?.status === "connected" ? profile.email : null,
        phone: connection?.status === "connected" ? profile.phone : null,
        photos: (photosByUser.get(profile.id) ?? []).map(publicPhoto),
        connection: connection ? { id: connection.id, status: connection.status } : null,
        compatibilityScore: ranking.score,
        matchReasons: ranking.reasons,
      };
    }).sort((left, right) => right.compatibilityScore - left.compatibilityScore || left.displayName.localeCompare(right.displayName));

    return Response.json({
      viewer: session.persona,
      viewerProfile: { ...publicProfile(viewer), email: viewer.email, phone: viewer.phone, preferredGender: viewer.preferredGender, preferredAgeMin: viewer.preferredAgeMin, preferredAgeMax: viewer.preferredAgeMax, preferredCities: splitList(viewer.preferredCities) },
      ownPhotos: (photosByUser.get(viewer.id) ?? []).map(publicPhoto),
      matches,
    });
  } catch (error) {
    return databaseErrorResponse(error);
  }
}

function publicProfile(profile: ProfileRow) {
  return {
    id: profile.id, displayName: profile.displayName, age: profile.age, city: profile.city, profession: profile.profession,
    bio: profile.bio, gender: profile.gender, height: profile.height, motherTongue: profile.motherTongue,
    education: profile.education, annualIncome: profile.annualIncome, hometown: profile.hometown, children: profile.children,
    familyDetails: profile.familyDetails, valuesText: profile.valuesText, eligibilityLabel: profile.eligibilityLabel,
    interests: splitList(profile.interestsText),
  };
}

function publicPhoto(photo: PhotoRow) {
  return { id: photo.id, url: photo.storageKey ? `/api/demo/photos/${photo.id}` : photo.assetPath, cropKey: photo.cropKey, altText: photo.altText, sortOrder: photo.sortOrder, isPrimary: photo.isPrimary, uploaded: Boolean(photo.storageKey) };
}

function splitList(value: string | null): string[] {
  return value?.split(",").map((item) => item.trim()).filter(Boolean) ?? [];
}

function rankMatch(viewer: ProfileRow, match: ProfileRow) {
  let score = 12;
  const reasons: string[] = [];
  if (viewer.preferredAgeMin && viewer.preferredAgeMax && match.age >= viewer.preferredAgeMin && match.age <= viewer.preferredAgeMax) {
    score += 43;
    reasons.push("Within your preferred age range");
  }
  const preferredCities = splitList(viewer.preferredCities).map((city) => city.toLowerCase());
  if (preferredCities.includes(match.city.toLowerCase())) {
    score += 25;
    reasons.push("A preferred city");
  }
  if (viewer.motherTongue && match.motherTongue && viewer.motherTongue === match.motherTongue) {
    score += 10;
    reasons.push(`${match.motherTongue} speaking`);
  }
  const viewerInterests = new Set(splitList(viewer.interestsText).map((item) => item.toLowerCase()));
  const shared = splitList(match.interestsText).filter((item) => viewerInterests.has(item.toLowerCase()));
  if (shared.length) {
    score += Math.min(shared.length * 5, 10);
    reasons.push(`Shared interest in ${shared.slice(0, 2).join(" and ")}`);
  }
  if (!reasons.length) reasons.push("Matches your companionship preference");
  return { score: Math.min(score, 98), reasons };
}
