export type Profile = {
  id: string;
  name: string;
  age: number;
  gender: "woman" | "man";
  city: "Hyderabad" | "Bengaluru" | "Pune" | "Chennai";
  intent: "committed" | "exploring";
  children: "none" | "yes";
  language: "telugu" | "hindi" | "marathi" | "tamil";
  role: string;
  height: string;
  value: string;
  review: string;
  about: string;
  tags: string[];
  photoClass: string;
};

export const profiles: Profile[] = [
  { id: "ananya", name: "Ananya", age: 36, gender: "woman", city: "Hyderabad", intent: "committed", children: "none", language: "telugu", role: "Architect", height: "5′4″", value: "Family-oriented", review: "Required checks complete", about: "Warm, independent and ready to begin again through a calm partnership built on communication, shared family values and room for individual growth.", tags: ["Master’s degree", "Travel", "Vegetarian"], photoClass: "photo-1" },
  { id: "rahul", name: "Rahul", age: 41, gender: "man", city: "Bengaluru", intent: "committed", children: "yes", language: "hindi", role: "Entrepreneur", height: "5′10″", value: "Values stability", review: "Required checks complete", about: "Reflective and grounded, looking for companionship again, a peaceful home and mutual respect for the family bonds both people already bring.", tags: ["Entrepreneur", "Music", "Non-smoker"], photoClass: "photo-4" },
  { id: "neha", name: "Neha", age: 39, gender: "woman", city: "Pune", intent: "committed", children: "yes", language: "marathi", role: "Educator", height: "5′5″", value: "Open to relocate", review: "Required checks complete", about: "Optimistic and grounded, ready for a new chapter built on equality, where individuality, experience and togetherness can coexist naturally.", tags: ["Reader", "Fitness", "Education"], photoClass: "photo-2" },
  { id: "arjun", name: "Arjun", age: 35, gender: "man", city: "Pune", intent: "exploring", children: "none", language: "marathi", role: "Product Designer", height: "5′9″", value: "Independent", review: "Required checks complete", about: "Creative and emotionally aware, exploring companionship again with humour, honest communication and shared responsibility.", tags: ["Design", "Cooking", "Community no bar"], photoClass: "photo-5" },
  { id: "priya", name: "Priya", age: 51, gender: "woman", city: "Chennai", intent: "committed", children: "yes", language: "tamil", role: "Doctor", height: "5′3″", value: "Established", review: "Required checks complete", about: "Compassionate and self-assured, hoping to share the years ahead through conversation, travel and respect for the lives and families both people have built.", tags: ["Spiritual", "Travel", "Healthcare"], photoClass: "photo-3" },
  { id: "vikram", name: "Vikram", age: 46, gender: "man", city: "Hyderabad", intent: "committed", children: "yes", language: "telugu", role: "Consultant", height: "5′11″", value: "Family-oriented", review: "Required checks complete", about: "Grounded and communicative, ready to build again with a kind partner who values health, close family bonds and financial independence.", tags: ["Consulting", "Fitness", "Non-smoker"], photoClass: "photo-6" },
];
