'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm, useStore } from '@tanstack/react-form';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import {
  RenderComboBoxField,
  RenderInputField,
  RenderSelectField,
} from './forms/FormComponents';
import Spinner from './Spinner';
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
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const steps = [
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
    title: 'Take a selfie!',
    description: `Upload a photo of yourself!`,
    icon: UserRoundPen,
  },
  {
    title: 'Eat to live, or live to eat?',
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

const stepEmojiMap = {
  0: '👋',
  1: '🧑‍🎓',
  2: '📸',
  3: '🍔',
  4: '⚽️',
  5: '🎉', 
} as const;

export default function OnboardingModal() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [step, setStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { width, height } = useWindowSize();

  useEffect(() => {
    if (step === steps.length - 1) {
      setShowConfetti(true);
    }
  }, [step]);

  // Auto-transition from step 0 to step 1 after 2 seconds
  useEffect(() => {
    if (step === 0) {
      const timer = setTimeout(() => {
        handleNext();
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [step]);

  // scroll to specific step
  const scrollToStep = (stepIndex: number) => {
    if (containerRef.current) {
      const stepElement = containerRef.current.children[stepIndex] as HTMLElement;
      if (stepElement) {
        stepElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  };

  // Handle navigation
  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      scrollToStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      scrollToStep(step - 1);
    }
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
      // Submit the form data to the API
      await fetch('/api/me/', {
        method: 'POST',
        body: JSON.stringify(value),
      });
      setStep(5);
      scrollToStep(5);
    },
  });

  const selectedFaculty = useStore(
    form.store,
    (state) => state.values.faculty
  ) as Faculty;
  const majors = selectedFaculty ? getMajorsForFaculty(selectedFaculty) : [];

  return (
    <div 
      className="h-screen overflow-hidden fixed inset-0"
      style={{
        background: 'linear-gradient(to bottom, #EF3050, #FF8096)'
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
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-20 py-8 bg-gradient-to-b from-[#EF3050] to-transparent">
        {/* Logo */}
        <motion.div className="flex items-center"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
              duration: 0.4,
              scale: { type: "spring", visualDuration: 0.4, bounce: 0.5, delay: 0.3},
          }}
        >
          <Image
            src="/logos/logo_white_icon.svg"
            alt="UBCMA Logo"
            width={100}
            height={100}
            className="text-white"
          />
        </motion.div>

        {/* Circular Stepper */}
        {step > 0 && step < steps.length - 1 && (
          <div className="flex items-center space-x-4">
            {steps.slice(1, -1).map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full border-1 border-white/50 ${
                  index + 1 <= step 
                    ? 'bg-white/50' 
                    : 'bg-transparent'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Skip Onboarding Button */}
      {step < steps.length - 1 && (
        <motion.div className="fixed bottom-0 left-0 z-50 px-20 py-8 bg-gradient-to-t from-[#FF8096] to-transparent"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
              duration: 0.4,
              scale: { type: "spring", visualDuration: 0.4, bounce: 0.5, delay: 0.5},
          }}>
          <Button
            variant="ghost"
            onClick={() => {
              document.cookie = "onboarding_skipped=true; path=/; max-age=86400";
              router.push('/home')
            }}
            className="text-white hover:text-white hover:bg-white/10"
          >
            Skip Onboarding
          </Button>
        </motion.div>
      )}

      {/* Scrollable Content Container */}
      <div className="h-full flex items-center justify-center gap-20">
        
      <div 
        ref={containerRef}
        className="h-full w-auto max-w-2xl overflow-hidden scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Step 0 - Welcome */}
        <motion.section
           initial={{ opacity: 0, scale: 0 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{
               duration: 0.4,
               scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
           }}
          className="h-screen flex flex-col justify-center items-center px-4 pt-32 pb-32"
        >
          <div className="w-full max-w-2xl text-center">
            <h1 className="text-8xl font-bold text-white mb-8">{steps[0].title}</h1>
            <p className="text-white text-lg">{steps[0].description}</p>
          </div>
        </motion.section>

        {/* Step 1 - Academic Info */}
        <motion.section
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{
              duration: 0.4,
              scale: { type: "spring", visualDuration: 0.4, bounce: 0.3 },
          }}
          className="h-screen flex flex-col justify-center items-center px-4 pt-32 pb-32"
        >
          <div className="w-full max-w-2xl">
            <h1 className="text-6xl font-bold text-white mb-8 text-center">{steps[1].title}</h1>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              className="space-y-6"
            >
              <div className="flex gap-4 w-full">
                <div className="flex-[0_0_10%]">
                  <form.Field
                    name="year"
                    validators={{
                      onChange: ({ value }) =>
                        !value ? 'Year is required.' : undefined,
                    }}
                    children={(field) => (
                      <RenderSelectField
                        options={YEAR_OPTIONS}
                        label="Year"
                        field={field}
                        placeholder=" "
                      />
                    )}
                  />
                </div>
                <div className="flex-1">
                  <form.Field
                    name="faculty"
                    validators={{
                      onChange: ({ value }) =>
                        !value ? 'Faculty is required.' : undefined,
                    }}
                    children={(field) => (
                      <RenderComboBoxField
                        options={FACULTIES}
                        label="Faculty"
                        field={field}
                      />
                    )}
                  />
                </div>
                <div className="flex-1">
                  <form.Field
                    name="major"
                    validators={{
                      onChange: ({ value }) =>
                        !value ? 'Major is required.' : undefined,
                    }}
                    children={(field) => {
                      return (
                        <RenderComboBoxField
                          options={majors}
                          label="Major"
                          field={field}
                          disabled={!selectedFaculty}
                        />
                      );
                    }}
                  />
                </div>
              </div>
              <form.Field
                name="linkedinUrl"
                children={(field) => (
                  <RenderInputField label="LinkedIn URL" field={field} />
                )}
              />
            </form>
            
            {/* Navigation buttons for step 1 */}
            <div className="flex justify-end pt-6">
              <Button 
                type="button" 
                onClick={handleNext}
                className="bg-white text-[#EF3050] hover:bg-white/90"
              >
                Next
              </Button>
            </div>
          </div>
        </motion.section>

        {/* Step 2 - Photo Upload */}
        <motion.section
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{
              duration: 0.4,
              scale: { type: "spring", visualDuration: 0.4, bounce: 0.3 },
          }}
          className="h-screen flex flex-col justify-center items-center px-4 pt-32 pb-32"
        >
          <div className="w-full max-w-2xl">
            <h1 className="text-6xl font-bold text-white mb-8 text-center">{steps[2].title}</h1>
            <form.Field
              name="avatar"
              children={(field) => (
                <RenderInputField
                  type="file"
                  label="Upload a Profile Picture!"
                  field={field}
                />
              )}
            />
            
            {/* Navigation buttons for step 2 */}
            <div className="flex justify-end pt-6">
              <Button 
                type="button" 
                onClick={handleNext}
                className="bg-white text-[#EF3050] hover:bg-white/90"
              >
                Next
              </Button>
            </div>
          </div>
        </motion.section>

        {/* Step 3 - Dietary Restrictions */}
        <motion.section
         initial={{ opacity: 0, scale: 0 }}
         whileInView={{ opacity: 1, scale: 1 }}
         transition={{
             duration: 0.4,
             scale: { type: "spring", visualDuration: 0.4, bounce: 0.3 },
         }}
          className="h-screen flex flex-col justify-center items-center px-4 pt-32 pb-32"
        >
          <div className="w-full max-w-2xl">
            <h1 className="text-6xl font-bold text-white mb-8 text-center">{steps[3].title}</h1>
            <form.Field
              name="diet"
              children={(field) => {
                const handleAddAllergy = (
                  e: React.KeyboardEvent<HTMLInputElement>
                ) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const value = (
                      e.target as HTMLInputElement
                    ).value.trim();
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
                              className={`
                                cursor-pointer rounded-lg px-4 py-2 text-center font-normal text-sm transition-all duration-200 w-40 h-11 flex items-center justify-center
                                ${isSelected 
                                  ? 'bg-white text-black shadow-md' 
                                  : 'bg-white/20 text-white hover:bg-white/30'
                                }
                              `}
                              onClick={() => {
                                const newRestrictions = isSelected
                                  ? field.state.value.filter((i: string) => i !== restriction)
                                  : [...field.state.value, restriction];
                                field.handleChange(newRestrictions);
                              }}
                            >
                              {restriction}
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Row 2 - 2 items */}
                      <div className="flex justify-center gap-3">
                        {DIETARY_RESTRICTIONS.slice(3, 5).map((restriction) => {
                          const isSelected = field.state.value.includes(restriction);
                          return (
                            <motion.div
                              key={restriction}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              transition={{ duration: 0.1 }}
                              className={`
                                cursor-pointer rounded-lg px-4 py-2 text-center font-normal text-sm transition-all duration-200 w-40 h-11 flex items-center justify-center
                                ${isSelected 
                                  ? 'bg-white text-black shadow-md' 
                                  : 'bg-white/20 text-white hover:bg-white/30'
                                }
                              `}
                              onClick={() => {
                                const newRestrictions = isSelected
                                  ? field.state.value.filter((i: string) => i !== restriction)
                                  : [...field.state.value, restriction];
                                field.handleChange(newRestrictions);
                              }}
                            >
                              {restriction}
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Row 3 - 3 items */}
                      <div className="flex justify-center gap-3">
                        {DIETARY_RESTRICTIONS.slice(5, 8).map((restriction) => {
                          const isSelected = field.state.value.includes(restriction);
                          return (
                            <motion.div
                              key={restriction}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              transition={{ duration: 0.1 }}
                              className={`
                                cursor-pointer rounded-lg px-4 py-2 text-center font-normal text-sm transition-all duration-200 w-40 h-11 flex items-center justify-center
                                ${isSelected 
                                  ? 'bg-white text-black shadow-md' 
                                  : 'bg-white/20 text-white hover:bg-white/30'
                                }
                              `}
                              onClick={() => {
                                const newRestrictions = isSelected
                                  ? field.state.value.filter((i: string) => i !== restriction)
                                  : [...field.state.value, restriction];
                                field.handleChange(newRestrictions);
                              }}
                            >
                              {restriction}
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Row 4 - 2 items */}
                      <div className="flex justify-center gap-3">
                        {DIETARY_RESTRICTIONS.slice(8, 10).map((restriction) => {
                          const isSelected = field.state.value.includes(restriction);
                          return (
                            <motion.div
                              key={restriction}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              transition={{ duration: 0.1 }}
                              className={`
                                cursor-pointer rounded-lg px-4 py-2 text-center font-normal text-sm transition-all duration-200 w-40 h-11 flex items-center justify-center
                                ${isSelected 
                                  ? 'bg-white text-black shadow-md' 
                                  : 'bg-white/20 text-white hover:bg-white/30'
                                }
                              `}
                              onClick={() => {
                                const newRestrictions = isSelected
                                  ? field.state.value.filter((i: string) => i !== restriction)
                                  : [...field.state.value, restriction];
                                field.handleChange(newRestrictions);
                              }}
                            >
                              {restriction}
                            </motion.div>
                          );
                        })}
                      </div>
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
                            (item: string) =>
                              !DIETARY_RESTRICTIONS.includes(item)
                          )
                          .map((allergy: string) => (
                            <div
                              key={allergy}
                              className="flex items-center gap-1 px-3 py-1 bg-gray-200 rounded-full text-sm"
                            >
                              {allergy}
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveAllergy(allergy)
                                }
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
            
            {/* Navigation buttons for step 3 */}
            <form.Subscribe
              selector={(state) => [state.values.diet]}
              children={([diet]) => {
                const hasDietarySelection = diet && diet.length > 0;
                
                return (
                  <div className="flex justify-end pt-6">
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
                  </div>
                );
              }}
            />
          </div>
        </motion.section>

        {/* Step 4 - Interests */}
        <motion.section
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{
              duration: 0.4,
              scale: { type: "spring", visualDuration: 0.4, bounce: 0.3 },
          }}
          className="h-screen flex flex-col justify-center items-center px-4 pt-32 pb-32"
        >
          <div className="w-full max-w-2xl">
            <h1 className="text-6xl font-bold text-white mb-8 text-center">{steps[4].title}</h1>
            <div className="space-y-6">
              <form.Field
                name="interests"
                children={(field) => (
                  <div className="grid grid-cols-2 gap-3">
                    {INTEREST_OPTIONS.map((interest) => {
                      const isSelected = field.state.value.includes(interest);
                      return (
                        <motion.div
                          key={interest}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.1 }}
                          className={`
                            cursor-pointer rounded-lg p-4 text-center font-normal text-sm transition-all duration-200
                            ${isSelected 
                              ? 'bg-white text-black shadow-md' 
                              : 'bg-white/20 text-white hover:bg-white/30'
                            }
                          `}
                          onClick={() => {
                            const newInterests = isSelected
                              ? field.state.value.filter((i) => i !== interest)
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
              <form.Subscribe
                selector={(state) => [
                  state.canSubmit,
                  state.isSubmitting,
                  state.values.interests,
                ]}
                children={([canSubmit, isSubmitting, interests]) => {
                  const hasThreeInterests = Array.isArray(interests) && interests.length >= 3;
                  
                  return (
                    <div className="flex justify-end pt-6">
                      <Button
                        className={`cursor-pointer font-regular ${
                          hasThreeInterests ? 'bg-ma-red' : 'bg-ma-red opacity-50'
                        }`}
                        variant="ma"
                        type="button"
                        disabled={!hasThreeInterests}
                        onClick={async (e) => {
                          e.preventDefault();
                          
                          // Check required fields before submission
                          const formValues = form.store.state.values;
                          if (!formValues.year || !formValues.faculty || !formValues.major) {
                            // Trigger validation on all fields to show error messages
                            form.validateAllFields('submit');
                            
                            // Navigate back to step 1 where required fields are
                            setStep(1);
                            scrollToStep(1);
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
                          <div>{hasThreeInterests ? 'Complete Profile' : 'Choose 3 Interests'}</div>
                        )}
                      </Button>
                    </div>
                  );
                }}
              />
            </div>
          </div>
        </motion.section>

        {/* Step 5 - Completion */}
        <motion.section
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{
              duration: 0.4,
              scale: { type: "spring", visualDuration: 0.4, bounce: 0.3 },
          }}
          className="h-screen flex flex-col justify-center items-center px-4 pt-32 pb-32"
        >
          <div className="w-full max-w-2xl text-center space-y-6">
            <h1 className="text-6xl font-bold text-white mb-8">{steps[5].title}</h1>
            <p className="text-white text-lg">{steps[5].description}</p>
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
        </motion.section>
      </div>
      {/* Progress Line */}
      <div className="flex w-40 h-full items-center justify-center relative overflow-hidden">
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 w-px bg-white"
          animate={{
            top: step === 0 ? '50%' : '0%',
            bottom: step === 5 ? '50%' : '0%',
            height: step === 0 ? '50%' : step === 5 ? '50%' : '100%'
          }}
          transition={{
            duration: 0.6,
            ease: "easeInOut",
          }}
        />
        <div className="absolute w-full h-full">
          {steps.map((_, index) => {
            // Calculate relative position from current step
            const relativePosition = index - step;
            
            let topPercentage = 50; // Default center
            let circleSize = 100;
            let isVisible = false;
            
            // Show 3 circles: previous, current, and next
            if (relativePosition === -1) {
              // Previous step - top of screen
              topPercentage = 20;
              circleSize = 100;
              isVisible = true;
            } else if (relativePosition === 0) {
              // Current step - center of screen, larger size
              topPercentage = 50;
              circleSize = 150;
              isVisible = true;
            } else if (relativePosition === 1) {
              // Next step - bottom of screen
              topPercentage = 80;
              circleSize = 100;
              isVisible = true;
            } else if (relativePosition < -1) {
              // Steps that are further back - move progressively upward off screen
              const offsetSteps = Math.abs(relativePosition) - 1;
              topPercentage = 20 - (offsetSteps * 30); // Move 30% up for each additional step back
              circleSize = 100;
              isVisible = topPercentage >= -10; // Fade out when too far up
            } else if (relativePosition > 1) {
              // Steps that are further ahead - move progressively downward off screen
              const offsetSteps = relativePosition - 1;
              topPercentage = 80 + (offsetSteps * 30); // Move 30% down for each additional step ahead
              circleSize = 100;
              isVisible = topPercentage <= 110; // Fade out when too far down
            }
            
            return (
              <motion.div
                key={index}
                className={`absolute left-1/2 rounded-full bg-[#F65772] border-2 border-white flex items-center justify-center ${
                  relativePosition === -1 ? 'cursor-pointer hover:bg-[#E02040] transition-colors duration-200' : ''
                }`}
                onClick={relativePosition === -1 ? handleBack : undefined}
                initial={{ 
                  top: `${topPercentage}%`,
                  translateX: '-50%',
                  translateY: '-50%',
                  width: `${circleSize}px`,
                  height: `${circleSize}px`,
                  opacity: isVisible ? 1 : 0,
                  scale: 0
                }}
                animate={{ 
                  top: `${topPercentage}%`,
                  translateX: '-50%',
                  translateY: '-50%',
                  width: `${circleSize}px`,
                  height: `${circleSize}px`,
                  opacity: isVisible ? 1 : 0,
                  scale: isVisible ? 1 : 0
                }}
                transition={{ 
                  duration: 0.4,
                  opacity: { duration: 0.3 },
                  scale: { 
                    type: "spring", 
                    visualDuration: 0.4, 
                    bounce: 0.3,
                  },
                  top: { 
                    duration: 0.6,
                    ease: "easeInOut"
                  },
                  width: { 
                    duration: 0.6,
                    ease: "easeInOut"
                  },
                  height: { 
                    duration: 0.6,
                    ease: "easeInOut"
                  }
                }}
              >
                <motion.span
                  animate={{
                    fontSize: `${circleSize * 0.4}px`
                  }}
                  transition={{
                    duration: 0.6,
                    ease: "easeInOut"
                  }}
                  style={{
                    lineHeight: 1
                  }}
                >
                  {stepEmojiMap[index as keyof typeof stepEmojiMap]}
                </motion.span>
              </motion.div>
            );
          })}
        </div>
      </div>
      </div>
    </div>
  );
}
