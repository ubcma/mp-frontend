import { AlertBanner } from '@/components/AlertBanner';

type PromptsProps = {
  showOnboardingPrompt: boolean;
  showMembershipPrompt: boolean;
};

export function Prompts({
  showOnboardingPrompt,
  showMembershipPrompt,
}: PromptsProps) {
  if (!showOnboardingPrompt && !showMembershipPrompt) return null;

  return (
    <div className="flex flex-col gap-4 mb-8">
      {showOnboardingPrompt && (
        <AlertBanner color="yellow">
          <div>
            Looks like you haven&apos;t finished setting up your profile!{' '}
            <a
              href="/onboarding"
              className="underline underline-offset-2 font-semibold hover:opacity-80 transition"
            >
              Complete your onboarding
            </a>{' '}
            so we can personalize your experience. ✨
          </div>
        </AlertBanner>
      )}

      {showMembershipPrompt && (
        <AlertBanner color="blue">
          <div>
            Looks like you&apos;re not a member yet!{' '}
            <a
              href="/purchase-membership"
              className="underline underline-offset-2 font-semibold hover:opacity-80 transition"
            >
              Purchase a membership
            </a>{' '}
            to gain access to all features! 🚀
          </div>
        </AlertBanner>
      )}
    </div>
  );
}
