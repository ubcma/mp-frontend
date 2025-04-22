export type Role = "GUEST" | "MEMBER" | "EXECUTIVE" | "ADMIN";

export interface UserProfileData {
    name: string,
    email: string,
    major: string,
    yearLevel: string,
    role: string,
    avatarUrl: string,
    bio: string,
    linkedinUrl: string,
    coursesTaken: null,
    diet: string,
    specialization: string
  }