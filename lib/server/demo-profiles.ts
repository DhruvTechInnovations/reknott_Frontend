export type ProfileGender = "woman" | "man";

export type DemoProfileSeed = {
  id: string;
  displayName: string;
  email: string;
  age: number;
  city: string;
  profession: string;
  bio: string;
  gender: ProfileGender;
  preferredGender: ProfileGender | null;
  preferredAgeMin: number | null;
  preferredAgeMax: number | null;
  preferredCities: string;
  phone: string;
  height: string;
  motherTongue: string;
  education: string;
  annualIncome: string;
  hometown: string;
  children: string;
  familyDetails: string;
  valuesText: string;
  interestsText: string;
  eligibilityLabel: string;
  passwordSalt?: string;
};

export type DemoPhotoSeed = {
  userId: string;
  assetPath: string;
  cropKey: string;
  altText: string;
  sortOrder: number;
  isPrimary: number;
};

export const demoCredentials = [
  { personaId: "ananya", email: "ananya@reknott.demo", password: "Ananya@123" },
  { personaId: "rahul", email: "rahul@reknott.demo", password: "Rahul@123" },
] as const;

export const demoProfileSeeds: readonly DemoProfileSeed[] = [
  {
    id: "ananya", displayName: "Ananya Rao", email: "ananya@reknott.demo", age: 36, city: "Hyderabad", profession: "Architect",
    bio: "Warm, independent and ready to build a calm partnership shaped by communication and shared family values.", gender: "woman",
    preferredGender: "man", preferredAgeMin: 38, preferredAgeMax: 47, preferredCities: "Hyderabad,Bengaluru,Chennai",
    phone: "+91 00000 12036", height: "5 ft 4 in", motherTongue: "Telugu", education: "Master of Architecture",
    annualIncome: "₹24 lakh annually", hometown: "Vijayawada, Andhra Pradesh", children: "No children",
    familyDetails: "Close-knit family with parents in Vijayawada and one sibling in Hyderabad.",
    valuesText: "Kindness, independence, family connection and open communication.",
    interestsText: "Architecture,Classical music,Weekend travel,Books,Cooking",
    eligibilityLabel: "Earlier marital journey concluded; eligibility reviewed", passwordSalt: "reknott-ananya-demo-2026",
  },
  {
    id: "rahul", displayName: "Rahul Varma", email: "rahul@reknott.demo", age: 41, city: "Bengaluru", profession: "Entrepreneur",
    bio: "Grounded and reflective, hoping to share everyday life with someone who values honesty, warmth and family bonds.", gender: "man",
    preferredGender: "woman", preferredAgeMin: 33, preferredAgeMax: 41, preferredCities: "Hyderabad,Bengaluru,Pune",
    phone: "+91 00000 12041", height: "5 ft 10 in", motherTongue: "Telugu", education: "MBA, Finance",
    annualIncome: "₹38 lakh annually", hometown: "Warangal, Telangana", children: "One child; shared parenting arrangement",
    familyDetails: "Warm, progressive family with parents in Warangal and a sister in Bengaluru.",
    valuesText: "Honesty, emotional maturity, stability and respect for each person's family.",
    interestsText: "Music,Long drives,Fitness,Food trails,Community work",
    eligibilityLabel: "Earlier marital journey concluded; eligibility reviewed", passwordSalt: "reknott-rahul-demo-2026",
  },
  {
    id: "neha", displayName: "Neha Kulkarni", email: "neha@reknott.example", age: 39, city: "Pune", profession: "Educator",
    bio: "Optimistic and grounded, looking for an equal partnership with room for family, learning and everyday joy.", gender: "woman",
    preferredGender: null, preferredAgeMin: null, preferredAgeMax: null, preferredCities: "",
    phone: "+91 00000 12039", height: "5 ft 5 in", motherTongue: "Marathi", education: "M.Ed",
    annualIncome: "₹18 lakh annually", hometown: "Nashik, Maharashtra", children: "One child",
    familyDetails: "Supportive family based in Maharashtra.", valuesText: "Equality, curiosity, kindness and a peaceful home.",
    interestsText: "Reading,Fitness,Education,Travel", eligibilityLabel: "Earlier marital journey concluded; eligibility reviewed",
  },
  {
    id: "priya", displayName: "Priya Raman", email: "priya@reknott.example", age: 44, city: "Chennai", profession: "Doctor",
    bio: "Compassionate and self-assured, hoping to share the years ahead through conversation, travel and mutual respect.", gender: "woman",
    preferredGender: null, preferredAgeMin: null, preferredAgeMax: null, preferredCities: "",
    phone: "+91 00000 12044", height: "5 ft 3 in", motherTongue: "Tamil", education: "MBBS, MD",
    annualIncome: "₹32 lakh annually", hometown: "Madurai, Tamil Nadu", children: "Two adult children",
    familyDetails: "Independent family with strong ties across Chennai and Madurai.",
    valuesText: "Compassion, independence and respect for established families.",
    interestsText: "Travel,Classical dance,Healthcare,Reading", eligibilityLabel: "Earlier marital journey concluded; eligibility reviewed",
  },
  {
    id: "arjun", displayName: "Arjun Deshmukh", email: "arjun@reknott.example", age: 40, city: "Pune", profession: "Product Designer",
    bio: "Creative and emotionally aware, ready for companionship shaped by humour, honest communication and shared responsibility.", gender: "man",
    preferredGender: null, preferredAgeMin: null, preferredAgeMax: null, preferredCities: "",
    phone: "+91 00000 12040", height: "5 ft 9 in", motherTongue: "Marathi", education: "Master of Design",
    annualIncome: "₹28 lakh annually", hometown: "Nagpur, Maharashtra", children: "No children",
    familyDetails: "Progressive family that values independence and creativity.",
    valuesText: "Humour, communication, personal space and shared responsibility.",
    interestsText: "Design,Cooking,Music,Cycling", eligibilityLabel: "Earlier marital journey concluded; eligibility reviewed",
  },
  {
    id: "vikram", displayName: "Vikram Reddy", email: "vikram@reknott.example", age: 46, city: "Hyderabad", profession: "Management Consultant",
    bio: "Communicative and family-oriented, hoping to build a supportive partnership with warmth and clarity.", gender: "man",
    preferredGender: null, preferredAgeMin: null, preferredAgeMax: null, preferredCities: "",
    phone: "+91 00000 12046", height: "5 ft 11 in", motherTongue: "Telugu", education: "MBA, Strategy",
    annualIncome: "₹42 lakh annually", hometown: "Karimnagar, Telangana", children: "One child",
    familyDetails: "Close family in Telangana with a practical, modern outlook.",
    valuesText: "Family, health, communication and financial independence.",
    interestsText: "Fitness,Travel,Consulting,Music", eligibilityLabel: "Earlier marital journey concluded; eligibility reviewed",
  },
] as const;

export const demoPhotoSeeds: readonly DemoPhotoSeed[] = [
  { userId: "ananya", assetPath: "/assets/profile-grid.png", cropKey: "woman-one", altText: "Ananya smiling in an olive outfit", sortOrder: 1, isPrimary: 1 },
  { userId: "rahul", assetPath: "/assets/profile-grid.png", cropKey: "man-one", altText: "Rahul smiling in a blue blazer", sortOrder: 1, isPrimary: 1 },
  { userId: "neha", assetPath: "/assets/profile-grid.png", cropKey: "woman-two", altText: "Neha in a light traditional outfit", sortOrder: 1, isPrimary: 1 },
  { userId: "priya", assetPath: "/assets/profile-grid.png", cropKey: "woman-three", altText: "Priya in a relaxed portrait", sortOrder: 1, isPrimary: 1 },
  { userId: "arjun", assetPath: "/assets/profile-grid.png", cropKey: "man-two", altText: "Arjun in a relaxed olive kurta", sortOrder: 1, isPrimary: 1 },
  { userId: "vikram", assetPath: "/assets/profile-grid.png", cropKey: "man-three", altText: "Vikram in a light blue shirt", sortOrder: 1, isPrimary: 1 },
] as const;
