export interface CreateJobInput {
  title: string;
  companyName: string;
  companyLogo?: string;
  location: string;
  description: string;
  type: "full_time" | "part_time" | "contract" | "internship";
  applicationType: "external" | "email" | "instructions";
  applicationUrl?: string;
  applicationEmail?: string;
  applicationText?: string;
  isActive: boolean;
}

export interface UpdateJobInput extends CreateJobInput {
  id: string;
}

export interface DeleteJobInput {
  id: string;
}