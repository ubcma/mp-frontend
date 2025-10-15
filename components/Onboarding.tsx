'use client';

import { useState, useEffect, JSX } from 'react';
import { useForm, useStore, FieldApi, AnyFieldApi } from '@tanstack/react-form';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence, easeInOut, easeOut } from 'motion/react';
import {
  RenderComboBoxField,
  RenderInputField,
  RenderSelectField,
} from './forms/FormComponents';
import Spinner from './common/Spinner';
import {
  DIETARY_RESTRICTIONS,
  FACULTIES,
  Faculty,
  FacultyMajors,
  getMajorsForFaculty,
  INTEREST_OPTIONS,
  YEAR_OPTIONS,
} from '@/lib/constants';
import {
  GraduationCap,
  PartyPopper,
  Shapes,
  SmileIcon,
  UserRoundPen,
  Vegan,
  LucideIcon,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { fetchFromAPI } from '@/lib/httpHandlers';
import { useIsMobile } from '@/hooks/use-mobile';
import ProgressLineMobile from './ProgressLineMobile';

interface Step {
  title: string;
  description: string;
  icon: LucideIcon;
}

interface FormValues {
  year: string;
  major: string;
  faculty: string;
  linkedinUrl: string;
  avatar: string;
  interests: string[];
  diet: string[];
  onboardingComplete: boolean;
}

interface StepProps {
  isMobile: boolean;
  handleNext: () => void;
  handleBack: () => void;
  form: ReturnType<any>;
  values: FormValues;
  step: number;
  steps: Step[];
  router: ReturnType<typeof useRouter>;
  setStep: (step: number) => void;
  avatars: string[];
  selectedFaculty: Faculty;
  majors: string[];
}

const steps: Step[] = [
  {
    title: 'Welcome to UBCMA!',
    description: `Let's get to know you a little better.`,
    icon: SmileIcon,
  },
  {
    title: 'What do you study?',
    description: `Your personal profile and background.`,
    icon: GraduationCap,
  },
  {
    title: 'Choose an Avatar!',
    description: `Upload a photo of yourself!`,
    icon: UserRoundPen,
  },
  {
    title: 'Your dietary restrictions',
    description: `What food are you able to eat?`,
    icon: Vegan,
  },
  {
    title: 'What are your interests?',
    description: `Select 3 interests of yours! This will help us plan future events for you.`,
    icon: Shapes,
  },
  {
    title: "You're All Set!",
    description: 'Welcome to the MA portal.',
    icon: PartyPopper,
  },
];

const stepEmojiMap: Record<number, string> = {
  0: '👋',
  1: '🧑‍🎓',
  2: '📸',
  3: '🍔',
  4: '⚽️',
  5: '🎉',
} as const;

// Individual step components
const WelcomeStep: React.FC<
  Pick<StepProps, 'isMobile' | 'handleNext' | 'steps'>
> = ({ isMobile, handleNext, steps }) => {
  const router = useRouter();

  return (
    <div
      className={`w-full max-w-2xl text-center px-4 ${isMobile ? 'py-8' : 'py-16'}`}
    >
      <h1
        className={`font-bold text-white ${isMobile ? 'text-4xl mb-4' : 'text-8xl mb-8'}`}
      >
        {steps[0].title}
      </h1>
      <p className={`text-white ${isMobile ? 'text-sm mb-6' : 'text-lg mb-8'}`}>
        {steps[0].description}
      </p>
      <Button
        onClick={handleNext}
        className="bg-white text-[#EF3050] hover:bg-white/90"
      >
        Get Started
      </Button>

      {/* Skip Onboarding Button */}
      <motion.div
        className={`fixed z-50 ${
          isMobile
            ? 'bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2'
            : 'bottom-0 left-0 px-20 py-8'
        }`}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.4,
          scale: {
            type: 'spring',
            visualDuration: 0.4,
            bounce: 0.5,
            delay: 0.5,
          },
        }}
      >
        <Button
        variant="ghost"
          onClick={() => {
            localStorage.setItem("onboarding_skipped", "true");
            router.push('/home');
          }}
          className={`text-white hover:text-white hover:bg-transparent hover:opacity-80${
            isMobile ? 'text-sm' : 'text-lg'
          }`}
        >
          Skip Onboarding
        </Button>
      </motion.div>
    </div>
  );
};

const AcademicStep: React.FC<
  Pick<
    StepProps,
    | 'isMobile'
    | 'handleNext'
    | 'handleBack'
    | 'form'
    | 'values'
    | 'steps'
    | 'majors'
    | 'selectedFaculty'
  >
> = ({
  isMobile,
  handleNext,
  handleBack,
  form,
  values,
  steps,
  majors,
  selectedFaculty,
}) => (
  <div className={`w-full max-w-2xl px-4 ${isMobile ? 'py-8' : 'py-16'}`}>
    <h1
      className={`font-bold text-white text-center ${isMobile ? 'text-3xl mb-4' : 'text-6xl mb-8'}`}
    >
      {steps[1].title}
    </h1>
    <form
      onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
      }}
      className="space-y-6"
    >
      <div
        className={`flex gap-4 w-full ${isMobile ? 'flex-col' : 'flex-row'}`}
      >
        <div className={isMobile ? 'flex-1' : 'flex-[0_0_10%]'}>
          <form.Field
            name="year"
            validators={{
              onChange: ({ value }: { value: string }) =>
                !value ? 'Year is required.' : undefined,
            }}
            children={(field: AnyFieldApi) => (
              <RenderSelectField
                options={YEAR_OPTIONS}
                label="Year"
                field={field}
                placeholder=" "
                labelClassName="text-white"
              />
            )}
          />
        </div>
        <div className="flex-1">
          <form.Field
            name="faculty"
            validators={{
              onChange: ({ value }: { value: string }) =>
                !value ? 'Faculty is required.' : undefined,
            }}
            children={(field: AnyFieldApi) => (
              <RenderComboBoxField
                options={FACULTIES}
                label="Faculty"
                field={field}
                labelClassName="text-white"
              />
            )}
          />
        </div>
        <div className="flex-1">
          <form.Field
            name="major"
            validators={{
              onChange: ({ value }: { value: string }) =>
                !value ? 'Major is required.' : undefined,
            }}
            children={(field: AnyFieldApi) => {
              return (
                <RenderComboBoxField
                  options={majors}
                  label="Major"
                  field={field}
                  disabled={!selectedFaculty}
                  labelClassName="text-white"
                />
              );
            }}
          />
        </div>
      </div>
      <form.Field
        name="linkedinUrl"
        children={(field: AnyFieldApi) => (
          <RenderInputField
            label="LinkedIn URL"
            field={field}
            labelClassName="text-white"
          />
        )}
      />
    </form>

    <div className="flex justify-between pt-6">
      <Button
        type="button"
        onClick={handleBack}
        className="bg-white text-[#EF3050] hover:bg-white/90"
      >
        Go back
      </Button>
      <Button
        type="button"
        onClick={handleNext}
        className="bg-white text-[#EF3050] hover:bg-white/90"
        disabled={!values.year || !values.faculty || !values.major}
      >
        Next
      </Button>
    </div>
  </div>
);

const AvatarStep: React.FC<
  Pick<
    StepProps,
    | 'isMobile'
    | 'handleNext'
    | 'handleBack'
    | 'form'
    | 'values'
    | 'steps'
    | 'avatars'
  >
> = ({ isMobile, handleNext, handleBack, form, values, steps, avatars }) => (
  <div className={`w-fit max-w-2xl px-4 ${isMobile ? 'py-8' : 'py-16'}`}>
    <h1
      className={`font-bold text-white text-center ${isMobile ? 'text-3xl mb-4' : 'text-6xl mb-8'}`}
    >
      {steps[2].title}
    </h1>

    <div className="w-fit mx-auto">
      <form.Field
        name="avatar"
        children={(field: AnyFieldApi) => (
          <div className="w-fit gap-2 md:gap-8 grid grid-cols-3 grid-rows-2 place-items-center">
            {avatars.map((src, idx) => {
              const selected = field.state.value === src;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => field.handleChange(src)}
                  className={`relative w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 transition-all duration-200 ${
                    selected
                      ? 'border-blue-500 scale-110'
                      : 'border-transparent hover:scale-105'
                  }`}
                >
                  <Image
                    src={src}
                    alt={`Avatar ${idx + 1}`}
                    width={720}
                    height={720}
                    className="w-full h-full object-cover"
                  />
                  {selected && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center"></div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      />

      <div className="flex justify-between pt-6">
        <Button
          type="button"
          onClick={handleBack}
          className="bg-white text-[#EF3050] hover:bg-white/90"
        >
          Go back
        </Button>
        <Button
          type="button"
          onClick={handleNext}
          className="bg-white text-[#EF3050] hover:bg-white/90"
          disabled={!values.avatar}
        >
          Next
        </Button>
      </div>
    </div>
  </div>
);

const DietaryStep: React.FC<
  Pick<
    StepProps,
    'isMobile' | 'handleNext' | 'handleBack' | 'form' | 'values' | 'steps'
  >
> = ({ isMobile, handleNext, handleBack, form, values, steps }) => (
  <div className={`w-full max-w-2xl px-4 ${isMobile ? 'py-8' : 'py-16'}`}>
    <h1
      className={`font-bold text-white text-center ${isMobile ? 'text-3xl mb-4' : 'text-6xl mb-8'}`}
    >
      {steps[3].title}
    </h1>
    <form.Field
      name="diet"
      children={(field: AnyFieldApi) => {
        const handleAddAllergy = (e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            const value = (e.target as HTMLInputElement).value.trim();
            if (value && !field.state.value.includes(value)) {
              field.handleChange([...field.state.value, value]);
              (e.target as HTMLInputElement).value = '';
            }
          }
        };

        const handleRemoveAllergy = (allergy: string) => {
          const updated = field.state.value.filter(
            (i: string) => i !== allergy
          );
          field.handleChange(updated);
        };

        const handleRestrictionClick = (restriction: string) => {
          const isSelected = field.state.value.includes(restriction);
          const newRestrictions = isSelected
            ? field.state.value.filter((i: string) => i !== restriction)
            : [...field.state.value, restriction];
          field.handleChange(newRestrictions);
        };

        return (
          <div className="space-y-4">
            <div className="flex flex-col items-center space-y-3">
              {/* Row 1 - 3 items */}
              <div className="flex justify-center gap-3">
                {DIETARY_RESTRICTIONS.slice(0, 3).map((restriction) => {
                  const isSelected = field.state.value.includes(restriction);
                  return (
                    <motion.div
                      key={restriction}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.1 }}
                      className={`cursor-pointer rounded-lg py-2 text-center font-normal transition-all duration-200 flex items-center justify-center ${
                        isMobile
                          ? 'px-2 text-xs w-28 h-9'
                          : 'px-4 text-sm w-40 h-11'
                      } ${
                        isSelected
                          ? 'bg-white text-black shadow-md'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                      onClick={() => handleRestrictionClick(restriction)}
                    >
                      {restriction}
                    </motion.div>
                  );
                })}
              </div>

              {/* Rows 2-4 */}
              {[
                DIETARY_RESTRICTIONS.slice(3, 6),
                DIETARY_RESTRICTIONS.slice(6, 9),
                DIETARY_RESTRICTIONS.slice(9, 11),
              ].map((rowRestrictions, rowIndex) => (
                <div key={rowIndex} className="flex justify-center gap-3">
                  {rowRestrictions.map((restriction) => {
                    const isSelected = field.state.value.includes(restriction);
                    return (
                      <motion.div
                        key={restriction}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className={`cursor-pointer rounded-lg py-2 text-center font-normal transition-all duration-200 flex items-center justify-center ${
                          isMobile
                            ? 'px-2 text-xs w-28 h-9'
                            : 'px-4 text-sm w-40 h-11'
                        } ${
                          isSelected
                            ? 'bg-white text-black shadow-md'
                            : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
                        onClick={() => handleRestrictionClick(restriction)}
                      >
                        {restriction}
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Dynamic allergy input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white">
                Other Allergies
              </label>
              <input
                type="text"
                onKeyDown={handleAddAllergy}
                placeholder="Type and press Enter..."
                className="border rounded-md px-3 py-2 w-full h-9 bg-white text-black placeholder-gray-400"
              />
              {/* Show all selected allergies */}
              <div className="flex flex-wrap gap-2 mt-2">
                {field.state.value
                  .filter(
                    (item: string) => !DIETARY_RESTRICTIONS.includes(item)
                  )
                  .map((allergy: string) => (
                    <div
                      key={allergy}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded-full text-sm"
                    >
                      {allergy}
                      <button
                        type="button"
                        onClick={() => handleRemoveAllergy(allergy)}
                        className="text-red-500 ml-1"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        );
      }}
    />

    <div className="flex justify-between pt-6">
      <Button
        type="button"
        onClick={handleBack}
        className="bg-white text-[#EF3050] hover:bg-white/90"
      >
        Go back
      </Button>
      <form.Subscribe
        selector={(state: { values: { diet: any } }) => [state.values.diet]}
        children={([diet]: [string[]]) => {
          const hasDietarySelection = diet && diet.length > 0;
          return (
            <Button
              type="button"
              onClick={handleNext}
              disabled={!hasDietarySelection}
              className={`bg-white text-[#EF3050] hover:bg-white/90 ${
                !hasDietarySelection ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Next
            </Button>
          );
        }}
      />
    </div>
  </div>
);

const InterestsStep: React.FC<
  Pick<
    StepProps,
    | 'isMobile'
    | 'handleNext'
    | 'handleBack'
    | 'form'
    | 'values'
    | 'steps'
    | 'setStep'
  >
> = ({ isMobile, handleNext, handleBack, form, values, steps, setStep }) => (
  <div className={`w-full max-w-2xl px-4 ${isMobile ? 'py-8' : 'py-16'}`}>
    <h1
      className={`font-bold text-white text-center ${isMobile ? 'text-3xl mb-4' : 'text-6xl mb-8'}`}
    >
      {steps[4].title}
    </h1>
    <div className="space-y-6">
      <form.Field
        name="interests"
        children={(field: AnyFieldApi) => (
          <div
            className={`grid gap-3 ${isMobile ? 'grid-cols-2 grid-rows-4' : 'grid-cols-2'}`}
          >
            {INTEREST_OPTIONS.map((interest) => {
              const isSelected = field.state.value.includes(interest);
              return (
                <motion.div
                  key={interest}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.1 }}
                  className={`cursor-pointer rounded-lg text-center font-normal transition-all duration-200 ${
                    isMobile ? 'p-3 text-xs' : 'p-4 text-sm'
                  } ${
                    isSelected
                      ? 'bg-white text-black shadow-md'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                  onClick={() => {
                    const newInterests = isSelected
                      ? field.state.value.filter((i: string) => i !== interest)
                      : [...field.state.value, interest];
                    field.handleChange(newInterests);
                  }}
                >
                  {interest}
                </motion.div>
              );
            })}
          </div>
        )}
      />
      <div className="flex justify-between mt-8">
        <Button
          type="button"
          onClick={handleBack}
          className="bg-white text-[#EF3050] hover:bg-white/90"
        >
          Go back
        </Button>
        <form.Subscribe
          selector={(state: {
            canSubmit: any;
            isSubmitting: any;
            values: { interests: any };
          }) => [state.canSubmit, state.isSubmitting, state.values.interests]}
          children={([canSubmit, isSubmitting, interests]: [
            boolean,
            boolean,
            string[],
          ]) => {
            const hasThreeInterests =
              Array.isArray(interests) && interests.length >= 3;

            return (
              <Button
                className={`cursor-pointer font-regular ${
                  hasThreeInterests ? 'bg-ma-red' : 'bg-ma-red opacity-50'
                }`}
                variant="ma"
                type="button"
                disabled={!hasThreeInterests}
                onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();

                  // Check required fields before submission
                  const formValues = form.store.state.values;
                  if (
                    !formValues.year ||
                    !formValues.faculty ||
                    !formValues.major
                  ) {
                    // Trigger validation on all fields to show error messages
                    form.validateAllFields('submit');
                    // Navigate back to step 1 where required fields are
                    setStep(1);
                    return;
                  }

                  // If all required fields are filled, submit the form
                  await form.handleSubmit();
                }}
              >
                {isSubmitting ? (
                  <>
                    <Spinner />
                    <div>Loading</div>
                  </>
                ) : (
                  <div>
                    {hasThreeInterests
                      ? 'Complete Profile'
                      : 'Choose 3 Interests'}
                  </div>
                )}
              </Button>
            );
          }}
        />
      </div>
    </div>
  </div>
);

const CompletionStep: React.FC<Pick<StepProps, 'isMobile' | 'steps'>> = ({
  isMobile,
  steps,
}) => (
  <div
    className={`w-full max-w-2xl text-center px-4 ${isMobile ? 'space-y-4 py-8' : 'space-y-6 py-16'}`}
  >
    <h1
      className={`font-bold text-white ${isMobile ? 'text-3xl mb-4' : 'text-6xl mb-8'}`}
    >
      {steps[5].title}
    </h1>
    <p className={`text-white ${isMobile ? 'text-sm' : 'text-lg'}`}>
      {steps[5].description}
    </p>
    <Button
      onClick={() => {
        sessionStorage.removeItem('onboarding_skipped');
        window.location.href = '/home';
      }}
      className="bg-white text-[#EF3050] hover:bg-white/90"
    >
      Go to Home
    </Button>
  </div>
);

export default function OnboardingModal(): JSX.Element {
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [step, setStep] = useState<number>(0);
  const [isClient, setIsClient] = useState<boolean>(false);
  const router = useRouter();
  const isMobile = useIsMobile();

  const { width, height } = useWindowSize();

  // Prevent hydration mismatch by waiting for client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (step === steps.length - 1) {
      setShowConfetti(true);
    }
  }, [step]);

  type Direction = 'forward' | 'backward';

  const [direction, setDirection] = useState<Direction>('forward');

  const handleNext = (): void => {
    if (step < steps.length - 1) {
      setDirection('forward');
      setStep((step) => step + 1);
    }
  };

  const handleBack = (): void => {
    if (step > 0) {
      setDirection('backward');
      setStep((step) => step - 1);
    }
  };

  const motionVariants = {
    enter: (direction: Direction) => ({
      opacity: 0,
      x: isMobile ? (direction === 'forward' ? 100 : -100) : 0,
      y: isMobile ? 0 : direction === 'forward' ? 100 : -100,
      scale: 0.8,
    }),
    center: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: easeOut,
        opacity: { duration: 0.2 },
        scale: { type: 'spring', duration: 0.3, bounce: 0.3 },
      },
    },
    exit: (direction: Direction) => ({
      opacity: 0,
      x: isMobile ? (direction === 'forward' ? -100 : 100) : 0,
      y: isMobile ? 0 : direction === 'forward' ? -100 : 100,
      scale: 0.8,
    }),
  };

  const form = useForm({
    defaultValues: {
      year: '',
      major: '',
      faculty: '',
      linkedinUrl: '',
      avatar: '',
      interests: [] as string[],
      diet: [] as string[],
      onboardingComplete: true,
    },
    onSubmit: async ({ value }) => {
      try {
        await fetchFromAPI('/api/me/', {
          method: 'POST',
          body: value,
        });
        setStep(5);
        document.cookie =
          'onboardingComplete=true; Path=/; Max-Age=0; SameSite=Lax';
      } catch (error) {
        console.error('Failed to submit onboarding form data:', error);
      }
    },
  });

  const avatars: string[] = [
    'https://3ou0u5266t.ufs.sh/f/icFgxUjDNp9SHfSpARavrBaOy879hQLYlq2tTDxSFN56uAVk',
    'https://3ou0u5266t.ufs.sh/f/icFgxUjDNp9SWuHx1AIQ5Jxnu8htDbYe6BEljCiZRS1HX90r',
    'https://3ou0u5266t.ufs.sh/f/icFgxUjDNp9STlSXPGKtWjXZ5CV1loKvErcSBGzukR43NPpY',
    'https://3ou0u5266t.ufs.sh/f/icFgxUjDNp9SYLGttR8WgoQTZvmMRLxUD3d2ja49SHG8IXPn',
    'https://3ou0u5266t.ufs.sh/f/icFgxUjDNp9S4ckwUOew3HDuqnmEMpvOCSxlzFiXboeg842Z',
    'https://3ou0u5266t.ufs.sh/f/icFgxUjDNp9St4uv7XDdOFLQW0GzgHKq8hCcUxNP5wuAVjiR',
  ];

  const selectedFaculty = useStore(
    form.store,
    (state) => state.values.faculty
  ) as Faculty;
  const majors = selectedFaculty ? getMajorsForFaculty(selectedFaculty) : [];
  const values = useStore(form.store, (state) => state.values);

  // Show loading screen until client-side rendering is complete
  if (!isClient) {
    return (
      <div
        className="h-screen overflow-hidden fixed inset-0 flex items-center justify-center"
        style={{
          background: 'linear-gradient(to bottom, #EF3050, #FF8096)',
        }}
      ></div>
    );
  }

  const renderCurrentStep = (): JSX.Element => {
    const stepProps: StepProps = {
      isMobile,
      handleNext,
      handleBack,
      form,
      values,
      step,
      steps,
      router,
      setStep,
      avatars,
      selectedFaculty,
      majors,
    };

    switch (step) {
      case 0:
        return <WelcomeStep {...stepProps} />;
      case 1:
        return <AcademicStep {...stepProps} />;
      case 2:
        return <AvatarStep {...stepProps} />;
      case 3:
        return <DietaryStep {...stepProps} />;
      case 4:
        return <InterestsStep {...stepProps} />;
      case 5:
        return <CompletionStep {...stepProps} />;
      default:
        return <WelcomeStep {...stepProps} />;
    }
  };

  return (
    <div
      className="h-screen overflow-hidden fixed inset-0"
      style={{
        background: 'linear-gradient(to bottom, #EF3050, #FF8096)',
      }}
    >
      {showConfetti && (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={600}
            gravity={1}
            initialVelocityY={15}
          />
        </div>
      )}

      {/* Header - Logo and Stepper */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 flex ${
          isMobile ? 'justify-center' : 'justify-between'
        } items-center px-20 py-8 bg-gradient-to-b from-[#EF3050] to-transparent`}
      >
        {/* Logo */}
        <motion.div
          className="flex items-center"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            scale: {
              type: 'spring',
              visualDuration: 0.4,
              bounce: 0.5,
              delay: 0.3,
            },
          }}
        >
          <Image
            priority
            src="/logos/logo_white.svg"
            alt="UBCMA Logo"
            width={100}
            height={100}
            className="text-white"
          />
        </motion.div>

        {/* Circular Stepper - Hidden on mobile */}
        {step > 0 && step < steps.length - 1 && !isMobile && (
          <div className="flex items-center space-x-4">
            {steps.slice(1, -1).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full border-1 border-white/50 ${
                  index + 1 <= step ? 'bg-white/50' : 'bg-transparent'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Main Content Container */}
      <div className="h-full flex flex-row items-center justify-center">
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div
            key={step}
            className="w-full h-full flex items-center justify-center"
            custom={direction}
            variants={motionVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {renderCurrentStep()}
          </motion.div>
        </AnimatePresence>

        {/* Desktop Progress Line */}
        {!isMobile && (
          <div className="flex min-w-40 h-full items-center justify-center relative overflow-hidden mx-16">
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 w-px bg-white"
              animate={{
                top: step === 0 ? '50%' : '0%',
                bottom: step === 5 ? '50%' : '0%',
                height: step === 0 ? '50%' : step === 5 ? '50%' : '100%',
              }}
              transition={{
                duration: 0.6,
                ease: 'easeInOut',
              }}
            />
            <div className="absolute w-full h-full">
              {steps.map((_, index) => {
                // Calculate relative position from current step
                const relativePosition = index - step;

                let topPercentage = 50;
                let circleSize = 100;
                let isVisible = false;

                // Show 3 circles: previous, current, and next
                if (relativePosition === -1) {
                  topPercentage = 20;
                  circleSize = 100;
                  isVisible = true;
                } else if (relativePosition === 0) {
                  topPercentage = 50;
                  circleSize = 150;
                  isVisible = true;
                } else if (relativePosition === 1) {
                  topPercentage = 80;
                  circleSize = 100;
                  isVisible = true;
                } else if (relativePosition < -1) {
                  const offsetSteps = Math.abs(relativePosition) - 1;
                  topPercentage = 20 - offsetSteps * 30;
                  circleSize = 100;
                  isVisible = topPercentage >= -10;
                } else if (relativePosition > 1) {
                  const offsetSteps = relativePosition - 1;
                  topPercentage = 80 + offsetSteps * 30;
                  circleSize = 100;
                  isVisible = topPercentage <= 110;
                }

                return (
                  <motion.div
                    key={index}
                    className={`absolute left-1/2 rounded-full bg-[#F65772] border-2 border-white flex items-center justify-center ${
                      relativePosition === -1
                        ? 'cursor-pointer hover:bg-[#E02040] transition-colors duration-200'
                        : ''
                    }`}
                    onClick={relativePosition === -1 ? handleBack : undefined}
                    initial={{
                      top: `${topPercentage}%`,
                      translateX: '-50%',
                      translateY: '-50%',
                      width: `${circleSize}px`,
                      height: `${circleSize}px`,
                      opacity: isVisible ? 1 : 0,
                      scale: 0,
                    }}
                    animate={{
                      top: `${topPercentage}%`,
                      translateX: '-50%',
                      translateY: '-50%',
                      width: `${circleSize}px`,
                      height: `${circleSize}px`,
                      opacity: isVisible ? 1 : 0,
                      scale: isVisible ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.4,
                      opacity: { duration: 0.3 },
                      scale: {
                        type: 'spring',
                        visualDuration: 0.4,
                        bounce: 0.3,
                      },
                      top: {
                        duration: 0.6,
                        ease: 'easeInOut',
                      },
                      width: {
                        duration: 0.6,
                        ease: 'easeInOut',
                      },
                      height: {
                        duration: 0.6,
                        ease: 'easeInOut',
                      },
                    }}
                  >
                    <motion.span
                      animate={{
                        fontSize: `${circleSize * 0.4}px`,
                      }}
                      transition={{
                        duration: 0.6,
                        ease: 'easeInOut',
                      }}
                      style={{
                        lineHeight: 1,
                      }}
                    >
                      {stepEmojiMap[index as keyof typeof stepEmojiMap]}
                    </motion.span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
