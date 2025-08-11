export type ValidateEmailResponse = {
    hasAccount: boolean;
    email?: string;
    provider?: 'google' | 'credential';
}