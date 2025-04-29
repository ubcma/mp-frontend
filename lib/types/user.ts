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
    diet: string[],
    interests: string[]
    faculty: string
  }

export type UpdateMeInput = {
    year?: string;
    major?: string;
    faculty?: string;
    linkedinUrl?: string;
    interests?: string[];
    diet?: string[];
    avatar?: string;
    onboardingComplete?: boolean;
  };
