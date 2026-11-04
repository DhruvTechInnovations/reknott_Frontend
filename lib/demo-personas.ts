export type MemberPersona = {
  id: string;
  displayName: string;
  email?: string;
  age?: number;
  city?: string;
  profession?: string;
  bio?: string;
  initials: string;
  avatarCrop?: string;
};

export type DemoPersona = MemberPersona;
