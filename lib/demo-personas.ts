export type DemoPersona = {
  id: "ananya" | "rahul";
  displayName: string;
  email: string;
  age: number;
  city: string;
  profession: string;
  bio: string;
  initials: string;
};

export const demoPersonas: readonly DemoPersona[] = [
  {
    id: "ananya",
    displayName: "Ananya Rao",
    email: "ananya@reknott.demo",
    age: 36,
    city: "Hyderabad",
    profession: "Architect",
    bio: "Warm, independent and ready to build a calm partnership shaped by communication and shared family values.",
    initials: "AR",
  },
  {
    id: "rahul",
    displayName: "Rahul Varma",
    email: "rahul@reknott.demo",
    age: 41,
    city: "Bengaluru",
    profession: "Entrepreneur",
    bio: "Grounded and reflective, hoping to share everyday life with someone who values honesty, warmth and family bonds.",
    initials: "RV",
  },
] as const;

export function getDemoPersona(id: string): DemoPersona | undefined {
  return demoPersonas.find((persona) => persona.id === id);
}
