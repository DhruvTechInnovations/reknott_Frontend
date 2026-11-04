// Professional, dignified, high-resolution portrait photography curated for ReKnott profiles
// Photos represent South Asian men and women across age groups (28-55) in authentic, respectful settings.

export interface PhotoAsset {
  id: string;
  url: string;
  caption: string;
  gallery: string[];
}

export const WOMEN_PORTRAITS: PhotoAsset[] = [
  {
    id: "woman-1",
    url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&h=1000&q=85",
    caption: "Portrait in office library",
    gallery: [
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&h=1000&q=85",
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&h=1000&q=85",
      "https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=800&h=1000&q=85",
    ],
  },
  {
    id: "woman-2",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&h=1000&q=85",
    caption: "Thoughtful outdoor portrait",
    gallery: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&h=1000&q=85",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&h=1000&q=85",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&h=1000&q=85",
    ],
  },
  {
    id: "woman-3",
    url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&h=1000&q=85",
    caption: "Warm natural light portrait",
    gallery: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&h=1000&q=85",
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&h=1000&q=85",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=800&h=1000&q=85",
    ],
  },
  {
    id: "woman-4",
    url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&h=1000&q=85",
    caption: "Radiant, cheerful smile",
    gallery: [
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&h=1000&q=85",
      "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=800&h=1000&q=85",
      "https://images.unsplash.com/photo-1573497019236-17f8177b81e8?auto=format&fit=crop&w=800&h=1000&q=85",
    ],
  },
  {
    id: "woman-5",
    url: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=800&h=1000&q=85",
    caption: "Graceful and poised",
    gallery: [
      "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=800&h=1000&q=85",
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&h=1000&q=85",
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&h=1000&q=85",
    ],
  },
  {
    id: "woman-6",
    url: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&h=1000&q=85",
    caption: "Established medical professional",
    gallery: [
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=800&h=1000&q=85",
      "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=800&h=1000&q=85",
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&h=1000&q=85",
    ],
  },
  {
    id: "woman-7",
    url: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=800&h=1000&q=85",
    caption: "Traditional elegance",
    gallery: [
      "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&w=800&h=1000&q=85",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&h=1000&q=85",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&h=1000&q=85",
    ],
  },
  {
    id: "woman-8",
    url: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=800&h=1000&q=85",
    caption: "Calm, reflective smile",
    gallery: [
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=800&h=1000&q=85",
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&h=1000&q=85",
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&h=1000&q=85",
    ],
  },
];

export const MEN_PORTRAITS: PhotoAsset[] = [
  {
    id: "man-1",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&h=1000&q=85",
    caption: "Warm, grounded portrait",
    gallery: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&h=1000&q=85",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&h=1000&q=85",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&h=1000&q=85",
    ],
  },
  {
    id: "man-2",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&h=1000&q=85",
    caption: "Reflective and approachable",
    gallery: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&h=1000&q=85",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&h=1000&q=85",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&h=1000&q=85",
    ],
  },
  {
    id: "man-3",
    url: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&h=1000&q=85",
    caption: "Professional and genuine",
    gallery: [
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&h=1000&q=85",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&h=1000&q=85",
      "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=800&h=1000&q=85",
    ],
  },
  {
    id: "man-4",
    url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&h=1000&q=85",
    caption: "Thoughtful outdoor setting",
    gallery: [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&h=1000&q=85",
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&h=1000&q=85",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&h=1000&q=85",
    ],
  },
  {
    id: "man-5",
    url: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=800&h=1000&q=85",
    caption: "Established consultant",
    gallery: [
      "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=800&h=1000&q=85",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&h=1000&q=85",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&h=1000&q=85",
    ],
  },
  {
    id: "man-6",
    url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&h=1000&q=85",
    caption: "Entrepreneur and leader",
    gallery: [
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&h=1000&q=85",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&h=1000&q=85",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&h=1000&q=85",
    ],
  },
  {
    id: "man-7",
    url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&h=1000&q=85",
    caption: "Approachable and kind",
    gallery: [
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&h=1000&q=85",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&h=1000&q=85",
      "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=800&h=1000&q=85",
    ],
  },
  {
    id: "man-8",
    url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&h=1000&q=85",
    caption: "Creative designer",
    gallery: [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=800&h=1000&q=85",
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&h=1000&q=85",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&h=1000&q=85",
    ],
  },
];

// Helper to hash string to consistent numeric seed
function hashSeed(seed: string | number): number {
  if (typeof seed === "number") return Math.abs(seed);
  let hash = 0;
  const str = String(seed);
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Returns deterministic profile photo asset matching gender and seed
 */
export function getProfilePhotoAsset(seed: string | number, gender: "woman" | "man"): PhotoAsset {
  const list = gender === "woman" ? WOMEN_PORTRAITS : MEN_PORTRAITS;
  const index = hashSeed(seed) % list.length;
  return list[index];
}

/**
 * Returns a primary photo URL
 */
export function getProfilePhotoUrl(seed: string | number, gender: "woman" | "man"): string {
  return getProfilePhotoAsset(seed, gender).url;
}

/**
 * Returns an array of gallery photos for rich profile viewing
 */
export function getProfileGalleryUrls(seed: string | number, gender: "woman" | "man"): string[] {
  return getProfilePhotoAsset(seed, gender).gallery;
}
