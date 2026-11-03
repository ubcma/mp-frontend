import { AlertBanner } from '@/components/AlertBanner';
import Link from 'next/link';

type PromptsProps = {
  showOnboardingPrompt: boolean;
  showMembershipPrompt: boolean;
  showGatewaysPrompt: boolean;
};

export function Prompts({
  showOnboardingPrompt,
  showMembershipPrompt,
  showGatewaysPrompt,
}: PromptsProps) {
  if (!showOnboardingPrompt && !showMembershipPrompt && !showGatewaysPrompt)
    return null;

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

      {showGatewaysPrompt && (
        <AlertBanner color="green">
          <div>
            Purchase a Gateways ticket as a non-member and get a MA Membership
            included at no extra cost! This is a one-time bundle offer, so
            don&apos;t miss out.{' '}
            <Link
              href="/events"
              className="underline underline-offset-2 font-semibold hover:opacity-80 transition"
            >
              Grab your ticket now!
            </Link>
          </div>
        </AlertBanner>
      )}
    </div>
  );
}
