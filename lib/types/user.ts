export type Role = "GUEST" | "BASIC" | "MEMBER" | "ADMIN";

export interface UserProfileData {
    name: string,
    email: string,
    role: string,
    bio: string,
    avatar: string,
    year: string,
    faculty: string,
    major: string,
    linkedinUrl: string,
    diet: string[],
    interests: string[],
    onboardingComplete?: boolean;
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
